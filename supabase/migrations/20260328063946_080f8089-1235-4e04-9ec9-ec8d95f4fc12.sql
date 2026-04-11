CREATE TABLE public.notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.visitor_events(id) ON DELETE SET NULL,
  channel text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read notification logs"
  ON public.notification_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert notification logs"
  ON public.notification_log FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);