import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      messages,
      model,
      outputLength,
      temperature,
      topP,
      topK,
      repetitionPenalty,
      key,
      endpoint,
    } = await req.json();

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(config);

    const systemMessage = {
      role: "system",
      content:
        "You are the chatbot for the chakrava-dev package. AND you will help the users for the code as per the chakrava-dev package for React and NextJS. You will answer the questions related to the chakrava-dev package and also write the code for them and make sure your response is not long. It should be brief and to the point.",
    };

    const response = await openai.createChatCompletion({
      model: "ft:gpt-4o-2024-08-06:personal:chakrava-dev-v3:A3RXH2Hk",
      max_tokens: 1500,
      temperature: temperature || 0.8,
      messages: [systemMessage, ...messages],
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse.json(
      { error: error.message },
      {
        status: 400,
      }
    );
  }
}
