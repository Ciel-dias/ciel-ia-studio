import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * GET
 * Verifica se a rota Imagem → Imagem está configurada.
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-to-image-v1",
    runtime: "nodejs",

    klingConfigured: Boolean(apiKey),
    apiKeyExists: Boolean(apiKey),
    apiKeyLength: apiKey?.length ?? 0,

    apiUrl: KLING_API_URL,

    endpoint: `${KLING_API_URL}/v1/images/generations`,

    generationTest: false,
  });
}

/**
 * POST
 *
 * Card 4 — Imagem → Imagem
 *
 * Recebe:
 * - image
 * - image2 opcional
 * - prompt
 * - aspect_ratio
 * - style
 *
 * A imagem é recebida como Data URL ou Base64.
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.KLING_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Serviço de geração de imagens temporariamente indisponível.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const prompt = body?.prompt;

    const image = body?.image;

    const image2 = body?.image2;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "O campo prompt é obrigatório.",
        },
        { status: 400 }
      );
    }

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Envie pelo menos uma imagem de referência.",
        },
        { status: 400 }
      );
    }

    const aspectRatio =
      ["1:1", "16:9", "9:16"].includes(
        body?.aspect_ratio
      )
        ? body.aspect_ratio
        : "1:1";

    const style =
      typeof body?.style === "string"
        ? body.style
        : "Realista";

    /*
     * Mantemos o prompt original e acrescentamos
     * o estilo escolhido pelo usuário.
     */
    const finalPrompt = `${prompt}

Estilo visual: ${style}.`;

    /*
     * Corpo enviado para a Kling.
     *
     * A imagem principal é enviada como referência.
     */
    const klingBody: Record<string, unknown> = {
      model_name:
        body?.model_name || "kling-image",

      prompt: finalPrompt,

      negative_prompt:
        typeof body?.negative_prompt === "string"
          ? body.negative_prompt
          : "",

      aspect_ratio: aspectRatio,

      image,
    };

    /*
     * Se houver segunda imagem, enviamos também.
     */
    if (
      image2 &&
      typeof image2 === "string"
    ) {
      klingBody.image2 = image2;
    }

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

    /*
     * Erro retornado pela Kling.
     *
     * Não expomos detalhes internos da Kling
     * para o usuário final.
     */
    if (!response.ok) {
      const klingData =
        data as {
          code?: number | string;
          message?: string;
          request_id?: string;
        };

      return NextResponse.json(
        {
          status: "error",

          message:
            "Não foi possível enviar a solicitação de imagem.",

          klingStatus: response.status,

          klingCode:
            klingData?.code ?? null,

          klingMessage:
            klingData?.message ?? null,

          requestId:
            klingData?.request_id ?? null,
        },
        {
          status: response.status,
        }
      );
    }

    /*
     * Tentamos localizar o task_id nos formatos
     * mais comuns da resposta.
     */
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
        "Solicitação de imagem enviada com sucesso.",

      taskId,

      data,
    });
  } catch (error) {
    console.error(
      "Kling Image-to-Image API error:",
      error
    );

    return NextResponse.json(
      {
        status: "error",

        message:
          "Não foi possível processar sua solicitação de imagem.",
      },
      {
        status: 500,
      }
    );
  }
}
