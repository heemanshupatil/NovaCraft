import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const supabaseAdmin = createAdminClient();

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    // 2. Check if user has admin role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 3. Parse and validate body parameters
    const body = await request.json();
    const { messageId, replyText } = body;

    if (!messageId || !replyText || !replyText.trim()) {
      return NextResponse.json({ error: 'Missing messageId or replyText' }, { status: 400 });
    }

    // 4. Retrieve the existing message record to get customer info & original message
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      return NextResponse.json({ error: 'Support message not found' }, { status: 404 });
    }

    // 5. Update admin reply and status in messages table
    const { data: updatedMessage, error: updateError } = await supabaseAdmin
      .from('messages')
      .update({
        admin_reply: replyText.trim(),
        reply_date: new Date().toISOString(),
        status: 'Resolved',
      })
      .eq('id', messageId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update message: ' + updateError.message }, { status: 500 });
    }

    // 6. Send notification/reply email via Nodemailer if configured
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
        });

        const htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #0f172a; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 28px; font-weight: bold; color: #0f172a;">Nova<span style="color: #2563eb;">Craft</span></span>
            </div>
            
            <h2 style="color: #1e293b; margin-top: 0; text-align: center; font-size: 20px;">New Support Message Reply</h2>
            
            <p style="font-size: 15px; color: #334155;">Hello <strong>${message.name}</strong>,</p>
            
            <p style="font-size: 15px; color: #334155;">
              Our team has reviewed your inquiry regarding <strong>${message.service}</strong> and submitted the following reply:
            </p>

            <div style="background-color: #f1f5f9; border-left: 4px solid #2563eb; border-radius: 6px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #1e3a8a;">Sarah from NovaCraft:</p>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #1e293b; white-space: pre-line;">${replyText.trim()}</p>
            </div>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 24px 0;">
              <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Your Original Message:</h4>
              <p style="margin: 0; font-size: 14px; color: #64748b; font-style: italic;">
                "${message.message}"
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; margin-bottom: 10px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://novacraft.digital'}/dashboard" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: bold; color: #ffffff; background-color: #2563eb; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                View Support History
              </a>
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
              If you have any questions or need custom assistance, feel free to reply to this email or start a chat with our support team.
            </p>
            <p style="font-size: 11px; color: #cbd5e1; text-align: center; margin-top: 8px;">
              NovaCraft Digital &copy; 2026. All rights reserved.
            </p>
          </div>
        `;

        await transporter.sendMail({
          from: `"NovaCraft Digital" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: message.email,
          subject: `Re: Your Inquiry on ${message.service} — NovaCraft Support`,
          html: htmlContent,
        });
      } catch (mailErr) {
        console.error('Nodemailer failed to dispatch reply message:', mailErr);
      }
    }

    return NextResponse.json({ success: true, message: updatedMessage });

  } catch (error) {
    console.error('Support reply admin API error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
