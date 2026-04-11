
-- Fix 1: Restrict notification_preferences SELECT to authenticated only
DROP POLICY "Anyone can read notification preferences" ON notification_preferences;
CREATE POLICY "Only authenticated users can read notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (true);

-- Fix 2: Restrict instagram_settings SELECT to authenticated only
DROP POLICY "Anyone can read instagram settings" ON instagram_settings;
CREATE POLICY "Only authenticated users can read instagram settings"
  ON instagram_settings FOR SELECT
  TO authenticated
  USING (true);

-- Fix 3: Add UPDATE policy on blog-images storage bucket
CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');
