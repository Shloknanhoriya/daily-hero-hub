import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    )

    // Get user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()

    const { data, error } = await supabaseClient.functions.invoke('ai-gateway', {
      body: {
        model: 'openai/gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant integrated into a Solo Leveling-style quest management system. Help users manage their tasks, set reminders, and stay motivated. Be encouraging and use gaming terminology when appropriate. Keep responses concise and actionable.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      }
    })

    if (error) {
      console.error('AI Gateway error:', error)
      throw error
    }

    // Award XP for interaction (only if user is authenticated)
    let xpAwarded = 0
    if (user) {
      try {
        const { data: xpData, error: xpError } = await supabaseClient.rpc('award_xp', {
          p_user_id: user.id,
          p_xp_amount: 5,
          p_activity_type: 'chat_interaction',
          p_description: 'Interacted with AI assistant'
        })
        
        if (!xpError && xpData && xpData.length > 0) {
          xpAwarded = 5
        }
      } catch (xpErr) {
        console.error('Error awarding XP:', xpErr)
        // Don't fail the whole request if XP fails
      }
    }

    return new Response(
      JSON.stringify({ 
        message: data.choices[0].message.content,
        xpAwarded: xpAwarded
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in chat function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
