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
    routeVersion: "image-to-image-api-key-v4",

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
 * IMAGEM → IMAGEM
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
            "image-to-image-api-key-v4",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =================================================
     * 2. JSON
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
            "Digite uma descrição para a imagem.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * 4. IMAGEM
     * =================================================
     */

    const image =
      typeof body?.image ===
      "string"
        ? body.image.trim()
        : "";

    if (!image) {
      return NextResponse.json(
        {
          status: "error",

          stage:
            "validation",

          message:
            "Envie uma imagem de referência.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * 5. NÃO ACEITAR BLOB LOCAL
     * =================================================
     */

    if (
      image.startsWith(
        "blob:"
      )
    ) {
      return NextResponse.json(
        {
          status: "error",

          stage:
            "validation",

          message:
            "A imagem foi enviada como blob local. A Kling precisa receber uma URL pública ou Base64.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * 6. CONVERTER DATA URL
     *
     * data:image/png;base64,AAAA
     *
     * ->
     *
     * AAAA
     * =================================================
     */

    let klingImage =
      image;

    if (
      image.startsWith(
        "data:image/"
      )
    ) {
      const commaIndex =
        image.indexOf(",");

      if (
        commaIndex === -1
      ) {
        return NextResponse.json(
          {
            status: "error",

            stage:
              "validation",

            message:
              "Base64 da imagem inválido.",
          },
          {
            status: 400,
          }
        );
      }

      klingImage =
        image.substring(
          commaIndex + 1
        );
    }

    /*
     * =================================================
     * 7. PROPORÇÃO
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
     * 8. MODELO
     *
     * Mantemos o modelo usado
     * pela rota anterior.
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
     * 9. ESTILO
     * =================================================
     */

    const style =
      typeof body?.style ===
        "string" &&
      body.style.trim()
        ? body.style.trim()
        : "";

    const finalPrompt =
      style
        ? `${prompt} Estilo visual: ${style}.`
        : prompt;

    /*
     * =================================================
     * 10. CORPO KLING
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
        "baixa qualidade, deformações, artefatos, imagem distorcida",

      image:
        klingImage,

      image_reference:
        "subject",

      image_fidelity:
        0.7,

      human_fidelity:
        1,

      aspect_ratio:
        aspectRatio,

      n:
        1,
    };

    /*
     * =================================================
     * 11. LOG SEGURO
     * =================================================
     */

    console.log(
      "=========================================="
    );

    console.log(
      "CIEL IA STUDIO - IMAGEM → IMAGEM"
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
      "Imagem recebida:",
      Boolean(image)
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
     * 12. CHAMAR KLING
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
     * 13. LER RESPOSTA
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
      "Kling resposta:",
      JSON.stringify(data)
    );

    /*
     * =================================================
     * 14. CÓDIGO E MENSAGEM
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
     * 15. SALDO INSUFICIENTE
     *
     * 429 / 1102
     * =================================================
     */

    const isBalanceError =
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
      isBalanceError
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
            "image-to-image-api-key-v4",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * =================================================
     * 16. OUTROS ERROS KLING
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
            "image-to-image-api-key-v4",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * =================================================
     * 17. ERRO INTERNO DA KLING
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
            "image-to-image-api-key-v4",
        },
        {
          status: 200,
        }
      );
    }

    /*
     * =================================================
     * 18. TASK ID
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
     * 19. URL DA IMAGEM
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
     * 20. SUCESSO
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
          "image-to-image-api-key-v4",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /*
     * =================================================
     * 21. ERRO DO SERVIDOR
     * =================================================
     */

    console.error(
      "CIEL IA STUDIO - Image-to-Image API error:",
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
          "image-to-image-api-key-v4",
      },
      {
        status: 500,
      }
    );
  }
}
