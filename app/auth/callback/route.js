import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // If there's an OAuth error from Google/Supabase, redirect to login with message
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // If we have a code, redirect to dashboard - Supabase client handles token exchange 
  // automatically via the URL hash/fragment on the client side
  if (code) {
    // Pass the code to the client via redirect - the Supabase client will handle exchange
    const redirectUrl = new URL(`${origin}${next}`);
    redirectUrl.searchParams.set('code', code);
    return NextResponse.redirect(redirectUrl.toString());
  }

  // Fallback: just go to dashboard and let client-side session handle it
  return NextResponse.redirect(`${origin}${next}`);
}
