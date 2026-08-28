import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * GET
 * Verifica a configuração da rota.
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-debug-v3",
    runtime: "nodejs",

    klingConfigured: Boolean(apiKey),
    apiKeyExists: Boolean(apiKey),
    apiKeyLength: apiKey?.length ?? 0,

    apiUrl: KLING_API_URL,

    endpoint:
      `${KLING_API_URL}/v1/images/generations`,

    generationTest: false,
  });
}

/**
 * POST
 * Teste de geração REAL de imagem.
 *
 * IMPORTANTE:
 * Esta versão devolve a resposta COMPLETA
 * da Kling para descobrirmos exatamente
 * o que está sendo recusado.
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.KLING_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          stage: "configuration",

          message:
            "KLING_API_KEY não configurada na Vercel.",
        },
        { status: 500 }
      );
    }

    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",
          stage: "request",

          message:
            "O corpo da requisição não contém JSON válido.",
        },
        { status: 400 }
      );
    }

    const prompt = body?.prompt;

    if (
      !prompt ||
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return NextResponse.json(
        {
          status: "error",
          stage: "validation",

          message:
            "O campo 'prompt' é obrigatório.",
        },
        { status: 400 }
      );
    }

    /*
     * Modelos aceitos pela família de geração
     * de imagens da Kling.
     *
     * Para o primeiro teste vamos utilizar
     * kling-v1-5, que possui suporte ao
     * endpoint /v1/images/generations.
     */
    const modelName =
      typeof body.model_name === "string" &&
      body.model_name.trim()
        ? body.model_name
        : "kling-v1-5";

    const aspectRatio =
      ["1:1", "16:9", "9:16"].includes(
        body.aspect_ratio
      )
        ? body.aspect_ratio
        : "1:1";

    const klingBody = {
      model_name: modelName,

      prompt: prompt.trim(),

      negative_prompt:
        typeof body.negative_prompt === "string"
          ? body.negative_prompt
          : "",

      aspect_ratio: aspectRatio,

      n: 1,
    };

    console.log(
      "Kling Image Request:",
      JSON.stringify(klingBody)
    );

    const response = await fetch(
      `${KLING_API_URL}/v1/images/generations`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(klingBody),

        cache: "no-store",
      }
    );

    const text = await response.text();

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        rawResponse: text,
      };
    }

    console.log(
      "Kling Image Status:",
      response.status
    );

    console.log(
      "Kling Image Response:",
      JSON.stringify(data)
    );

    /*
     * RESPOSTA DE ERRO
     *
     * Devolvemos tudo que a Kling enviou
     * para descobrirmos exatamente o problema.
     */
    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",

          stage: "kling",

          message:
            "A Kling recusou a solicitação de imagem.",

          httpStatus: response.status,

          httpStatusText: response.statusText,

          klingCode:
            data?.code ?? null,

          klingMessage:
            data?.message ?? null,

          requestId:
            data?.request_id ?? null,

          klingResponse: data,

          requestSent: {
            endpoint:
              `${KLING_API_URL}/v1/images/generations`,

            model_name: modelName,

            aspect_ratio: aspectRatio,

            promptReceived: true,

            promptLength: prompt.trim().length,

            n: 1,
          },
        },
        {
          status: 200,
        }
      );
    }

    /*
     * RESPOSTA DE SUCESSO
     */
    const taskId =
      data?.data?.task_id ||
      data?.task_id ||
      null;

    return NextResponse.json({
      status: "success",

      stage: "kling",

      message:
        "A Kling aceitou a solicitação de imagem.",

      taskId,

      klingCode:
        data?.code ?? null,

      klingMessage:
        data?.message ?? null,

      requestId:
        data?.request_id ?? null,

      taskStatus:
        data?.data?.task_status ?? null,

      klingResponse: data,

      requestSent: {
        endpoint:
          `${KLING_API_URL}/v1/images/generations`,

        model_name: modelName,

        aspect_ratio: aspectRatio,

        promptReceived: true,

        promptLength: prompt.trim().length,

        n: 1,
      },
    });
  } catch (error) {
    console.error(
      "Kling Image API error:",
      error
    );

    return NextResponse.json(
      {
        status: "error",

        stage: "server",

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
