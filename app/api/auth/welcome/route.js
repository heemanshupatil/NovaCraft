import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email || !name) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Double check / update profile flag
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('welcome_sent')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.welcome_sent) {
      return NextResponse.json({ message: 'Welcome email already sent' }, { status: 200 });
    }

    // 2. Configure NodeMailer Transporter
    // SMTP configurations
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novacraft.digital';

    // 3. Send email dispatches
    await transporter.sendMail({
      from: `"NovaCraft Digital" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to NovaCraft Digital! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #0f172a; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1d4ed8; margin-bottom: 6px;">Welcome to NovaCraft Digital, ${name}!</h2>
          <p style="font-size: 15px;">We're thrilled to have you join our platform. NovaCraft builds high-performance web systems and optimizes social media growth campaigns for stores and brands worldwide.</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 8px 0; color: #334155;">Next Steps:</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569;">
              <li style="margin-bottom: 6px;"><strong>Select a Plan</strong>: Review packages on our <a href="${siteUrl}/pricing" style="color: #1d4ed8; text-decoration: none; font-weight: bold;">Pricing Page</a>.</li>
              <li style="margin-bottom: 6px;"><strong>Track Orders</strong>: Follow development progress and check receipt confirmations inside your <a href="${siteUrl}/dashboard" style="color: #1d4ed8; text-decoration: none; font-weight: bold;">Client Dashboard</a>.</li>
              <li style="margin-bottom: 0;"><strong>Direct Communication</strong>: Book kickoff meetings or discuss custom scopes via live support chat widget.</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; margin-top: 24px;">If you have any questions, reply directly to this email or speak with Sarah in the support center.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">NovaCraft Digital &copy; 2026. All rights reserved.</p>
        </div>
      `,
    });

    // 4. Set welcome_sent to true in profiles database table
    await supabaseAdmin
      .from('profiles')
      .update({ welcome_sent: true })
      .eq('id', userId);

    return NextResponse.json({ success: true, message: 'Welcome email sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Welcome email route error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
