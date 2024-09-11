import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import axios from "../../../../axios/api"; // Axios for tool call responses
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req) {
  try {
    const { messages, experimental_attachments } = await req.json();

    const openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );

    const systemMessage = {
      role: "system",
      content:
        "You are a smart actionable chatbot. You can fetch training data or render components based on user requests.",
    };

    const functions = [
      {
        name: "get_training_data",
        description: "Fetch training data from /train endpoint",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "render_box_component",
        description: "Render a box component",
        parameters: { type: "object", properties: {} },
      },
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-4o-2024-05-13",
      temperature: 0.9,
      max_tokens: 4090,
      stream: true,
      messages: [systemMessage, ...messages],
      function_call: "auto",
      functions,
    });

    const stream = OpenAIStream(response, {
      experimental_onFunctionCall: async ({ name }) => {
        if (name === "get_training_data") {
          const trainingData = await axios.get("/train");
          return `Here is the training data: ${JSON.stringify(
            trainingData.data.message
          )}`;
        }
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
