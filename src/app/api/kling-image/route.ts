import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * GET
 * Verifica se a chave da Kling está configurada.
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-v1",
    runtime: "nodejs",

    klingConfigured: Boolean(apiKey),
    apiKeyExists: Boolean(apiKey),
    apiKeyLength: apiKey?.length ?? 0,

    apiUrl: KLING_API_URL,

    generationTest: false,
  });
}

/**
 * POST
 * Envia uma tarefa de geração de imagem
 * Texto → Imagem para a Kling.
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.KLING_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "KLING_API_KEY não configurada na Vercel.",
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

    const aspectRatio =
      ["1:1", "16:9", "9:16"].includes(
        body.aspect_ratio
      )
        ? body.aspect_ratio
        : "1:1";

    const klingBody = {
      model_name:
        body.model_name || "kling-image",

      prompt,

      negative_prompt:
        typeof body.negative_prompt === "string"
          ? body.negative_prompt
          : "",

      aspect_ratio: aspectRatio,
    };

    const response = await fetch(
      `${KLING_API_URL}/v1/images/generations`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(klingBody),

        cache: "no-store",
      }
    );

    const text = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        rawResponse: text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",

          message:
            "A Kling recusou a solicitação de imagem.",

          klingStatus: response.status,

          klingResponse: data,
        },
        {
          status: response.status,
        }
      );
    }

    const responseData =
      data as {
        data?: {
          task_id?: string;
        };

        task_id?: string;
      };

    const taskId =
      responseData?.data?.task_id ||
      responseData?.task_id ||
      null;

    return NextResponse.json({
      status: "success",

      message:
        "Tarefa de imagem enviada para a Kling.",

      taskId,

      klingResponse: data,
    });
  } catch (error) {
    console.error(
      "Kling Image API error:",
      error
    );

    return NextResponse.json(
      {
        status: "error",

        message:
          error instanceof Error
            ? error.message
            : "Erro interno na API de imagens Kling.",
      },
      {
        status: 500,
      }
    );
  }
}
