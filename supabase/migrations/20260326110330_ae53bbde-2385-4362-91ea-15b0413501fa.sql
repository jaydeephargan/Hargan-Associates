-- Create visitor_events table for tracking visitor interactions
CREATE TABLE public.visitor_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_visit', 'click', 'scroll', 'form', 'chat', 'exit_intent')),
  page_url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (visitors can write events)
CREATE POLICY "Anyone can insert visitor events"
  ON public.visitor_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admin) can read events
CREATE POLICY "Authenticated users can read visitor events"
  ON public.visitor_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for querying by session and time
CREATE INDEX idx_visitor_events_session ON public.visitor_events (session_id);
CREATE INDEX idx_visitor_events_created ON public.visitor_events (created_at DESC);
CREATE INDEX idx_visitor_events_type ON public.visitor_events (event_type);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_events;