const nodemailer = require('nodemailer');
const db = require('../config/db');
const MessageModel = require('../models/Message');

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'bereketwoldemariam369@gmail.com';

/**
 * Creates and returns a Nodemailer transporter based on .env configuration.
 */
function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  // If host & port are explicitly provided (e.g. SMTP server)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass }
    });
  }

  // Default to standard Gmail service if using a Gmail address / App Password
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
}

/**
 * Sends a contact inquiry to Bereket's email and saves a copy in the database.
 */
async function sendContactEmail({ name, email, subject, message }) {
  let dbMessage = null;

  // 1. Save to MongoDB if database is connected
  if (db.getIsConnected()) {
    try {
      dbMessage = await MessageModel.create({
        name,
        email,
        subject: subject || 'Portfolio Contact Inquiry',
        message,
        status: 'received'
      });
    } catch (dbErr) {
      console.error('⚠️ [Database] Failed to save contact message:', dbErr.message);
    }
  }

  const transporter = createTransporter();

  // 2. If no SMTP credentials are set in .env
  if (!transporter) {
    console.log(`
ℹ️  [Contact Form Message Received]
   From: ${name} <${email}>
   Subject: ${subject || 'Portfolio Inquiry'}
   Message: ${message}
   ⚠️ Note: EMAIL_USER / EMAIL_PASS not set in .env yet. Message is saved in database.
    `);

    return {
      success: true,
      delivered: false,
      message: `Thank you, ${name}! Your message has been received.`,
      storedInDb: !!dbMessage
    };
  }

  // 3. Dispatch email via Nodemailer
  const mailSubject = `[Portfolio Contact] ${subject ? subject : 'New Message from ' + name}`;
  
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px; text-align: center;">
        <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">New Portfolio Inquiry</h2>
        <p style="margin: 6px 0 0 0; color: #e0e7ff; font-size: 13px;">Received from your professional portfolio website</p>
      </div>

      <div style="padding: 28px; background-color: #0f172a;">
        <div style="background-color: #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid #334155;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 100px; font-weight: 600;">Sender:</td>
              <td style="padding: 6px 0; color: #f1f5f9; font-weight: 700;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #818cf8; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Subject:</td>
              <td style="padding: 6px 0; color: #f1f5f9;">${subject || 'General Inquiry'}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155;">
          <h4 style="margin: 0 0 10px 0; color: #a5b4fc; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message Content:</h4>
          <p style="margin: 0; line-height: 1.6; color: #e2e8f0; font-size: 15px; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Portfolio Inquiry')}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">Reply to ${name}</a>
        </div>
      </div>

      <div style="background-color: #020617; padding: 16px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
        Bereket Woldemariyam Portfolio Notification System
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${name} (via Portfolio)" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: RECIPIENT_EMAIL,
      subject: mailSubject,
      text: `New Portfolio Message from ${name} (${email}):\n\nSubject: ${subject || 'None'}\n\nMessage:\n${message}`,
      html: htmlBody
    });

    console.log(`✅ [Email Service] Message sent successfully to ${RECIPIENT_EMAIL} (Message ID: ${info.messageId})`);

    if (dbMessage) {
      dbMessage.sentToEmail = true;
      dbMessage.status = 'emailed';
      await dbMessage.save();
    }

    return {
      success: true,
      delivered: true,
      messageId: info.messageId,
      message: `Thank you, ${name}! Your message has been delivered to Bereket's inbox.`
    };
  } catch (mailErr) {
    console.error('❌ [Email Service] Failed to send email via SMTP:', mailErr.message);

    if (dbMessage) {
      dbMessage.status = 'failed';
      dbMessage.errorDetails = mailErr.message;
      await dbMessage.save();
    }

    return {
      success: true,
      delivered: false,
      warning: `Your message was saved, but email forwarding encountered an issue: ${mailErr.message}`,
      message: `Thank you, ${name}! Your message has been received.`
    };
  }
}

module.exports = {
  sendContactEmail
};
