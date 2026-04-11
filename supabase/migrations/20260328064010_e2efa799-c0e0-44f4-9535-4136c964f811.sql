DROP POLICY "System can insert notification logs" ON public.notification_log;

CREATE POLICY "Only service role can insert notification logs"
  ON public.notification_log FOR INSERT
  TO authenticated
  WITH CHECK (false);