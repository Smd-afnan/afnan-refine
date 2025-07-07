import { NextResponse } from 'next/server';

export async function GET() {
  // This route is disabled. It exists only to prevent build errors.
  return NextResponse.json({ status: 'ok', message: 'Cron job endpoint is disabled.' });
}
