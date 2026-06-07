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

const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbw-5NDrPyD7MhFediGnA1Hy7JMxgq3qS67gSxYm72y_E6tauwtkNgludfiPtGmNX_kC/exec';

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

async function saveLeadToSheets(email: string, message: string) {
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Chatbot Lead',
        email: email || 'no-email',
        message: message || 'no-message',
        date: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error('Sheets save error:', err);
  }
}

function fallbackReply(question: string) {
  const q = question.toLowerCase();

  if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('much')) {
    return 'Our monthly plans start from £49/month. Most businesses choose the £99/month Pro plan, while £149/month includes premium graphics and priority support. All plans include setup, no contracts and can be cancelled anytime.';
  }

  if (q.includes('book') || q.includes('call') || q.includes('consultation') || q.includes('audit')) {
    return 'Book a free consultation and we will discuss your business, social media goals and recommend the best content plan for you.';
  }

  if (q.includes('how long') || q.includes('fast') || q.includes('launch') || q.includes('time')) {
    return 'Most clients are onboarded within 2-5 business days. Once we receive access to your Facebook and Instagram accounts, we can start creating and scheduling content straight away.';
  }

  if (q.includes('chatbot') || q.includes('bot')) {
    return 'Our focus is social media management for local businesses, including content creation, custom graphics, hashtag research and post scheduling.';
  }

  if (q.includes('workflow') || q.includes('automate') || q.includes('automation')) {
    return 'We help local businesses stay active on social media by creating posts, graphics, content calendars, hashtag research and scheduling content for Facebook and Instagram.';
  }

  if (q.includes('agent') || q.includes('ai agent')) {
    return 'AI agents can qualify leads, summarize calls, draft replies, update records, trigger workflows, and help your team complete repeatable business tasks faster.';
  }

  return 'MB Automate helps businesses save time with AI chatbots, workflow automation, and AI agents. Ask me about pricing, launch time, examples, or booking a free automation audit.';
}

const EMAIL_REGEX = /[^\s@]+@[^\s@]+\.[^\s@]+/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

    // Detect email in any user message and save to Sheets
    if (EMAIL_REGEX.test(lastUserMessage)) {
      await saveLeadToSheets(lastUserMessage.match(EMAIL_REGEX)?.[0] || '', lastUserMessage);
    }

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
