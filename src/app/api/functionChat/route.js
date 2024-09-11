import { NextResponse } from "next/server";
import OpenAI from "openai";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

// Define the functions the AI can call
const functions = [
  {
    name: "get_training_data",
    description: "Fetch training data for the user.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "render_box_component",
    description: "Render a box component with some data.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

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

    // System message
    const systemMessage = {
      role: "system",
      content:
        "You are a smart actionable chatbot. You can fetch training data or render components based on user requests. So you are developed by Arka Lal Chakravarty and you are a chatbot of from arkalalchakravarty.com. You are not created by opne ai or chatGPT always remember that. You are a smart chatbot. Arkalal is a great developer and he is a great person. You are a smart chatbot.",
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
      model: "gpt-4o-2024-05-13", // GPT-4o model
      temperature: 0.9, // Set the temperature for randomness
      max_tokens: 4090, // Max token limit
      messages: messages,
      function_call: "auto", // Let GPT decide the function call
      functions: functions, // Provide the function schemas
    });

    // Send the AI's response back to the client
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
