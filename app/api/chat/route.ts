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
// GOOGLE CALENDAR — Service Account
// ─────────────────────────────────────────────
async function getGoogleAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_CLIENT_EMAIL!;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');
  const calendarScope = 'https://www.googleapis.com/auth/calendar';

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
    scope: calendarScope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  function b64(obj: object) {
    return Buffer.from(JSON.stringify(obj)).toString('base64url');
  }

  const unsigned = `${b64(header)}.${b64(payload)}`;

  // Import private key
  const keyData = rawKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryKey = Buffer.from(keyData, 'base64');
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    Buffer.from(unsigned)
  );

  const jwt = `${unsigned}.${Buffer.from(signature).toString('base64url')}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
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
// CREATE GOOGLE CALENDAR EVENT
// ─────────────────────────────────────────────
async function createCalendarEvent(booking: BookingData): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'hello@mbautomate.com';

  // Try to parse datetime, fallback to next Monday 10am if unparseable
  let startDate: Date;
  try {
    startDate = new Date(booking.datetime);
    if (isNaN(startDate.getTime())) throw new Error('invalid');
  } catch {
    // Fallback: next Monday 10:00
    startDate = new Date();
    startDate.setDate(startDate.getDate() + ((8 - startDate.getDay()) % 7 || 7));
    startDate.setHours(10, 0, 0, 0);
  }

  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // +30 min

  const event = {
    summary: `MB Automate — Konsultacja: ${booking.name}`,
    description: [
      `Klient: ${booking.name}`,
      `Kontakt: ${booking.contact}`,
      `Plan: ${booking.plan}`,
      `Umówione przez: chatbot mbautomate.com`,
    ].join('\n'),
    start: { dateTime: startDate.toISOString(), timeZone: 'Europe/London' },
    end: { dateTime: endDate.toISOString(), timeZone: 'Europe/London' },
    colorId: '9', // niebieski — łatwo odróżnić w kalendarzu
  };

  const token = await getGoogleAccessToken();

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('Calendar error:', err);
    throw new Error('Calendar API failed');
  }

  console.log(`✅ Calendar event created for ${booking.name} — ${booking.plan}`);
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

    // ── Sprawdź czy jest token BOOKING:: → zapisz do kalendarza ──
    const booking = parseBooking(rawReply);
    if (booking) {
      try {
        await createCalendarEvent(booking);
      } catch (err) {
        console.error('Failed to create calendar event:', err);
        // Nie przerywamy — odpowiedź i tak wróci do użytkownika
      }
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
