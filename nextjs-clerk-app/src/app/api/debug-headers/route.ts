import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get all headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Add environment information
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
    NEXT_PUBLIC_CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
  };

  return NextResponse.json({
    headers,
    env,
    url: request.url,
    host: request.headers.get('host'),
    timestamp: new Date().toISOString(),
  });
}