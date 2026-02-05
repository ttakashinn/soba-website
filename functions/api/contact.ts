/// <reference types="@cloudflare/workers-types" />

interface ContactFormData {
  name: string
  email: string
  phone: string
  company?: string
  service?: string
  message: string
  language: string
}

interface Env {
  NOTIFY_WEBHOOK_URL: string
}

interface ValidationError {
  field: string
  error: string
}

function validateFormData(data: ContactFormData): ValidationError[] {
  const errors: ValidationError[] = []
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const phoneRegex = /^[0-9+\-\s()]{9,15}$/

  // Name validation
  if (!data.name?.trim()) {
    errors.push({ field: 'name', error: 'required' })
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', error: 'minLength' })
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', error: 'maxLength' })
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.push({ field: 'email', error: 'required' })
  } else if (!emailRegex.test(data.email.trim())) {
    errors.push({ field: 'email', error: 'invalid' })
  }

  // Phone validation
  if (!data.phone?.trim()) {
    errors.push({ field: 'phone', error: 'required' })
  } else if (!phoneRegex.test(data.phone.trim())) {
    errors.push({ field: 'phone', error: 'invalid' })
  }

  // Message validation
  if (!data.message?.trim()) {
    errors.push({ field: 'message', error: 'required' })
  } else if (data.message.trim().length < 10) {
    errors.push({ field: 'message', error: 'minLength' })
  } else if (data.message.trim().length > 2000) {
    errors.push({ field: 'message', error: 'maxLength' })
  }

  return errors
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const formData: ContactFormData = await request.json()

    // Validate form data
    const validationErrors = validateFormData(formData)
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Validation failed', errors: validationErrors }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    // Get webhook URL from environment
    const webhookUrl = env.NOTIFY_WEBHOOK_URL
    if (!webhookUrl) {
      console.error('NOTIFY_WEBHOOK_URL not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Webhook not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    // Build notification message
    const serviceLabels: Record<string, string> = {
      'digital-transformation': 'Digital Transformation / Chuyển đổi số / DX',
      'outsourcing': 'IT Outsourcing / Gia công phần mềm',
      'bpo': 'BPO Services / Dịch vụ BPO',
      'other': 'Other / Khác / その他',
    }

    const languageLabels: Record<string, string> = {
      vi: '🇻🇳 Vietnamese',
      en: '🇺🇸 English',
      ja: '🇯🇵 Japanese',
    }

    const message = `📬 **New Contact Form Submission**

👤 **Name:** ${formData.name}
📧 **Email:** ${formData.email}
📱 **Phone:** ${formData.phone}
🏢 **Company:** ${formData.company || 'N/A'}
🔧 **Service:** ${formData.service ? serviceLabels[formData.service] || formData.service : 'N/A'}
🌐 **Language:** ${languageLabels[formData.language] || formData.language}

💬 **Message:**
${formData.message}

---
_Submitted at: ${new Date().toISOString()}_`

    // Send to webhook (Pumble format)
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
      }),
    })

    if (!webhookResponse.ok) {
      console.error('Webhook failed:', webhookResponse.status, await webhookResponse.text())
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to send notification' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
