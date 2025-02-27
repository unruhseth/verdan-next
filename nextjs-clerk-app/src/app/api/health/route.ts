import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${backendUrl}/health`);
    
    if (response.ok) {
      return NextResponse.json({ status: 'healthy', backend: 'connected' });
    } else {
      return NextResponse.json(
        { status: 'degraded', backend: 'unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'degraded', backend: 'unavailable', error: 'Backend connection failed' },
      { status: 503 }
    );
  }
} 