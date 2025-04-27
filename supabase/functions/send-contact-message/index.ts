
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Get request body
    const { name, email, subject, message } = await req.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, subject, and message are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store the message in the database
    const { data, error } = await supabaseClient
      .from('contact_messages')
      .insert([{ name, email, subject, message }])
      .select()

    if (error) {
      console.error('Error storing message:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to store message' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    // Attempt to send notification email (this can be implemented with a proper email service)
    try {
      // This would be where you integrate with an email service like Resend, SendGrid, etc.
      console.log('Would send email notification to yorbot21@gmail.com about new contact message')
      
      // For now we'll just log the message details
      console.log(`New contact message from: ${name} (${email})`)
      console.log(`Subject: ${subject}`)
      console.log(`Message: ${message}`)
    } catch (emailError) {
      console.error('Error sending email notification:', emailError)
      // We'll continue even if email fails, since we stored the message in the database
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully',
        data: data[0]
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
