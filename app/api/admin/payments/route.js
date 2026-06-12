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
    const { paymentId, status, adminNotes } = body;

    if (!paymentId || !status) {
      return NextResponse.json({ error: 'Missing paymentId or status' }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // 4. Retrieve the existing payment record to get customer info & plan details
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    // 5. Update status and notes in payments table
    const { data: updatedPayment, error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        status,
        admin_notes: adminNotes || null,
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update payment: ' + updateError.message }, { status: 500 });
    }

    // 6. Send status update notification email via Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const isApproved = status === 'approved';
    const emailSubject = isApproved 
      ? `Payment Confirmed! Your NovaCraft Plan is Active 🎉` 
      : `Payment Update Needed: Transaction Review Required ⚠️`;

    const statusBadgeColor = isApproved ? '#22c55e' : '#ef4444';
    const statusText = status.toUpperCase();

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #0f172a; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 28px; font-weight: bold; color: #0f172a;">Nova<span style="color: #2563eb;">Craft</span></span>
        </div>
        
        <h2 style="color: #1e293b; margin-top: 0; text-align: center; font-size: 20px;">Payment Status Update</h2>
        
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; padding: 8px 16px; font-size: 14px; font-weight: bold; border-radius: 20px; color: #ffffff; background-color: ${statusBadgeColor};">
            ${statusText}
          </span>
        </div>
        
        <p style="font-size: 15px; color: #334155;">Hello <strong>${payment.full_name}</strong>,</p>
        
        <p style="font-size: 15px; color: #334155;">
          ${isApproved 
            ? `We have successfully verified your payment for the <strong>${payment.plan_name} (${payment.plan_category})</strong>. Your account has been activated, and our development team has been notified.`
            : `We were unable to verify your payment for the <strong>${payment.plan_name} (${payment.plan_category})</strong>. Please see the comments below from our billing team to resolve this issue.`
          }
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Transaction Details</h4>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse; color: #475569;">
            <tr>
              <td style="padding: 6px 0; font-weight: 500;">Plan Name:</td>
              <td style="padding: 6px 0; text-align: right; color: #0f172a;">${payment.plan_name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 500;">Amount Paid:</td>
              <td style="padding: 6px 0; text-align: right; color: #0f172a; font-weight: 600;">₹${payment.amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 500;">Transaction/UTR ID:</td>
              <td style="padding: 6px 0; text-align: right; font-family: monospace; color: #0f172a;">${payment.utr_id}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 500;">Submitted On:</td>
              <td style="padding: 6px 0; text-align: right; color: #0f172a;">${new Date(payment.created_at).toLocaleDateString()}</td>
            </tr>
          </table>
        </div>

        ${adminNotes ? `
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 14px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; font-weight: 600; color: #991b1b;">Admin Notes:</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #7f1d1d;">${adminNotes}</p>
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px; margin-bottom: 10px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://novacraft.digital'}/dashboard" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: bold; color: #ffffff; background-color: #2563eb; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
            Go to Client Dashboard
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
      to: payment.email,
      subject: emailSubject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, payment: updatedPayment });

  } catch (error) {
    console.error('Payment admin API error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
