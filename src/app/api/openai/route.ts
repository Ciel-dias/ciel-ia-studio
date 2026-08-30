import OpenAI from "openai";
import { NextResponse } from "next/server";

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

export async function POST(request: Request) {
  try {
    if (!openai) {
      return NextResponse.json(
        {
          success: false,
          error:
            "OPENAI_API_KEY não está configurada nas variáveis de ambiente da Vercel.",
        },
        { status: 500 }
      );
    }

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
      model: "gpt-5.6-luna",
      input: prompt,
    });

    return NextResponse.json({
      success: true,
      response: response.output_text,
    });
  } catch (error: unknown) {
    console.error("Erro na API da OpenAI:", error);

    let errorMessage =
      "Não foi possível processar a solicitação com a OpenAI.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
