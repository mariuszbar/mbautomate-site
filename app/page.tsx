'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  Clock3,
  Database,
  Mail,
  MessageCircle,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  X,
  Send
} from 'lucide-react';
import { FormEvent, useState } from 'react';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const services = [
  { icon: MessageCircle, title: 'AI Chatbots', text: 'Automate customer conversations, lead capture, support, FAQs, and appointment requests 24/7.' },
  { icon: Workflow, title: 'Workflow Automation', text: 'Connect CRMs, forms, emails, calendars, sheets, invoices, and internal tools into one smooth flow.' },
  { icon: Bot, title: 'AI Agents', text: 'Deploy AI systems that qualify leads, summarize calls, draft replies, update records, and trigger actions.' }
];

const useCases = ['Real estate lead routing', 'Barber & clinic booking flows', 'Ecommerce support automation', 'Agency client onboarding', 'Invoice & admin automation', 'Local business missed-call recovery'];

const plans = [
  { name: 'Starter', price: '£499+', desc: 'One automation or chatbot MVP.', items: ['Discovery call', '1 core workflow', 'Basic AI prompt setup', 'Handover video'], highlight: false },
  { name: 'Growth', price: '£1,500+', desc: 'Complete automation system for a business process.', items: ['Automation strategy', '3-5 workflows', 'CRM/email/calendar integrations', 'Testing & optimisation', '30-day support'], highlight: true },
  { name: 'Scale', price: 'Custom', desc: 'AI agents and ongoing automation partner.', items: ['AI agent architecture', 'Advanced integrations', 'Dashboards & reporting', 'Monthly optimisation', 'Priority support'], highlight: false }
];

const faqs = [
  { q: 'Who is MB Automate for?', a: 'Service businesses, agencies, local companies, ecommerce brands, and operators who want to reduce manual work and respond to leads faster.' },
  { q: 'Do I need to know AI or coding?', a: 'No. We map the process, build the automation, connect your tools, test it, and show you how to use it.' },
  { q: 'What tools can you connect?', a: 'Common setups include websites, forms, Gmail, Google Sheets, Calendly, CRMs, Stripe, Slack, Notion, Airtable, Make, n8n, Zapier, and OpenAI.' },
  { q: 'How fast can we launch?', a: 'A focused MVP can usually be built in 3-7 days once the process and access are clear.' }
];

