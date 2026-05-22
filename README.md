# MB Automate Premium Landing Page

Premium Next.js landing page for mbautomate.com.

## Includes
- SaaS-style homepage
- Premium dark/light sections
- Framer Motion animations
- AI Chatbots, Workflow Automation, AI Agents
- Process section
- Use cases
- Pricing
- FAQ
- Booking calendar placeholder
- Contact form

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel
1. Upload this folder to GitHub or import it directly into Vercel.
2. Deploy as a Next.js project.
3. Add domain: mbautomate.com

## Real contact form
The form works now as a mailto fallback to hello@mbautomate.com.

To make it submit without opening the email app:
1. Create a free Formspree form.
2. Copy your endpoint URL.
3. In Vercel, add environment variable:
   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-id
4. Redeploy.

## Booking calendar
Replace this line in app/page.tsx:
```ts
const calendlyUrl = 'https://calendly.com/mbautomate/free-consultation';
```
with your real Calendly link.

## AI Chatbot

This version includes a floating chatbot in the bottom-right corner.

It works in two modes:

1. **Without OpenAI API key**  
   The chatbot uses built-in business answers for pricing, services, launch time, AI chatbots, workflow automation, AI agents, and booking.

2. **With OpenAI API key**  
   Add this environment variable in Vercel:

```bash
OPENAI_API_KEY=your_openai_api_key
```

Optional:

```bash
OPENAI_MODEL=gpt-4o-mini
```

The API route is here:

```txt
app/api/chat/route.ts
```

The chatbot UI is inside:

```txt
app/page.tsx
```
