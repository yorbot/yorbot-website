
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR', receipt, payment_method = 'card' } = await req.json()

    // Get Razorpay credentials from environment (stored securely)
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    console.log('Creating Razorpay order for amount:', amount, 'method:', payment_method)

    // Create Razorpay order
    let orderData: any = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1
    }

    // Add UPI-specific configuration for QR code generation
    if (payment_method === 'upi') {
      orderData = {
        ...orderData,
        method: {
          upi: {
            flow: "collect",
            vpa: "auto"
          }
        }
      }
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Razorpay API error:', errorData)
      throw new Error(`Razorpay API error: ${response.status} - ${errorData}`)
    }

    const order = await response.json()
    console.log('Razorpay order created successfully:', order.id)

    // For UPI, generate QR code data
    let qrCodeData = null
    if (payment_method === 'upi') {
      // Generate UPI QR code using Razorpay's UPI link
      const upiString = `upi://pay?pa=${razorpayKeyId.replace('rzp_live_', '')}@razorpay&pn=YorBot&am=${amount}&cu=INR&tn=Payment for Order ${receipt}`
      qrCodeData = {
        upi_string: upiString,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        order,
        qr_code_data: qrCodeData,
        razorpay_key_id: razorpayKeyId // Safe to send public key
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create order' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
