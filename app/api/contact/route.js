import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();
    let userId = null;

    // Try to retrieve user session via Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (user) userId = user.id;
      } catch (e) {
        console.error('Error fetching user from token:', e);
      }
    }

    // Insert into messages table
    const { data: insertedMessage, error: insertError } = await supabaseAdmin
      .from('messages')
      .insert({
        user_id: userId,
        name,
        email,
        service: service || 'General Inquiry',
        message,
        status: 'Open'
      })
      .select()
      .single();

    if (insertError) {
      console.error('DB Insert Error:', insertError);
      return NextResponse.json({ error: 'Failed to save message: ' + insertError.message }, { status: 500 });
    }

    // Try sending email if SMTP settings are present
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        await transporter.sendMail({
          from: `"NovaCraft Contact Form" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || 'hello@novacraft.digital',
          subject: `New Inquiry from ${name} — ${service || 'General'}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #334155; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">New Contact Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Service:</strong> ${service || 'Not specified'}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-style: italic;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; text-align: center;">NovaCraft Digital</p>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error('Nodemailer failed to dispatch contact message:', mailErr);
      }
    }

    return NextResponse.json({ success: true, message: insertedMessage }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
