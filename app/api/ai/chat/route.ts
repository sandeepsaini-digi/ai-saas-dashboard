import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { checkRateLimit } from '@/lib/rate-limit';
import { Organization } from '@/models/Organization';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting based on subscription tier
    const { allowed, remaining } = await checkRateLimit(session.user.id, session.user.plan);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Monthly AI query limit reached. Upgrade your plan for more queries.' },
        { status: 429 }
      );
    }

    const { messages, orgId } = await req.json();

    // Fetch org context for RAG
    await connectDB();
    const org = await Organization.findById(orgId)
      .select('metrics members subscription')
      .lean();

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const systemPrompt = `You are an intelligent analytics assistant for a SaaS dashboard.
You have access to the following organization data:

Organization Metrics:
${JSON.stringify(org.metrics, null, 2)}

Active Members: ${org.members?.length ?? 0}
Subscription Tier: ${org.subscription?.tier ?? 'free'}

Guidelines:
- Answer questions about the data concisely and accurately
- Format numbers with proper units (e.g., $1,234.56, 89.5%)
- When identifying trends, mention the time period
- Suggest actionable recommendations based on the data
- If asked for something outside the data context, politely explain what data you have access to`;

    const result = await streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages,
      temperature: 0.3,
      maxTokens: 1024,
    });

    // Log usage for billing
    await logAIUsage(session.user.id, orgId);

    return result.toDataStreamResponse({
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
      },
    });
  } catch (error) {
    console.error('[AI Chat Error]', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

async function logAIUsage(userId: string, orgId: string) {
  // Track usage for rate limiting and billing
  const key = `ai:usage:${userId}:${new Date().toISOString().slice(0, 7)}`;
  // Increment in Redis/MongoDB
}
