<?php
declare(strict_types=1);
// Call-back task library: ghl-quote.php requires it and calls it through
// dc_ghl_callback_maybe() for every new call-back request. No entry point.
// Caller must hold the existing per-request delivery lock and persist $state
// through $save before any POST. Uses the established GHL contact-task API.
function dc_callback_slot(string $received): array {
    $zone=new DateTimeZone('America/Edmonton');
    $at=(new DateTimeImmutable($received))->setTimezone($zone);
    $day=(int)$at->format('N');
    // Call-back hours (owner, 2026-10-06): Mon-Fri 8:00-20:00, Sat 8:00-18:00, Sun 9:00-15:00.
    $start=$day===7?9:8; $end=$day<=5?20:($day===6?18:15);
    $open=$at->setTime($start,0); $close=$at->setTime($end,0);
    if($at<$open)$at=$open;
    elseif($at>=$close){$at=$at->modify('+1 day');$at=$at->setTime((int)$at->format('N')===7?9:8,0);}
    $weekend=(int)$at->format('N')>=6;
    return ['dueDate'=>$at->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:s\Z'),
        'assignedTo'=>$weekend?'VN18G5NOq8hFMxzETT49':'Q025D9sWDzPXv3HxAI9f',
        'owner'=>$weekend?'Gelica':'Sherree'];
}

function dc_callback_task(string $contactId,string $requestId,string $received,array $state,callable $http,callable $save): array {
    if(!preg_match('/^[A-Za-z0-9_-]{1,100}$/',$contactId)||$requestId==='')throw new InvalidArgumentException('Invalid callback identity');
    $marker='Office callback reference: '.hash('sha256',$requestId);
    // A saved task receipt also covers a completed task; never recreate it.
    if(($state['status']??'')==='saved'&&!empty($state['task_id']))return $state;
    [$status,$data]=$http('GET','/contacts/'.rawurlencode($contactId).'/tasks',null);
    if($status<200||$status>=300||!is_array($data['tasks']??null))return [...$state,'status'=>($state['status']??'pending'),'issue'=>'task lookup unavailable'];
    $found=array_values(array_filter($data['tasks'],static fn($t)=>is_array($t)&&str_contains((string)($t['body']??''),$marker)));
    if(count($found)>1){$state=[...$state,'status'=>'review','issue'=>'multiple tasks match request'];$save($state);return $state;}
    if(count($found)===1&&!empty($found[0]['id'])){$state=[...$state,'status'=>'saved','task_id'=>$found[0]['id'],'issue'=>null];$save($state);return $state;}
    // Once a POST was attempted, lack of a lookup match does not establish
    // failure. Timeout/crash recovery stays in review, never blind reposts.
    if(in_array($state['status']??'',['posting','uncertain','review'],true))return [...$state,'issue'=>'office must reconcile uncertain task creation'];
    $slot=dc_callback_slot($received);
    $task=['title'=>'Call requested — check latest enquiry','body'=>"The customer requested a callback. Check their latest enquiry, BookingKoala booking and Dialpad history before calling.\n\nIf there is no answer, the line is busy or you leave voicemail, record the attempt and keep quote follow-up running. After a meaningful conversation, move the current open Sales card to Talking to stop the short quote follow-up, and record the agreed next action with its date. A connected call alone is not proof of a meaningful conversation.\n\nKeep the existing case owner until a handoff is accepted. Do not reopen or change a previous Won sale just because a callback was requested. Complete this task after the call attempt is recorded; create one dated next-action task if more work is needed.\n\n".$marker,
        'dueDate'=>$slot['dueDate'],'completed'=>false,'assignedTo'=>$slot['assignedTo']];
    $state=[...$state,'status'=>'posting','marker'=>$marker,'dueDate'=>$slot['dueDate'],'assignedTo'=>$slot['assignedTo']];
    $save($state); // Required durable intent: if this fails, no POST occurs.
    try {[$status,$data]=$http('POST','/contacts/'.rawurlencode($contactId).'/tasks',$task);}catch(Throwable){$status=0;$data=[];}
    if($status>=200&&$status<300&&!empty($data['task']['id']))$state=[...$state,'status'=>'saved','task_id'=>$data['task']['id'],'issue'=>null];
    else $state=[...$state,'status'=>'uncertain','issue'=>'task create acknowledgement missing','http_status'=>$status];
    $save($state);return $state;
}
