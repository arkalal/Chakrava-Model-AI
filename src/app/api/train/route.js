import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path"; // Import path module

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export async function POST(req) {
  const { dataset } = await req.json();

  // Resolve the dataset path
  const datasetPath = path.resolve(process.cwd(), dataset);

  try {
    // Upload the dataset file to OpenAI
    const fileResponse = await openai.files.create({
      file: fs.createReadStream(datasetPath),
      purpose: "fine-tune",
    });

    const fileId = fileResponse.id;

    // Create a fine-tuning job with the uploaded file
    const fineTuneResponse = await openai.fineTuning.jobs.create({
      training_file: fileId,
      model: "gpt-4o-2024-08-06", // Replace with the specific GPT-4o model ID
      suffix: "chakrava-dev",
    });

    console.log("Fine-tuning started:", fineTuneResponse);

    return NextResponse.json({ message: "Model Trained" }, { status: 200 });
  } catch (error) {
    console.error("Error during fine-tuning:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Model Training" }, { status: 200 });
}
