import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "O prompt é obrigatório.",
        },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const result = response.output_text?.trim();

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "A OpenAI não retornou um resultado.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Erro na API da OpenAI:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Não foi possível processar a solicitação com a OpenAI.",
      },
      { status: 500 }
    );
  }
}