export default function Home() {
  const [status, setStatus] = useState('');
  const calendlyUrl = 'https://calendly.com/hello-mbautomate/free-consultation';

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('access_key', '4ee1690c-608a-47a7-9349-a602fdc867ad');

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    });
    if (res.ok) {
      setStatus('Thanks. Your message has been sent.');
      form.reset();
    } else {
      setStatus('Something went wrong. Please email hello@mbautomate.com.');
    }
  }

  return (
    <main className="overflow-hidden bg-slate-950 text-white">
      <section className="noise relative min-h-screen border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,.35),transparent_34%),radial-gradient(circle_at_20%_30%,rgba(14,165,233,.16),transparent_28%),#020617]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-600 shadow-glow"><Sparkles className="h-6 w-6" /></div>
            <span className="text-xl font-black">MB Automate</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#process" className="hover:text-white">Process</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
          <a href="#booking" className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-105">Book Free Consultation</a>
        </nav>

        <div id="top" className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 md:grid-cols-[1.05fr_.95fr] md:pt-28">
          <motion.div {...fadeUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-violet-100">
              <Zap className="h-4 w-4 text-violet-300" /> AI automation for businesses that want speed
            </div>
            <h1 className="max-w-4xl text-6xl font-black leading-[.95] tracking-tight md:text-8xl">
              <span className="gradient-text">MB Automate</span>
            </h1>
            <p className="mt-6 max-w-2xl text-3xl font-bold leading-tight text-white md:text-5xl">AI Automation for Modern Businesses</p>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">We build AI chatbots, workflows, and agents that capture leads, reduce admin, and help your team move faster.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#booking" className="group inline-flex items-center justify-center rounded-2xl bg-violet-600 px-7 py-4 text-lg font-bold shadow-glow transition hover:scale-[1.02] hover:bg-violet-500">
                <Calendar className="mr-2 h-5 w-5" /> Book Free Consultation <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
              </a>
              <a href="#services" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-7 py-4 text-lg font-bold text-white transition hover:bg-white/15">Explore services</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              {['Save hours weekly', 'Respond faster', 'Scale operations'].map((x) => <span key={x} className="rounded-full border border-white/10 bg-white/5 px-4 py-2"><Check className="mr-2 inline h-4 w-4 text-violet-300" />{x}</span>)}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .94, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .8, ease: 'easeOut' }} className="glass rounded-[2rem] p-4 shadow-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="mb-5 flex gap-2"><i className="h-3 w-3 rounded-full bg-slate-600"/><i className="h-3 w-3 rounded-full bg-slate-600"/><i className="h-3 w-3 rounded-full bg-slate-600"/></div>
              <div className="grid gap-4 md:grid-cols-[.55fr_1fr]">
                <div className="space-y-3">
                  {['Lead captured', 'AI qualified', 'CRM updated', 'Follow-up sent'].map((x,i)=><motion.div key={x} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:.25+i*.12}} className="rounded-2xl bg-white/10 p-4 text-sm text-slate-200"><Check className="mr-2 inline h-4 w-4 text-green-300" />{x}</motion.div>)}
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-violet-600/30 to-cyan-500/10 p-6">
                  <Bot className="mb-4 h-12 w-12 text-violet-200" />
                  <p className="text-2xl font-black">AI Operations Hub</p>
                  <p className="mt-2 text-slate-300">Chat, email, CRM, booking, reporting, and AI actions connected.</p>
                  <div className="mt-6 h-28 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="h-2 w-2/3 rounded bg-violet-400" />
                    <div className="mt-4 h-2 w-5/6 rounded bg-white/20" />
                    <div className="mt-4 h-2 w-1/2 rounded bg-white/20" />
                    <div className="mt-5 flex gap-2"><span className="h-8 flex-1 rounded-xl bg-violet-500/50"/><span className="h-8 flex-1 rounded-xl bg-cyan-500/30"/></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="bg-white px-6 py-24 text-slate-950">
        <motion.div {...fadeUp} className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-black uppercase tracking-[.28em] text-violet-600">What we do</p>
          <h2 className="mt-4 text-4xl font-black md:text-6xl">Full SaaS-style AI automation services</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Built for businesses that need practical automation, not AI hype.</p>
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {services.map((s) => <Service key={s.title} {...s} />)}
          </div>
        </motion.div>
      </section>

      <section id="process" className="bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[.28em] text-violet-300">How it works</p>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">From messy process to automated system.</h2>
          </motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[['Audit', 'We find the repetitive work costing you time.'], ['Build', 'We create the chatbot, workflow, or agent.'], ['Connect', 'We integrate your tools and data.'], ['Launch', 'We test, improve, and hand it over.']].map(([t,d],i)=><motion.div {...fadeUp} transition={{duration:.55,delay:i*.08}} key={t} className="glass rounded-3xl p-6"><div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-violet-600 font-black">{i+1}</div><h3 className="text-2xl font-black">{t}</h3><p className="mt-3 leading-7 text-slate-300">{d}</p></motion.div>)}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="grid gap-10 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[.28em] text-violet-600">Use cases</p>
              <h2 className="mt-4 text-4xl font-black md:text-5xl">Automation for real business problems.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {useCases.map((x)=><div key={x} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold"><MousePointerClick className="mr-2 inline h-5 w-5 text-violet-600" />{x}</div>)}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="pricing" className="bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-black uppercase tracking-[.28em] text-violet-300">Pricing</p>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">Simple packages. Custom systems.</h2>
          </motion.div>
          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {plans.map((p)=><motion.div {...fadeUp} key={p.name} className={`rounded-[2rem] p-7 text-left ${p.highlight?'bg-violet-600 shadow-glow':'glass'}`}><p className="text-xl font-black">{p.name}</p><p className="mt-4 text-4xl font-black">{p.price}</p><p className="mt-3 min-h-14 text-slate-200">{p.desc}</p><div className="my-7 h-px bg-white/15"/><ul className="space-y-3">{p.items.map(i=><li key={i} className="flex gap-3 text-slate-100"><Check className="mt-1 h-5 w-5 shrink-0" />{i}</li>)}</ul><a href="#booking" className="mt-8 inline-flex w-full justify-center rounded-2xl bg-white px-5 py-4 font-black text-slate-950">Book call</a></motion.div>)}
          </div>
        </div>
      </section>

      <section id="booking" className="bg-white px-6 py-24 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <motion.div {...fadeUp} className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-10">
            <p className="text-sm font-black uppercase tracking-[.28em] text-violet-300">Booking calendar</p>
            <h2 className="mt-4 text-4xl font-black">Book a free automation audit</h2>
            <p className="mt-4 leading-8 text-slate-300">Use this section for Calendly. Replace the link in the code with your real Calendly URL.</p>
            <div className="mt-8 grid min-h-80 place-items-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <div>
                <Calendar className="mx-auto h-14 w-14 text-violet-300" />
                <p className="mt-4 text-2xl font-black">Calendly embed placeholder</p>
                <p className="mt-2 text-slate-300">Current link: {calendlyUrl}</p>
                <a href={calendlyUrl} className="mt-6 inline-flex rounded-2xl bg-violet-600 px-6 py-4 font-black text-white">Open calendar</a>
              </div>
            </div>
          </motion.div>

          <motion.form {...fadeUp} onSubmit={submitForm} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-2xl shadow-slate-200 md:p-10">
            <p className="text-sm font-black uppercase tracking-[.28em] text-violet-600">Real contact form</p>
            <h2 className="mt-4 text-4xl font-black">Tell us what you want to automate</h2>
            <div className="mt-8 grid gap-4">
              <input name="name" required placeholder="Your name" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500" />
              <input name="email" required type="email" placeholder="Your email" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500" />
              <input name="company" placeholder="Company / website" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500" />
              <textarea name="message" required rows={5} placeholder="What process should AI automate for you?" className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-violet-500" />
              <button className="rounded-2xl bg-violet-600 px-6 py-4 font-black text-white transition hover:bg-violet-500">Send message</button>
              {status && <p className="text-sm font-semibold text-slate-700">{status}</p>}

            </div>
          </motion.form>
        </div>
      </section>

      <section id="faq" className="bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center">
            <p className="text-sm font-black uppercase tracking-[.28em] text-violet-300">FAQ</p>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">Questions before we automate?</h2>
          </motion.div>
          <div className="mt-12 space-y-4">
            {faqs.map((f)=><details key={f.q} className="group rounded-3xl border border-white/10 bg-white/5 p-6"><summary className="flex cursor-pointer list-none items-center justify-between text-xl font-black">{f.q}<ChevronDown className="h-6 w-6 transition group-open:rotate-180" /></summary><p className="mt-4 leading-8 text-slate-300">{f.a}</p></details>)}
          </div>
        </div>
      </section>

      <AIAssistant />

      <footer className="border-t border-white/10 bg-slate-950 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-slate-400 md:flex-row">
          <p className="font-bold text-white">MB Automate</p>
          <p>AI Automation for Modern Businesses</p>
          <a href="mailto:hello@mbautomate.com" className="hover:text-white">hello@mbautomate.com</a>
        </div>
      </footer>
    </main>
  );
}

function Service({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return <motion.div {...fadeUp} className="group rounded-[2rem] border border-slate-200 bg-white p-8 text-left shadow-xl shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl"><div className="mb-8 grid h-16 w-16 place-items-center rounded-3xl bg-violet-100 text-violet-600 transition group-hover:scale-110"><Icon className="h-8 w-8" /></div><h3 className="text-2xl font-black">{title}</h3><p className="mt-4 leading-8 text-slate-600">{text}</p></motion.div>;
}


function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I am the MB Automate assistant. Ask me about AI chatbots, workflow automation, AI agents, pricing, or booking a consultation.'
    }
  ]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await res.json();
      setMessages([...nextMessages, { role: 'assistant', content: data.reply || 'Please email hello@mbautomate.com and we will help.' }]);
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: 'Something went wrong. Please email hello@mbautomate.com or book a free consultation.' }]);
    } finally {
      setLoading(false);
    }
  }

  const quickQuestions = [
    'What can you automate?',
    'How much does it cost?',
    'How fast can we launch?',
    'Book a consultation'
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-4 w-[calc(100vw-2.5rem)] max-w-md overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950 shadow-2xl shadow-violet-950/70"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-700 to-violet-500 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15"><Bot className="h-5 w-5" /></div>
              <div>
                <p className="font-black">MB Automate AI</p>
                <p className="text-xs text-violet-100">Answers questions 24/7</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-white/10" aria-label="Close chatbot"><X className="h-5 w-5" /></button>
          </div>

          <div className="h-96 space-y-3 overflow-y-auto bg-slate-950 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-white/10 text-slate-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-300">Typing...</div>}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button key={q} onClick={() => setInput(q)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-violet-400"
              />
              <button className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-600 hover:bg-violet-500" aria-label="Send message">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}

      <button onClick={() => setOpen(!open)} className="flex items-center gap-3 rounded-full bg-violet-600 px-5 py-4 font-black text-white shadow-glow transition hover:scale-105 hover:bg-violet-500">
        <Bot className="h-6 w-6" /> Chat with AI
      </button>
    </div>
  );
}
