import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL = "https://api-singapore.klingai.com";

/**
 * GET
 * Verifica se a API Key da Kling está configurada.
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "v5",
    runtime: "nodejs",

    klingConfigured: Boolean(apiKey),
    apiKeyLength: apiKey?.length ?? 0,

    generationTest: false,
  });
}

/**
 * POST
 * Envia uma geração de vídeo para a Kling.
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.KLING_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "KLING_API_KEY não está configurada na Vercel.",
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

    const klingBody = {
      model_name: body.model_name || "kling-v2-1",
      prompt,
      negative_prompt: body.negative_prompt || "",
      mode: body.mode || "std",
      duration: body.duration || "5",
      aspect_ratio: body.aspect_ratio || "16:9",
    };

    const response = await fetch(
      `${KLING_API_URL}/v1/videos/text2video`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(klingBody),
      }
    );

    const responseText = await response.text();

    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        rawResponse: responseText,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: "A Kling recusou a solicitação.",
          klingStatus: response.status,
          klingResponse: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Tarefa enviada para a Kling.",
      taskId:
        data?.data?.task_id ||
        data?.task_id ||
        null,
      klingResponse: data,
    });
  } catch (error) {
    console.error("Kling API error:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro interno na API Kling.",
      },
      { status: 500 }
    );
  }
}
