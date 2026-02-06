import type { APIRoute } from 'astro'

export const prerender = false

interface ContactFormData {
  type?: 'assessment' | 'contact'
  name: string
  email: string
  phone: string
  company?: string
  position?: string
  service?: string
  message?: string
  language: string
  // Assessment specific fields
  scores?: {
    tech: number
    process: number
    people: number
  }
  overallScore?: number
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

  // Message validation (only for contact form)
  if (data.type === 'contact') {
    if (!data.message?.trim()) {
      errors.push({ field: 'message', error: 'required' })
    } else if (data.message.trim().length < 10) {
      errors.push({ field: 'message', error: 'minLength' })
    } else if (data.message.trim().length > 2000) {
      errors.push({ field: 'message', error: 'maxLength' })
    }
  }

  return errors
}

export const POST: APIRoute = async ({ request }) => {
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

    // In development mode, just log and return success
    if (import.meta.env.DEV) {
      console.log('📧 Form submission (DEV MODE):', {
        type: formData.type || 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        ...(formData.type === 'assessment' && {
          scores: formData.scores,
          overallScore: formData.overallScore,
        }),
      })

      return new Response(
        JSON.stringify({ success: true, message: 'Form submitted successfully (dev mode)' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    // In production, this would forward to the webhook
    // For now, we'll use the Cloudflare Pages Function which handles the actual webhook
    const webhookUrl = import.meta.env.NOTIFY_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('NOTIFY_WEBHOOK_URL not configured')
      return new Response(
        JSON.stringify({ success: true, message: 'Form submitted (webhook not configured)' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    // Build notification message
    let message = ''

    if (formData.type === 'assessment') {
      message = `📊 New Digital Readiness Assessment\n\n` +
        `👤 Contact:\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Company: ${formData.company || 'N/A'}\n` +
        `Position: ${formData.position || 'N/A'}\n\n` +
        `📈 Scores:\n` +
        `Technology: ${formData.scores?.tech || 0}/6\n` +
        `Process: ${formData.scores?.process || 0}/6\n` +
        `People: ${formData.scores?.people || 0}/6\n` +
        `Overall: ${formData.overallScore || 0}/18\n\n` +
        `🌐 Language: ${formData.language}`
    } else {
      message = `📬 New Contact Form Submission\n\n` +
        `👤 Contact:\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Company: ${formData.company || 'N/A'}\n` +
        `Service: ${formData.service || 'N/A'}\n\n` +
        `💬 Message:\n${formData.message}\n\n` +
        `🌐 Language: ${formData.language}`
    }

    // Send to webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed: ${webhookResponse.status}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Form submitted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    console.error('Contact form error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
}

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
