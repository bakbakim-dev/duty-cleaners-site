-- A browser retry must update the same durable receipt, never create a second
-- lead. Delivery metadata turns quote_leads into the small retry queue the
-- funnel needs when GHL is temporarily unavailable.
ALTER TABLE public.quote_leads
  ADD COLUMN IF NOT EXISTS request_id UUID,
  ADD COLUMN IF NOT EXISTS delivery_state TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS ghl_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ghl_last_attempt_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS ghl_next_retry_at TIMESTAMP WITH TIME ZONE DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS quote_leads_request_id_unique
  ON public.quote_leads (request_id)
  WHERE request_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS quote_leads_pending_delivery
  ON public.quote_leads (ghl_next_retry_at)
  WHERE ghl_ok IS NOT TRUE AND ghl_attempts < 6;

ALTER TABLE public.quote_leads
  DROP CONSTRAINT IF EXISTS quote_leads_delivery_state_check;

ALTER TABLE public.quote_leads
  ADD CONSTRAINT quote_leads_delivery_state_check
  CHECK (delivery_state IN ('pending', 'delivered', 'failed'));
