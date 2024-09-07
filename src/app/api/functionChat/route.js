import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req) {
  try {
    const { messages, experimental_attachments } = await req.json();

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(config);

    const systemMessage = {
      role: "system",
      content:
        "You are a smart actionable chatbot. You can help users with their queries and provide them with useful information.",
    };

    console.log("experimental_attachments", experimental_attachments);

    const response = await openai.createChatCompletion({
      model: "gpt-4o-2024-05-13",
      temperature: 0.9,
      max_tokens: 4090,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [systemMessage, ...messages],
      // attachments: experimental_attachments, // Attach images if any
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
