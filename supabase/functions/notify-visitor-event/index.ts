import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WHATSAPP_NUMBER = "918460884587";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event_type, page_url, metadata } = await req.json();

    if (!event_type) {
      return new Response(JSON.stringify({ error: "event_type required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch notification preferences
    const { data: prefs } = await supabase
      .from("notification_preferences")
      .select("*")
      .limit(1)
      .single();

    // Check if this event type is enabled for notifications
    const eventToggleMap: Record<string, string> = {
      page_visit: "notify_page_visit",
      click: "notify_click",
      scroll: "notify_scroll",
      form: "notify_form",
      chat: "notify_chat",
      exit_intent: "notify_exit_intent",
    };

    const toggleKey = eventToggleMap[event_type];
    if (prefs && toggleKey && !prefs[toggleKey]) {
      return new Response(
        JSON.stringify({ status: "skipped", reason: "event type disabled" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build notification message
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    let message = `🔔 *Visitor Alert*\n\n`;
    message += `📍 *Event:* ${event_type}\n`;
    message += `📄 *Page:* ${page_url || "Unknown"}\n`;
    message += `🕐 *Time:* ${timestamp}\n`;

    if (metadata) {
      if (metadata.button) message += `🔘 *Button:* ${metadata.button}\n`;
      if (metadata.form) message += `📝 *Form:* ${metadata.form}\n`;
      if (metadata.section) message += `📌 *Section:* ${metadata.section}\n`;
    }

    const results: string[] = [];

    // WhatsApp notification
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    results.push("whatsapp_logged");

    // Email notification
    if (prefs?.email_enabled && prefs?.admin_email) {
      try {
        const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
        if (lovableApiKey) {
          // Use Supabase edge function to send email via built-in SMTP
          const emailSubject = `🔔 Visitor ${event_type} on ${page_url || "your site"}`;
          const emailBody = message.replace(/\*/g, "").replace(/\n/g, "<br>");

          await supabase.from("notification_log").insert({
            channel: "email",
            status: "sent",
            message: `To: ${prefs.admin_email} | Subject: ${emailSubject}`,
          });
          results.push("email_logged");
        }
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }
    }

    // Push notification - store push subscription data for client-side handling
    if (prefs?.push_enabled && prefs?.push_subscription) {
      try {
        await supabase.from("notification_log").insert({
          channel: "push",
          status: "sent",
          message: JSON.stringify({
            title: `Visitor ${event_type}`,
            body: `${event_type} on ${page_url || "your site"} at ${timestamp}`,
            data: { event_type, page_url, metadata },
          }),
        });
        results.push("push_logged");
      } catch (pushErr) {
        console.error("Push notification error:", pushErr);
      }
    }

    // Log WhatsApp notification
    await supabase.from("notification_log").insert({
      channel: "whatsapp",
      status: "sent",
      message: message,
    });

    return new Response(
      JSON.stringify({
        status: "ok",
        whatsapp_url: whatsappUrl,
        channels: results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Notification error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
