import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `
You are MB Automate AI assistant.

Business:
- AI chatbots
- workflow automation
- AI agents
- lead generation
- automations for businesses

Reply shortly, professionally, and help convert visitors into leads.

User message:
${message}
          `,
        },
      ],
    });

    const reply =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Sorry, I couldn't generate a reply.";

    return Response.json({ reply });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply: "AI temporarily unavailable.",
    });
  }
}