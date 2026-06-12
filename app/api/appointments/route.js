import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import nodemailer from 'nodemailer';

const PLATFORM_LINKS = {
  'google-meet': 'https://meet.google.com/new',
  'zoom':        'https://zoom.us/start/videomeeting',
  'whatsapp':    'https://wa.me/917875652144',
};

const PLATFORM_LABELS = {
  'google-meet': 'Google Meet',
  'zoom':        'Zoom',
  'whatsapp':    'WhatsApp Call',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, notes, service, date, time, platform } = body;

    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Save appointment to DB
    const { error: dbError } = await supabaseAdmin
      .from('appointments')
      .insert({
        name,
        email,
        phone,
        notes: notes || '',
        service: service || 'General Inquiry',
        appointment_date: date,
        appointment_time: time,
        platform: platform || 'google-meet',
        status: 'pending',
      });

    if (dbError) {
      console.error('DB Insert Error:', dbError);
      return NextResponse.json({ error: 'Failed to save appointment: ' + dbError.message }, { status: 500 });
    }

    const meetingLink = PLATFORM_LINKS[platform] || PLATFORM_LINKS['google-meet'];
    const platformLabel = PLATFORM_LABELS[platform] || 'Google Meet';
    const apptDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    // Send emails via SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST  || 'smtp.gmail.com',
        port:   Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // ── Email to CLIENT ─────────────────────────────────────────────────────
      const clientHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1D4ED8, #7C3AED); padding: 36px 32px; text-align: center;">
            <h1 style="color: #fff; font-size: 1.6rem; margin: 0; font-weight: 800;">Appointment Confirmed! 🎉</h1>
            <p style="color: rgba(255,255,255,0.85); font-size: 0.9rem; margin: 8px 0 0;">NovaCraft Digital · Free Consultation</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px; background: #ffffff;">
            <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">
              Your free consultation with <strong>NovaCraft Digital</strong> has been scheduled. Here are your booking details:
            </p>

            <!-- Details Card -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #64748B; font-weight: 600; width: 40%;">📅 Date</td>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #0F172A; font-weight: 700;">${apptDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #64748B; font-weight: 600;">⏰ Time</td>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #0F172A; font-weight: 700;">${time} IST</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #64748B; font-weight: 600;">🎥 Platform</td>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #0F172A; font-weight: 700;">${platformLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #64748B; font-weight: 600;">💼 Topic</td>
                  <td style="padding: 8px 0; font-size: 0.85rem; color: #0F172A; font-weight: 700;">${service}</td>
                </tr>
              </table>
            </div>

            <!-- Join Button -->
            <div style="text-align: center; margin: 24px 0;">
              <a href="${meetingLink}" style="display: inline-block; background: linear-gradient(135deg, #1D4ED8, #7C3AED); color: #fff; padding: 14px 32px; border-radius: 10px; font-size: 0.95rem; font-weight: 700; text-decoration: none;">
                🔗 Join ${platformLabel} Meeting
              </a>
            </div>

            <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 10px; padding: 14px 16px; font-size: 0.82rem; color: #92400E; line-height: 1.5;">
              ⚠️ Our team will confirm your exact meeting link within 2 hours via email or WhatsApp. If you don't hear back, contact us at <a href="tel:7875652144" style="color: #1D4ED8;">7875652144</a>.
            </div>

            ${notes ? `<p style="font-size: 0.85rem; color: #475569; margin-top: 16px;"><strong>Your Notes:</strong> ${notes}</p>` : ''}
          </div>

          <!-- Footer -->
          <div style="background: #F8FAFC; padding: 20px 32px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="font-size: 0.75rem; color: #94A3B8; margin: 0;">
              NovaCraft Digital · hello@novacraft.digital · +91 7875652144
            </p>
          </div>
        </div>
      `;

      // ── Email to ADMIN ──────────────────────────────────────────────────────
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #2563eb; margin-bottom: 16px;">📅 New Appointment Booked</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Name</td><td style="font-weight:700; font-size:0.85rem;">${name}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Email</td><td style="font-weight:700; font-size:0.85rem;">${email}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Phone</td><td style="font-weight:700; font-size:0.85rem;">${phone}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Service</td><td style="font-weight:700; font-size:0.85rem;">${service}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Date</td><td style="font-weight:700; font-size:0.85rem;">${apptDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Time</td><td style="font-weight:700; font-size:0.85rem;">${time} IST</td></tr>
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Platform</td><td style="font-weight:700; font-size:0.85rem;">${platformLabel}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748B; font-size:0.85rem;">Notes</td><td style="font-size:0.85rem;">${notes || '—'}</td></tr>
          </table>
          <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 20px;">⚡ Please confirm and send the meeting link to the client within 2 hours.</p>
        </div>
      `;

      try {
        // To client
        await transporter.sendMail({
          from: `"NovaCraft Digital" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: email,
          subject: `✅ Your Appointment is Confirmed — ${apptDate} at ${time} IST`,
          html: clientHtml,
        });

        // To admin
        await transporter.sendMail({
          from: `"NovaCraft Appointments" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER,
          subject: `📅 New Appointment: ${name} — ${apptDate} at ${time}`,
          html: adminHtml,
        });
      } catch (mailErr) {
        console.error('Appointment email error:', mailErr);
        // Do not fail the request — DB already saved
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Appointment API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
