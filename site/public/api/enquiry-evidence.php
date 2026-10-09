<?php
declare(strict_types=1);

function dc_enquiry_candidate(array $payload): bool {
    $source=(string)($payload['source']??'');
    // General messages can be complaints or access updates; they do not
    // automatically establish a new purchase enquiry for marketing.
    return ($payload['stage']??'')==='confirm' && in_array($source,[
        'dutycleaners.ca instant quote',
        'dutycleaners.ca instant quote (call-back requested)',
        'dutycleaners.ca instant quote (fast fill — verify)',
        'dutycleaners.ca instant quote (fast fill — verify) (call-back requested)',
    ],true);
}

/** Original durable server receipt only; client submitted_at is never used. */
function dc_enquiry_receipt(array $record, int $now): array {
    $raw=$record['created_at']??null;
    $id=$record['receipt_id']??null;
    if(!is_string($raw)||!preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|\+00:00)$/D',$raw)
        || !is_string($id)||!preg_match('/^[a-f0-9]{32}$/D',$id)) throw new RuntimeException('enquiry receipt invalid');
    $at=new DateTimeImmutable($raw);
    $errors=DateTimeImmutable::getLastErrors();
    if(($errors!==false&&($errors['warning_count']||$errors['error_count']))||$at->getTimestamp()>$now+60) throw new RuntimeException('enquiry receipt time invalid');
    return ['date'=>$at->setTimezone(new DateTimeZone('America/Edmonton'))->format('Y-m-d'),
        'evidence'=>'Website enquiry; server receipt '.$id.'; received '.$at->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s\Z')];
}

/** Preserve a newer verified enquiry and an existing same-day evidence record. */
function dc_enquiry_plan(array $receipt, array $contact, string $dateId, string $evidenceId): array {
    $values=[];
    foreach(($contact['customFields']??[]) as $field) if(isset($field['id']))$values[$field['id']]=$field['value']??$field['field_value']??'';
    $current=$values[$dateId]??'';
    if(!is_string($current))throw new RuntimeException('enquiry date shape invalid');
    if($current!==''){
        if(!preg_match('/^\d{4}-\d{2}-\d{2}$/D',$current)||!checkdate((int)substr($current,5,2),(int)substr($current,8,2),(int)substr($current,0,4)))throw new RuntimeException('enquiry date invalid');
        if($current>$receipt['date']||($current===$receipt['date']&&trim((string)($values[$evidenceId]??''))!==''))return [];
    }
    return [['id'=>$dateId,'field_value'=>$receipt['date']],['id'=>$evidenceId,'field_value'=>$receipt['evidence']]];
}

function dc_enquiry_update(array $config,array $headers,string $contactId,array $record): void {
    $receipt=dc_enquiry_receipt($record,time());
    $dateId=dc_ghl_optional_field_id($config,'contact.last_qualifying_enquiry_date');
    $evidenceId=dc_ghl_optional_field_id($config,'contact.qualifying_enquiry_evidence');
    if($dateId===null||$evidenceId===null)throw new RuntimeException('enquiry fields missing');
    $lockPath=dc_ghl_queue_dir($config).DIRECTORY_SEPARATOR.'enquiry-'.hash_hmac('sha256',$contactId,$config['encryption_key']).'.lock';
    $lock=@fopen($lockPath,'c+');
    if($lock===false||!flock($lock,LOCK_EX)){if(is_resource($lock))fclose($lock);throw new RuntimeException('enquiry lock unavailable');}
    @touch($lockPath); // Last use: dc_ghl_prune_locks() removes it after an idle hour.
    try {
        $url=DC_GHL_API.'/contacts/'.rawurlencode($contactId);
        [$status,$body]=dc_ghl_http($url,'GET',$headers);
        $contact=json_decode($body,true)['contact']??null;
        if($status!==200||!is_array($contact)||($contact['id']??null)!==$contactId)throw new RuntimeException('enquiry contact read failed');
        $fields=dc_enquiry_plan($receipt,$contact,$dateId,$evidenceId);
        if($fields===[])return;
        [$status]=dc_ghl_http($url,'PUT',$headers,json_encode(['customFields'=>$fields],JSON_THROW_ON_ERROR));
        if($status<200||$status>=300)throw new RuntimeException('enquiry field update failed');
        [$status,$body]=dc_ghl_http($url,'GET',$headers);
        $after=json_decode($body,true)['contact']??null;
        $verified=[];
        foreach(($after['customFields']??[]) as $field)if(isset($field['id']))$verified[$field['id']]=$field['value']??$field['field_value']??'';
        if($status!==200||!is_array($after)||($after['id']??null)!==$contactId||($verified[$dateId]??null)!==$receipt['date']||($verified[$evidenceId]??null)!==$receipt['evidence'])throw new RuntimeException('enquiry update verification failed');
    } finally {flock($lock,LOCK_UN);fclose($lock);}
}
