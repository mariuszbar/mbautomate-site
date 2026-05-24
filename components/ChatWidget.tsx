'use client';

import { Send, X, Bot } from 'lucide-react';
import { useState } from 'react';

const WEB3FORMS_KEY = "4ee1690c-608a-47a7-9349-a602fdc867ad";

const quickReplies = [
  'What can you automate?',
  'How much does it cost?',
  'How fast can we launch?',
  'Book a consultation',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(true);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi, I am the MB Automate assistant. Ask me about AI chatbots, workflow automation, AI agents, pricing, or booking a consultation.',
    },
  ]);

  const [input, setInput] = useState('');

  const sendLeadToEmail = async (
    email: string,
    message: string
  ) => {
    try {
      // EMAIL VIA WEB3FORMS
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'New chatbot lead from MB Automate',
          from_name: 'MB Automate Chatbot',
          email,
          message,
        }),
      });

      // SAVE TO GOOGLE SHEETS
      fetch(
        "https://script.google.com/macros/s/AKfycbzyWnuyHm23qbi5ulnvlaDxh6Sv1Xi5ocPPSQy36PpybLNoBhIImPwcQ05W4wRyp-aVQQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Chatbot Lead",
            email: email || "no-email",
            message: message || "no-message",
            date: new Date().toISOString(),
          }),
        }
      );

      console.log("Lead saved successfully");
    } catch (error) {
      console.error('Lead error:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: text,
      },
    ]);

    setInput('');

    // EMAIL DETECTION
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(text)) {
      await sendLeadToEmail(
        text,
        'Lead captured from chatbot'
      );
    }

    try {
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await aiResponse.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'AI temporarily unavailable.',
        },
      ]);
    }
  };

  const handleQuickReply = async (
    reply: string
  ) => {
    await sendMessage(reply);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] overflow-hidden rounded-3xl border border-purple-500/20 bg-[#050816] shadow-2xl shadow-purple-500/20">
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-violet-500 px-5 py-4">
            <div>
              <h3 className="font-semibold text-white">
                MB Automate AI
              </h3>

              <p className="text-xs text-purple-100">
                Answers questions 24/7
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-white/80 transition hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex h-[420px] flex-col overflow-y-auto bg-[#050816] p-4">
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'assistant'
                      ? 'bg-white/10 text-white'
                      : 'ml-auto bg-purple-600 text-white'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() =>
                    handleQuickReply(reply)
                  }
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-200 hover:bg-white/10"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter')
                    sendMessage(input);
                }}
                placeholder="Ask a question or leave your email..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  sendMessage(input)
                }
                className="rounded-xl bg-purple-600 p-3 text-white hover:bg-purple-700"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-4 font-semibold text-white shadow-2xl shadow-purple-500/30"
      >
        <Bot size={20} />
        Chat with AI
      </button>
    </>
  );
}
