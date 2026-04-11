
CREATE TABLE public.instagram_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text,
  instagram_user_id text DEFAULT 'hargan_and_associates',
  display_enabled boolean NOT NULL DEFAULT true,
  stories_enabled boolean NOT NULL DEFAULT true,
  reels_enabled boolean NOT NULL DEFAULT true,
  last_fetched_at timestamp with time zone,
  cached_posts jsonb DEFAULT '[]'::jsonb,
  cached_stories jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.instagram_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read instagram settings" ON public.instagram_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can update instagram settings" ON public.instagram_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can insert instagram settings" ON public.instagram_settings FOR INSERT TO authenticated WITH CHECK (true);

INSERT INTO public.instagram_settings (instagram_user_id, display_enabled) VALUES ('hargan_and_associates', true);
