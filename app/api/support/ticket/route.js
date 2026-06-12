import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json({ error: 'Missing ticketId parameter' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Query messages table
    const { data: message, error: selectError } = await supabaseAdmin
      .from('messages')
      .select('id, name, email, service, message, status, admin_reply, reply_date, created_at')
      .eq('id', ticketId)
      .single();

    if (selectError || !message) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: message }, { status: 200 });
  } catch (error) {
    console.error('Support ticket fetch API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
