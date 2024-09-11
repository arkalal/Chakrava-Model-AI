import { NextResponse } from "next/server";
import OpenAI from "openai";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req) {
  try {
    // Parse the request to get prompt and conversation history
    const { prompt, conversationHistory } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    const systemMessage = {
      role: "system",
      content:
        "You are the chatbot for the chakrava-dev package. AND you will help the users for the code as per the chakrava-dev package for React and NextJS. You will answer the questions related to the chakrava-dev package and also write the code for them. It should be to the point. Always write the code under ```code``` and bash under ```bash``` so that I can highlight it properly.",
    };

    // Prepare the message history for OpenAI
    const messages = [
      systemMessage, // Add system message
      ...conversationHistory.map((item) => ({
        role: item.role,
        content: item.content,
      })),
    ];

    // Add the user's latest message
    messages.push({ role: "user", content: prompt });

    // Make the API call to OpenAI
    const response = await openAi.chat.completions.create({
      model: "ft:gpt-4o-2024-08-06:personal:chakrava-dev-v3:A3RXH2Hk", // GPT-4o model
      temperature: 0.9, // Set the temperature for randomness
      max_tokens: 4090, // Max token limit
      messages: messages,
    });

    // Send the AI's response back to the client
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
