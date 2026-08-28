import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-to-image-v3",
    runtime: "nodejs",
    klingConfigured: Boolean(apiKey),
    apiKeyExists: Boolean(apiKey),
    apiKeyLength: apiKey?.length ?? 0,
    apiUrl: KLING_API_URL,
    endpoint: `${KLING_API_URL}/v1/images/generations`,
    generationTest: false,
  });
}

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

    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Dados de solicitação inválidos.",
        },
        { status: 400 }
      );
    }

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";

    const image =
      typeof body?.image === "string"
        ? body.image
        : "";

    const image2 =
      typeof body?.image2 === "string"
        ? body.image2
        : "";

    if (!prompt) {
      return NextResponse.json(
        {
          status: "error",
          message: "Descreva o que deseja criar.",
        },
        { status: 400 }
      );
    }

    if (!image) {
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
      typeof body?.style === "string" &&
      body.style.trim()
        ? body.style.trim()
        : "Realista";

    const finalPrompt = `${prompt}

Estilo visual: ${style}.`;

    /*
     * Corpo enviado para a Kling.
     *
     * Mantemos somente os campos necessários
     * para evitar que opções do frontend causem
     * rejeição da API.
     */
    const klingBody: Record<string, unknown> = {
      model_name:
        body?.model_name || "kling-image",

      prompt: finalPrompt,

      image: image,

      aspect_ratio: aspectRatio,
    };

    /*
     * Segunda imagem é opcional.
     */
    if (image2) {
      klingBody.image2 = image2;
    }

    console.log(
      "CIEL IA STUDIO - Enviando Imagem → Imagem para Kling"
    );

    const response = await fetch(
      `${KLING_API_URL}/v1/images/generations`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(klingBody),

        cache: "no-store",
      }
    );

    const responseText = await response.text();

    let klingData: any;

    try {
      klingData = JSON.parse(responseText);
    } catch {
      klingData = {
        rawResponse: responseText,
      };
    }

    console.log(
      "CIEL IA STUDIO - Kling HTTP:",
      response.status
    );

    /*
     * Kling recusou a solicitação.
     *
     * O usuário recebe uma mensagem amigável.
     * Os detalhes técnicos continuam somente
     * no servidor.
     */
    if (!response.ok) {
      console.error(
        "CIEL IA STUDIO - Kling error:",
        klingData
      );

      return NextResponse.json(
        {
          status: "error",

          message:
            response.status === 429
              ? "Não foi possível gerar a imagem no momento."
              : "Não foi possível processar sua imagem.",

          details: {
            http: response.status,
            code:
              klingData?.code ??
              klingData?.data?.code ??
              null,
            requestId:
              klingData?.request_id ??
              klingData?.data?.request_id ??
              null,
          },
        },
        {
          status: response.status,
        }
      );
    }

    /*
     * Localiza o task_id nos formatos possíveis.
     */
    const taskId =
      klingData?.data?.task_id ||
      klingData?.task_id ||
      klingData?.data?.taskId ||
      klingData?.taskId ||
      null;

    /*
     * Localiza possíveis URLs de imagem retornadas
     * imediatamente pela API.
     */
    const imageUrl =
      klingData?.data?.image_url ||
      klingData?.data?.imageUrl ||
      klingData?.image_url ||
      klingData?.imageUrl ||
      null;

    return NextResponse.json({
      status: "success",

      message:
        "Solicitação de imagem enviada com sucesso.",

      taskId,

      imageUrl,

      data: klingData,
    });
  } catch (error) {
    console.error(
      "CIEL IA STUDIO - Image-to-Image error:",
      error
    );

    return NextResponse.json(
      {
        status: "error",

        message:
          "Não foi possível conectar ao serviço de geração de imagens.",
      },
      {
        status: 500,
      }
    );
  }
}
