import { Resend } from 'resend';

// Lazy-load Resend client to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface InquiryEmailData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string | null;
  budget?: string | null;
  message: string;
}

/**
 * Send email notification to owner when new inquiry is submitted
 */
export async function sendInquiryNotification(data: InquiryEmailData) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!notificationEmail) {
    console.error('NOTIFICATION_EMAIL not configured');
    throw new Error('Email notification not configured');
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    throw new Error('Email service not configured');
  }

  const eventDateText = data.eventDate
    ? `<p><strong>Event Date:</strong> ${new Date(data.eventDate).toLocaleDateString()}</p>`
    : '';

  const budgetText = data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f0f4f0 0%, #e8ede8 100%); padding: 30px; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; color: #8B9D83; font-size: 24px; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
          .field { margin-bottom: 20px; }
          .field strong { color: #8B9D83; display: block; margin-bottom: 5px; }
          .message-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #8B9D83; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #8B9D83; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Inquiry Received</h1>
          </div>
          <div class="content">
            <p>You have received a new inquiry from your portfolio website!</p>
            
            <div class="field">
              <strong>Name:</strong>
              ${data.name}
            </div>
            
            <div class="field">
              <strong>Email:</strong>
              <a href="mailto:${data.email}">${data.email}</a>
            </div>
            
            <div class="field">
              <strong>Phone:</strong>
              <a href="tel:${data.phone}">${data.phone}</a>
            </div>
            
            <div class="field">
              <strong>Event Type:</strong>
              ${data.eventType}
            </div>
            
            ${eventDateText}
            ${budgetText}
            
            <div class="field">
              <strong>Message:</strong>
              <div class="message-box">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <p style="margin-top: 30px;">
              <strong>Next Steps:</strong><br>
              Reply to this inquiry within 24 hours for the best client experience.
            </p>
          </div>
          <div class="footer">
            <p>This email was sent from your DJ Coveno Portraits website contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Inquiry Received

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Event Type: ${data.eventType}
${data.eventDate ? `Event Date: ${new Date(data.eventDate).toLocaleDateString()}` : ''}
${data.budget ? `Budget: ${data.budget}` : ''}

Message:
${data.message}

---
Reply to this inquiry within 24 hours for the best client experience.
  `.trim();

  const client = getResendClient();
  
  if (!client) {
    console.error('Resend client not initialized - API key missing');
    throw new Error('Email service not configured');
  }

  try {
    const result = await client.emails.send({
      from: 'DJ Coveno Portraits <inquiries@djcovenoportraits.com>',
      to: [notificationEmail],
      replyTo: data.email,
      subject: `New ${data.eventType} Inquiry from ${data.name}`,
      html: htmlContent,
      text: textContent,
    });

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

