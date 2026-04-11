
CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email text,
  email_enabled boolean NOT NULL DEFAULT false,
  push_enabled boolean NOT NULL DEFAULT true,
  push_subscription jsonb,
  notify_page_visit boolean NOT NULL DEFAULT true,
  notify_click boolean NOT NULL DEFAULT true,
  notify_scroll boolean NOT NULL DEFAULT false,
  notify_form boolean NOT NULL DEFAULT true,
  notify_chat boolean NOT NULL DEFAULT true,
  notify_exit_intent boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notification preferences"
  ON public.notification_preferences FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update notification preferences"
  ON public.notification_preferences FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can insert notification preferences"
  ON public.notification_preferences FOR INSERT TO authenticated
  WITH CHECK (true);

-- Insert default row
INSERT INTO public.notification_preferences (admin_email, email_enabled, push_enabled)
VALUES ('advjbhoffice@gmail.com', true, true);
