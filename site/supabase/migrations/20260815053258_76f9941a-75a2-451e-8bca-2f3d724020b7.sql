CREATE TABLE public.quote_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage TEXT NOT NULL DEFAULT 'lead',
  city TEXT,
  service TEXT,
  home_type TEXT,
  bedrooms TEXT,
  full_bathrooms TEXT,
  half_baths TEXT,
  frequency TEXT,
  addons TEXT,
  first_clean_price NUMERIC,
  recurring_price NUMERIC,
  currency TEXT DEFAULT 'CAD',
  full_name TEXT,
  email TEXT,
  phone TEXT,
  page_url TEXT,
  tracking JSONB NOT NULL DEFAULT '{}'::jsonb,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ghl_ok BOOLEAN,
  ghl_status INTEGER,
  ghl_contact_id TEXT,
  ghl_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.quote_leads TO service_role;

ALTER TABLE public.quote_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client access to quote leads"
ON public.quote_leads
FOR ALL
USING (false)
WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_quote_leads_updated_at
BEFORE UPDATE ON public.quote_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();