import { NextRequest } from 'next/server';
import type { ChatRequest } from '@/types/agent';

export async function POST(req: NextRequest) {
  const { message, user_id, intent } = await req.json() as ChatRequest;

  try {
    const response = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, user_id, intent }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in chat route:', error);
    return Response.json({ error: `Error processing request: ${error}` }, { status: 500 });
  }
}
