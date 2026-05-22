import { NextResponse } from 'next/server';

const BUSINESS_CONTEXT = `
You are the website chatbot for MB Automate.
Brand: MB Automate.
Positioning: AI Automation for Modern Businesses.
Services: AI Chatbots, Workflow Automation, AI Agents.
Main benefits: save hours weekly, respond faster, reduce admin, capture and qualify leads, update CRM, automate emails, booking, support, reporting, and internal workflows.
Typical clients: local service businesses, agencies, ecommerce, real estate, clinics, barbers, consultants, and small teams.
Pricing: Starter £499+ for one chatbot or automation MVP. Growth £1,500+ for 3-5 workflows and integrations. Scale is custom for AI agents and ongoing optimisation.
Launch timeline: focused MVP usually 3-7 days after process and access are clear.
Tools: websites, forms, Gmail, Google Sheets, Calendly, CRMs, Stripe, Slack, Notion, Airtable, Make, n8n, Zapier, OpenAI.
CTA: Encourage users to book a free automation audit or email hello@mbautomate.com.
Tone: concise, confident, helpful, SaaS-style, no hype.
`;

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

function fallbackReply(question: string) {
  const q = question.toLowerCase();

  if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('much')) {
    return 'Pricing starts at £499+ for a focused chatbot or automation MVP. Growth systems usually start at £1,500+ and include multiple workflows, integrations, testing, and support. For a custom AI agent setup, book a free automation audit.';
  }

  if (q.includes('book') || q.includes('call') || q.includes('consultation') || q.includes('audit')) {
    return 'You can book a free automation audit from the booking section on this page. We will review your process, find automation opportunities, and suggest the fastest MVP.';
  }

  if (q.includes('how long') || q.includes('fast') || q.includes('launch') || q.includes('time')) {
    return 'A focused MVP can usually launch in 3-7 days once the process, tools, and access are clear. Larger systems depend on integrations and complexity.';
  }

  if (q.includes('chatbot') || q.includes('bot')) {
    return 'We build AI chatbots that answer FAQs, capture leads, qualify customers, handle support questions, and route enquiries to email, CRM, or booking tools.';
  }

  if (q.includes('workflow') || q.includes('automate') || q.includes('automation')) {
    return 'We automate repetitive business processes such as lead follow-up, CRM updates, email replies, booking flows, invoice/admin tasks, reporting, and internal notifications.';
  }

  if (q.includes('agent') || q.includes('ai agent')) {
    return 'AI agents can qualify leads, summarize calls, draft replies, update records, trigger workflows, and help your team complete repeatable business tasks faster.';
  }

  return 'MB Automate helps businesses save time with AI chatbots, workflow automation, and AI agents. Ask me about pricing, launch time, examples, or booking a free automation audit.';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ reply: fallbackReply(lastUserMessage) });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 280,
        messages: [
          { role: 'system', content: BUSINESS_CONTEXT },
          ...messages.map((m) => ({ role: m.role, content: m.content }))
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({ reply: fallbackReply(lastUserMessage) });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || fallbackReply(lastUserMessage);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Please email hello@mbautomate.com or book a free automation audit and we will help.' });
  }
}
