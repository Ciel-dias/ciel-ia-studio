import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const KLING_API_URL =
  "https://api-singapore.klingai.com";

const KLING_ENDPOINT =
  `${KLING_API_URL}/v1/videos/text2video`;

export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "text-to-video-api-key-v1",
    runtime: "nodejs",
    klingConfigured: Boolean(apiKey),
    apiKeyExists: Boolean(apiKey),
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiUrl: KLING_API_URL,
    endpoint: KLING_ENDPOINT,
    generationTest: false,
  });
}

export async function POST(
  request: NextRequest
) {
  const apiKey = process.env.KLING_API_KEY;

  /*
   * MESMA CREDENCIAL DA ROTA QUE JÁ FUNCIONA:
   * KLING_API_KEY
   */

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

  try {
    const body = await request.json();

    /*
     * PROMPT
     */

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";

    if (!prompt) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Digite uma descrição para o vídeo.",
        },
        { status: 400 }
      );
    }

    /*
     * DURAÇÃO
     */

    const duration =
      body?.duration === "10" ||
      body?.duration === 10
        ? "10"
        : "5";

    /*
     * PROPORÇÃO
     */

    const aspectRatio =
      typeof body?.aspect_ratio === "string"
        ? body.aspect_ratio
        : "9:16";

    /*
     * ESTILO
     */

    const style =
      typeof body?.style === "string"
        ? body.style.trim()
        : "";

    /*
     * Prompt final.
     */

    const finalPrompt =
      style &&
      style !== "Realista"
        ? `${prompt} Estilo visual: ${style}.`
        : prompt;

    /*
     * CORPO ENVIADO PARA A KLING
     *
     * IMPORTANTE:
     * Aqui NÃO existe imagem.
     * É TEXT → VIDEO.
     */

    const klingBody: Record<
      string,
      unknown
    > = {
      model_name: "kling-v2-6",

      prompt: finalPrompt,

      negative_prompt:
        "baixa qualidade, deformações, artefatos, imagem distorcida, movimentos artificiais",

      duration,

      aspect_ratio: aspectRatio,

      mode: "std",
    };

    /*
     * CHAMADA PARA A KLING
     */

    const klingResponse =
      await fetch(
        KLING_ENDPOINT,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            klingBody
          ),
        }
      );

    /*
     * Lê a resposta como texto primeiro.
     */

    const responseText =
      await klingResponse.text();

    let klingData: any = null;

    try {
      klingData =
        responseText
          ? JSON.parse(
              responseText
            )
          : null;
    } catch {
      klingData = null;
    }

    /*
     * Se a Kling retornar HTML,
     * texto ou resposta inválida.
     */

    if (
      !klingData &&
      responseText
    ) {
      return NextResponse.json(
        {
          status: "error",

          message:
            "A Kling retornou uma resposta inválida.",

          klingStatus:
            klingResponse.status,

          rawResponse:
            responseText.substring(
              0,
              1000
            ),

          routeVersion:
            "text-to-video-api-key-v1",
        },
        {
          status:
            klingResponse.status ||
            500,
        }
      );
    }

    /*
     * ERRO HTTP
     */

    if (!klingResponse.ok) {
      const klingMessage =
        klingData?.message ||
        klingData?.error ||
        responseText ||
        "A Kling retornou um erro.";

      /*
       * SALDO INSUFICIENTE
       */

      if (
        String(
          klingMessage
        )
          .toLowerCase()
          .includes(
            "account balance not enough"
          )
      ) {
        return NextResponse.json(
          {
            status: "error",

            message:
              "Saldo insuficiente na Kling para gerar este vídeo.",

            klingStatus:
              klingResponse.status,

            klingResponse:
              klingData,

            routeVersion:
              "text-to-video-api-key-v1",
          },
          {
            status:
              klingResponse.status,
          }
        );
      }

      return NextResponse.json(
        {
          status: "error",

          message:
            klingMessage,

          klingStatus:
            klingResponse.status,

          klingResponse:
            klingData,

          routeVersion:
            "text-to-video-api-key-v1",
        },
        {
          status:
            klingResponse.status,
        }
      );
    }

    /*
     * CÓDIGO INTERNO DA KLING
     *
     * HTTP 200 pode existir mesmo
     * quando a Kling retorna code diferente de 0.
     */

    if (
      klingData &&
      typeof klingData.code !==
        "undefined" &&
      Number(
        klingData.code
      ) !== 0
    ) {
      return NextResponse.json(
        {
          status: "error",

          message:
            klingData.message ||
            "A Kling recusou a solicitação.",

          klingStatus:
            klingResponse.status,

          klingResponse:
            klingData,

          routeVersion:
            "text-to-video-api-key-v1",
        },
        {
          status:
            klingResponse.status ||
            400,
        }
      );
    }

    /*
     * TASK ID
     */

    const taskId =
      klingData?.data?.task_id ??
      klingData?.task_id ??
      null;

    /*
     * SUCESSO
     */

    return NextResponse.json(
      {
        status: "success",

        message:
          "Sua tarefa de Texto → Vídeo foi enviada para a Kling com sucesso.",

        taskId,

        klingStatus:
          klingResponse.status,

        klingResponse:
          klingData,

        routeVersion:
          "text-to-video-api-key-v1",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro em /api/kling-text-to-video:",
      error
    );

    return NextResponse.json(
      {
        status: "error",

        message:
          error instanceof Error
            ? error.message
            : "Erro interno ao conectar com a Kling.",

        routeVersion:
          "text-to-video-api-key-v1",
      },
      {
        status: 500,
      }
    );
  }
}
