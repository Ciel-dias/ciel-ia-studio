import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * GET
 * Verifica se a autenticação da Kling está configurada.
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-to-image-api-key-v1",
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
 *
 * Imagem → Imagem
 *
 * Autenticação:
 * KLING_API_KEY
 *
 * A mesma autenticação utilizada
 * pela rota /api/kling-image.
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.KLING_API_KEY;

    /**
     * Verificação da chave.
     */
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

    /**
     * Lê o JSON enviado pelo frontend.
     */
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

    /**
     * Prompt.
     */
    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";

    if (!prompt) {
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

    /**
     * Primeira imagem.
     *
     * Pode ser uma URL ou Base64,
     * dependendo do que o frontend enviar.
     */
    const image =
      typeof body?.image === "string"
        ? body.image.trim()
        : "";

    if (!image) {
      return NextResponse.json(
        {
          status: "error",
          stage: "validation",

          message:
            "Envie pelo menos uma imagem de referência.",
        },
        { status: 400 }
      );
    }

    /**
     * Segunda imagem é opcional.
     */
    const image2 =
      typeof body?.image2 === "string"
        ? body.image2.trim()
        : "";

    /**
     * Proporção.
     */
    const aspectRatio =
      ["1:1", "16:9", "9:16"].includes(
        body?.aspect_ratio
      )
        ? body.aspect_ratio
        : "1:1";

    /**
     * Modelo.
     *
     * Mantemos o mesmo padrão da rota
     * Texto → Imagem que já está sendo usada.
     */
    const modelName =
      typeof body?.model_name === "string" &&
      body.model_name.trim()
        ? body.model_name.trim()
        : "kling-v1-5";

    /**
     * Estilo opcional.
     */
    const style =
      typeof body?.style === "string" &&
      body.style.trim()
        ? body.style.trim()
        : "";

    /**
     * Prompt final.
     */
    const finalPrompt = style
      ? `${prompt} Estilo visual: ${style}.`
      : prompt;

    /**
     * Corpo enviado para a Kling.
     *
     * A autenticação continua exatamente
     * igual à rota que já funciona.
     */
    const klingBody: Record<string, unknown> = {
      model_name: modelName,

      prompt: finalPrompt,

      image: image,

      aspect_ratio: aspectRatio,

      n: 1,
    };

    /**
     * Segunda imagem opcional.
     */
    if (image2) {
      klingBody.image2 = image2;
    }

    console.log(
      "CIEL IA STUDIO - Imagem → Imagem"
    );

    console.log(
      "Kling Image-to-Image Request:",
      JSON.stringify({
        ...klingBody,
        image: "[IMAGE]",
        ...(image2
          ? { image2: "[IMAGE2]" }
          : {}),
      })
    );

    /**
     * Chamada para a Kling.
     */
    const response = await fetch(
      `${KLING_API_URL}/v1/images/generations`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",

          /**
           * MESMA AUTENTICAÇÃO
           * DO TEXTO → IMAGEM.
           */
          Authorization: `Bearer ${apiKey}`,

          "Content-Type": "application/json",
        },

        body: JSON.stringify(klingBody),

        cache: "no-store",
      }
    );

    /**
     * Lê a resposta como texto primeiro.
     */
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
      "Kling Image-to-Image HTTP:",
      response.status
    );

    console.log(
      "Kling Image-to-Image Response:",
      JSON.stringify(data)
    );

    /**
     * ERRO DA KLING
     *
     * Retornamos os detalhes para conseguirmos
     * identificar exatamente o que a API recusou.
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
            data?.code ??
            data?.data?.code ??
            null,

          klingMessage:
            data?.message ??
            data?.data?.message ??
            null,

          requestId:
            data?.request_id ??
            data?.data?.request_id ??
            null,

          klingResponse: data,

          requestSent: {
            endpoint:
              `${KLING_API_URL}/v1/images/generations`,

            model_name: modelName,

            aspect_ratio: aspectRatio,

            promptReceived: true,

            promptLength: finalPrompt.length,

            imageReceived: true,

            image2Received: Boolean(image2),

            n: 1,
          },
        },
        {
          /**
           * Mantemos HTTP 200 para que o frontend
           * consiga mostrar os detalhes retornados.
           */
          status: 200,
        }
      );
    }

    /**
     * SUCESSO
     */
    const taskId =
      data?.data?.task_id ||
      data?.task_id ||
      data?.data?.taskId ||
      data?.taskId ||
      null;

    /**
     * Possíveis URLs retornadas.
     */
    const imageUrl =
      data?.data?.image_url ||
      data?.data?.imageUrl ||
      data?.image_url ||
      data?.imageUrl ||
      null;

    return NextResponse.json({
      status: "success",

      stage: "kling",

      message:
        "A Kling aceitou a solicitação de imagem.",

      taskId,

      imageUrl,

      klingCode:
        data?.code ??
        data?.data?.code ??
        null,

      klingMessage:
        data?.message ??
        data?.data?.message ??
        null,

      requestId:
        data?.request_id ??
        data?.data?.request_id ??
        null,

      taskStatus:
        data?.data?.task_status ??
        data?.task_status ??
        null,

      klingResponse: data,

      requestSent: {
        endpoint:
          `${KLING_API_URL}/v1/images/generations`,

        model_name: modelName,

        aspect_ratio: aspectRatio,

        promptReceived: true,

        promptLength: finalPrompt.length,

        imageReceived: true,

        image2Received: Boolean(image2),

        n: 1,
      },
    });
  } catch (error) {
    console.error(
      "CIEL IA STUDIO - Image-to-Image API error:",
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
