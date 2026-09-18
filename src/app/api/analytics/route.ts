import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json({
      success: true,
      loggedAt: new Date().toISOString(),
      event: data.event || 'interaction'
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
