
-- Restrict event_type to known values
ALTER TABLE visitor_events
  ADD CONSTRAINT valid_event_type
  CHECK (event_type IN ('page_visit', 'click', 'scroll', 'form', 'chat', 'exit_intent'));

-- Limit page_url length
ALTER TABLE visitor_events
  ADD CONSTRAINT valid_page_url_length
  CHECK (char_length(page_url) <= 2000);

-- Limit session_id length
ALTER TABLE visitor_events
  ADD CONSTRAINT valid_session_id_length
  CHECK (char_length(session_id) <= 100);
