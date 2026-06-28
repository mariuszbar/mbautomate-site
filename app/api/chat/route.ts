import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────
// SYSTEM PROMPT — zgodny z mbautomate.com
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are MB Assistant, a friendly sales assistant for MB Automate — a Glasgow-based agency that creates social media content for local businesses.

## YOUR JOB
1. Answer questions about services, pricing and process
2. When someone is interested → collect their details to book a free consultation
3. Always be concise, warm and helpful

## SERVICES
- Content Creation: posts and captions tailored to the business
- Custom Graphics: branded graphics for Facebook and Instagram
- Social Media Management: content calendar, scheduling and posting

Best for: barbershops, restaurants, gyms, beauty clinics, tradespeople, local shops.

## PRICING
- Starter £49/month: 12 posts, 12 graphics, FB+IG scheduling, content calendar, email support
- Pro £99/month (most popular): 30 posts, 30 graphics, hashtag research, monthly performance report
- Premium £149/month: 30 branded graphics, priority support, fully managed

All plans: no contracts, cancel anytime, setup included.

## HOW IT WORKS
1. Discovery Call — we learn about the business and goals
2. Content Planning — monthly calendar and strategy
3. Design and Creation — captions and branded graphics
4. Schedule and Grow — content scheduled every month

## FAQ
- Photos needed? No, but they help. We can create graphics without them.
- Platforms? Facebook and Instagram.
- Cancel anytime? Yes, no contracts.
- How fast? Onboarded within 2-5 business days.

## BOOKING A CONSULTATION
When a user wants to book a call or shows interest in a plan, collect these details ONE AT A TIME:
1. First name
2. Phone number or email
3. Which plan interests them (Starter / Pro / Premium / Not sure)
4. Preferred day and time (Monday–Friday, 9am–6pm)

Once you have all four, confirm: "Perfect! I've noted your details and will get your free 30-minute consultation booked. Someone from MB Automate will confirm shortly."

Then output this on a new line — do not explain it, just output it:
BOOKING::name=[NAME]::contact=[CONTACT]::plan=[PLAN]::datetime=[DATETIME]

## TONE
- Friendly and professional
- Short responses — no walls of text
- Respond in the same language the user writes in (English or Polish)
- Never invent information not listed above
- If unsure: suggest emailing hello@mbautomate.com
`;

// ─────────────────────────────────────────────
// GOOGLE SHEETS — zapis leadów
// ─────────────────────────────────────────────
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw-5NDrPyD7MhFediGnA1Hy7JMxgq3qS67gSxYm72y_E6tauwtkNgludfiPtGmNX_kC/exec';

async function saveLeadToSheets(name: string, contact: string, plan: string, datetime: string) {
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: contact,
        message: `Plan: ${plan} | Preferred time: ${datetime}`,
        date: new Date().toISOString(),
      }),
    });
    console.log(`✅ Lead saved to Sheets: ${name} — ${plan}`);
  } catch (err) {
    console.error('Sheets save error:', err);
  }
}

// ─────────────────────────────────────────────
// PARSE BOOKING TOKEN
// ─────────────────────────────────────────────
interface BookingData {
  name: string;
  contact: string;
  plan: string;
  datetime: string;
}

function parseBooking(text: string): BookingData | null {
  const match = text.match(/BOOKING::name=([^:]+)::contact=([^:]+)::plan=([^:]+)::datetime=(.+)/);
  if (!match) return null;
  return {
    name: match[1].trim(),
    contact: match[2].trim(),
    plan: match[3].trim(),
    datetime: match[4].trim(),
  };
}

// ─────────────────────────────────────────────
// FALLBACK (gdy brak OpenAI key)
// ─────────────────────────────────────────────
function fallbackReply(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('price') || q.includes('cost') || q.includes('£') || q.includes('much') || q.includes('plan') || q.includes('cen')) {
    return 'We have three plans: Starter £49/mo (12 posts), Pro £99/mo (30 posts — most popular), and Premium £149/mo (fully managed). All include setup, no contracts, cancel anytime.';
  }
  if (q.includes('book') || q.includes('call') || q.includes('consult') || q.includes('umów') || q.includes('rozmow')) {
    return "I'd love to book a free 30-minute call for you! Could you share your name to get started?";
  }
  if (q.includes('photo') || q.includes('zdjęci') || q.includes('zdjecia')) {
    return "Photos help but aren't required — we can create branded graphics without them.";
  }
  if (q.includes('how long') || q.includes('fast') || q.includes('kiedy') || q.includes('czas')) {
    return 'Most clients are onboarded within 2-5 business days after we receive access to your social media accounts.';
  }
  if (q.includes('service') || q.includes('usług') || q.includes('what do')) {
    return 'We create social media content for local businesses — posts, custom graphics, content calendars and scheduling on Facebook and Instagram. All done for you.';
  }
  return "MB Automate creates social media content that helps local businesses attract more customers. Ask me about pricing, services or booking a free consultation!";
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Message = { role: 'user' | 'assistant' | 'system'; content: string };

// ─────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: Message[] = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

    // ── Brak OpenAI key → fallback ──
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ reply: fallbackReply(lastUserMsg) });
    }

    // ── Wywołanie OpenAI ──
    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!openAiRes.ok) {
      console.error('OpenAI error:', await openAiRes.text());
      return NextResponse.json({ reply: fallbackReply(lastUserMsg) });
    }

    const openAiData = await openAiRes.json();
    const rawReply: string = openAiData?.choices?.[0]?.message?.content || fallbackReply(lastUserMsg);

    // ── Sprawdź czy jest token BOOKING:: → zapisz do Sheets ──
    const booking = parseBooking(rawReply);
    if (booking) {
      await saveLeadToSheets(booking.name, booking.contact, booking.plan, booking.datetime);
    }

    // ── Usuń token BOOKING:: z odpowiedzi dla użytkownika ──
    const cleanReply = rawReply.replace(/\nBOOKING::[^\n]*/g, '').trim();

    return NextResponse.json({ reply: cleanReply });

  } catch (err) {
    console.error('Route error:', err);
    return NextResponse.json({
      reply: 'Something went wrong. Please email hello@mbautomate.com or try again.',
    });
  }
}
