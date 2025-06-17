
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_details } = await req.json()

    // Get Razorpay credentials from environment (secure backend storage)
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    console.log('Verifying payment:', razorpay_payment_id)

    // Verify signature using HMAC-SHA256
    const crypto = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    const body = razorpay_order_id + "|" + razorpay_payment_id
    
    const encoder = new TextEncoder()
    const keyData = encoder.encode(razorpayKeySecret)
    const messageData = encoder.encode(body)
    
    const cryptoKey = await crypto.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const isValid = expectedSignature === razorpay_signature

    console.log('Payment verification result:', isValid)

    // If payment is verified, update order in database
    if (isValid && order_details && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      // Update order with payment details
      const { error: updateError } = await supabase
        .from('orders')
        .insert({
          ...order_details,
          payment_status: 'completed',
          payment_method: 'razorpay',
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature
        })

      if (updateError) {
        console.error('Error updating order:', updateError)
        throw new Error('Failed to update order in database')
      }

      console.log('Order updated successfully in database')
    }

    return new Response(
      JSON.stringify({ success: true, verified: isValid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to verify payment' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
