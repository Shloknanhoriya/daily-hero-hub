import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const CHAT_API_URL = Deno.env.get("CHAT_API_URL");
    const CHAT_API_KEY = Deno.env.get("CHAT_API_KEY");

    if (!CHAT_API_URL) throw new Error("CHAT_API_URL is not configured");

    console.log("Chat request received with", messages.length, "messages");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (CHAT_API_KEY) {
      headers.Authorization = `Bearer ${CHAT_API_KEY}`;
    }

    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful AI assistant for a Solo Leveling-inspired quest management system. You help users set reminders, manage their quests, and provide motivation. When users ask to set a reminder, acknowledge it and suggest they add it as a quest in their system. Keep responses concise and energetic, like a game system would."
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI provider error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI provider error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    return new Response(
      JSON.stringify({ message: data.choices[0].message.content }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
