import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * GET
 * Verifica se a API Key da Kling está configurada.
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "v7",
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
 * Envia uma tarefa de geração de vídeo para a Kling.
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

    /*
     * Modelo inicial para o teste.
     *
     * A API Kling atual utiliza a API Key
     * diretamente no Authorization Bearer.
     */
    const klingBody = {
      model_name: body.model_name || "kling-v3",
      prompt,

      negative_prompt:
        typeof body.negative_prompt === "string"
          ? body.negative_prompt
          : "",

      mode:
        body.mode === "pro"
          ? "pro"
          : "std",

      duration:
        body.duration === "10"
          ? "10"
          : "5",

      aspect_ratio:
        ["16:9", "9:16", "1:1"].includes(
          body.aspect_ratio
        )
          ? body.aspect_ratio
          : "16:9",
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
            "A Kling recusou a solicitação.",

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
        "Tarefa enviada para a Kling.",

      taskId,

      klingResponse: data,
    });
  } catch (error) {
    console.error(
      "Kling API error:",
      error
    );

    return NextResponse.json(
      {
        status: "error",

        message:
          error instanceof Error
            ? error.message
            : "Erro interno na API Kling.",
      },
      {
        status: 500,
      }
    );
  }
}
