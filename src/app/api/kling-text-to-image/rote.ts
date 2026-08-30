import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  "https://api-singapore.klingai.com";

const KLING_ENDPOINT =
  `${KLING_API_URL}/v1/images/generations`;

/*
 * =====================================================
 * GET
 * =====================================================
 */

export async function GET() {
  const apiKey =
    process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",

    routeVersion:
      "text-to-image-api-key-v1",

    runtime: "nodejs",

    klingConfigured:
      Boolean(apiKey),

    apiKeyExists:
      Boolean(apiKey),

    apiKeyLength:
      apiKey
        ? apiKey.length
        : 0,

    apiUrl:
      KLING_API_URL,

    endpoint:
      KLING_ENDPOINT,

    generationTest:
      false,
  });
}

/*
 * =====================================================
 * POST
 *
 * TEXTO → IMAGEM
 * =====================================================
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * =================================================
     * 1. API KEY
     * =================================================
     */

    const apiKey =
      process.env.KLING_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",

          stage:
            "configuration",

          message:
            "KLING_API_KEY não está configurada na Vercel.",

          routeVersion:
            "text-to-image-api-key-v1",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =================================================
     * 2. LER JSON
     * =================================================
     */

    let body: any;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",

          stage:
            "request",

          message:
            "O corpo da requisição não contém JSON válido.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * 3. PROMPT
     * =================================================
     */

    const prompt =
      typeof body?.prompt ===
      "string"
        ? body.prompt.trim()
        : "";

    if (!prompt) {
      return NextResponse.json(
        {
          status: "error",

          stage:
            "validation",

          message:
            "Digite uma descrição para gerar a imagem.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * 4. PROPORÇÃO
     * =================================================
     */

    const allowedAspectRatios =
      [
        "1:1",
        "16:9",
        "9:16",
      ];

    const aspectRatio =
      allowedAspectRatios.includes(
        body?.aspect_ratio
      )
        ? body.aspect_ratio
        : "1:1";

    /*
     * =================================================
     * 5. MODELO
     * =================================================
     */

    const modelName =
      typeof body?.model_name ===
        "string" &&
      body.model_name.trim()
        ? body.model_name.trim()
        : "kling-v1-5";

    /*
     * =================================================
     * 6. ESTILO
     * =================================================
     */

    const style =
      typeof body?.style ===
        "string" &&
      body.style.trim()
        ? body.style.trim()
        : "";

    /*
     * =================================================
     * 7. PROMPT FINAL
     * =================================================
     */

    const finalPrompt =
      style
        ? `${prompt} Estilo visual: ${style}.`
        : prompt;

    /*
     * =================================================
     * 8. CORPO DA KLING
     *
     * Texto → Imagem não utiliza imagem
     * de referência.
     * =================================================
     */

    const klingBody: Record<
      string,
      unknown
    > = {
      model_name:
        modelName,

      prompt:
        finalPrompt,

      negative_prompt:
        "baixa qualidade, deformações, artefatos, texto ilegível, imagem distorcida",

      aspect_ratio:
        aspectRatio,

      n:
        1,
    };

    /*
     * =================================================
     * 9. LOG SEGURO
     * =================================================
     */

    console.log(
      "=========================================="
    );

    console.log(
      "CIEL IA STUDIO - TEXTO → IMAGEM"
    );

    console.log(
      "Endpoint:",
      KLING_ENDPOINT
    );

    console.log(
      "Modelo:",
      modelName
    );

    console.log(
      "Aspect ratio:",
      aspectRatio
    );

    console.log(
      "Prompt length:",
      finalPrompt.length
    );

    console.log(
      "=========================================="
    );

    /*
     * =================================================
     * 10. CHAMAR KLING
     * =================================================
     */

    const response =
      await fetch(
        KLING_ENDPOINT,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              klingBody
            ),

          cache:
            "no-store",
        }
      );

    /*
     * =================================================
     * 11. LER RESPOSTA
     * =================================================
     */

    const responseText =
      await response.text();

    let data: any = null;

    try {
      data =
        responseText
          ? JSON.parse(
              responseText
            )
          : null;
    } catch {
      data = {
        rawResponse:
          responseText,
      };
    }

    console.log(
      "Kling HTTP:",
      response.status
    );

    console.log(
      "Kling Response:",
      JSON.stringify(data)
    );

    /*
     * =================================================
     * 12. DADOS DA KLING
     * =================================================
     */

    const klingCode =
      data?.code ??
      data?.data?.code ??
      null;

    const klingMessage =
      data?.message ??
      data?.data?.message ??
      data?.error ??
      null;

    const requestId =
      data?.request_id ??
      data?.data?.request_id ??
      null;

    /*
     * =================================================
     * 13. SALDO INSUFICIENTE
     *
     * 1102 / 429
     * =================================================
     */

    const balanceError =
      Number(
        klingCode
      ) === 1102 ||
      String(
        klingMessage ?? ""
      )
        .toLowerCase()
        .includes(
          "account balance not enough"
        );

    if (
      balanceError
    ) {
      return NextResponse.json(
        {
          status:
            "error",

          stage:
            "kling",

          message:
            "Saldo insuficiente na Kling para gerar a imagem.",

          httpStatus:
            response.status,

          klingCode:
            klingCode,

          klingMessage:
            klingMessage ||
            "Account balance not enough",

          requestId:
            requestId,

          klingResponse:
            data,

          routeVersion:
            "text-to-image-api-key-v1",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * =================================================
     * 14. OUTROS ERROS
     * =================================================
     */

    if (
      !response.ok
    ) {
      return NextResponse.json(
        {
          status:
            "error",

          stage:
            "kling",

          message:
            klingMessage ||
            "A Kling recusou a solicitação de imagem.",

          httpStatus:
            response.status,

          klingCode:
            klingCode,

          klingMessage:
            klingMessage,

          requestId:
            requestId,

          klingResponse:
            data,

          routeVersion:
            "text-to-image-api-key-v1",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * =================================================
     * 15. ERRO INTERNO DA KLING
     * =================================================
     */

    if (
      data &&
      typeof data.code !==
        "undefined" &&
      Number(
        data.code
      ) !== 0
    ) {
      return NextResponse.json(
        {
          status:
            "error",

          stage:
            "kling",

          message:
            data.message ||
            "A Kling recusou a solicitação de imagem.",

          httpStatus:
            response.status,

          klingCode:
            data.code,

          klingMessage:
            data.message ||
            null,

          requestId:
            data.request_id ||
            null,

          klingResponse:
            data,

          routeVersion:
            "text-to-image-api-key-v1",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * =================================================
     * 16. TASK ID
     * =================================================
     */

    const taskId =
      data?.data?.task_id ??
      data?.task_id ??
      data?.data?.taskId ??
      data?.taskId ??
      null;

    /*
     * =================================================
     * 17. URL DA IMAGEM
     * =================================================
     */

    const imageUrl =
      data?.data?.image_url ??
      data?.data?.imageUrl ??
      data?.image_url ??
      data?.imageUrl ??
      null;

    /*
     * =================================================
     * 18. SUCESSO
     * =================================================
     */

    return NextResponse.json(
      {
        status:
          "success",

        stage:
          "kling",

        message:
          "A Kling aceitou a solicitação de imagem.",

        taskId,

        imageUrl,

        httpStatus:
          response.status,

        klingCode:
          klingCode,

        klingMessage:
          klingMessage,

        requestId:
          requestId,

        taskStatus:
          data?.data?.task_status ??
          data?.task_status ??
          null,

        klingResponse:
          data,

        routeVersion:
          "text-to-image-api-key-v1",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /*
     * =================================================
     * 19. ERRO INTERNO
     * =================================================
     */

    console.error(
      "CIEL IA STUDIO - Text-to-Image API error:",
      error
    );

    return NextResponse.json(
      {
        status:
          "error",

        stage:
          "server",

        message:
          error instanceof Error
            ? error.message
            : "Erro interno na API de imagens Kling.",

        routeVersion:
          "text-to-image-api-key-v1",
      },
      {
        status: 500,
      }
    );
  }
}
