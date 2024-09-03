import { NextResponse } from "next/server";

export async function POST(req) {
  const body = req.json();

  return NextResponse.json({ message: "Model Trained" }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: "Model Training" }, { status: 200 });
}
