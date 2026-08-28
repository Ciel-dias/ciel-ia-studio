import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  return NextResponse.json({
    status: "ok",
    routeVersion: "v1",
    runtime: "nodejs",
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message: "OPENAI_API_KEY não configurada na Vercel.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "O campo 'prompt' é obrigatório.",
        },
        { status: 400 }
      );
    }

    const aspectRatio = body?.aspectRatio || "1:1";

    let size = "1024x1024";

    if (aspectRatio === "16:9") {
      size = "1536x1024";
    }

    if (aspectRatio === "9:16") {
      size = "1024x1536";
    }

    const style = body?.style || "Realista";

    const finalPrompt = `
Crie uma imagem ${style}, de alta qualidade e extremamente detalhada.

Descrição:
${prompt}
`.trim();

    const result = await openai.images.generate({
      model: "gpt-image-2",
      prompt: finalPrompt,
      size,
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        {
          status: "error",
          message: "A OpenAI não retornou uma imagem.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Imagem gerada com sucesso.",
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("OpenAI Image API error:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro interno na API de imagens da OpenAI.",
      },
      { status: 500 }
    );
  }
}
