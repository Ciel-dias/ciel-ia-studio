import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * GET
 *
 * Verifica se a autenticação da Kling está configurada.
 *
 * Usa a mesma variável que já funciona
 * na rota /api/kling-image:
 *
 * KLING_API_KEY
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",

    routeVersion: "image-to-image-api-key-v2",

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
 * Recebe do frontend:
 *
 * {
 *   prompt: string,
 *   image: string,
 *   image2?: string,
 *   aspect_ratio?: string,
 *   style?: string
 * }
 *
 * A autenticação utiliza:
 *
 * KLING_API_KEY
 */
export async function POST(request: Request) {
  try {
    /**
     * =====================================================
     * 1. AUTENTICAÇÃO
     * =====================================================
     */

    const apiKey = process.env.KLING_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",

          stage: "configuration",

          message:
            "KLING_API_KEY não configurada na Vercel.",

          klingConfigured: false,
        },
        {
          status: 500,
        }
      );
    }

    /**
     * =====================================================
     * 2. LER JSON
     * =====================================================
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
        {
          status: 400,
        }
      );
    }

    /**
     * =====================================================
     * 3. PROMPT
     * =====================================================
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
        {
          status: 400,
        }
      );
    }

    /**
     * =====================================================
     * 4. PRIMEIRA IMAGEM
     * =====================================================
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
        {
          status: 400,
        }
      );
    }

    /**
     * =====================================================
     * 5. SEGUNDA IMAGEM
     * =====================================================
     *
     * Opcional.
     */

    const image2 =
      typeof body?.image2 === "string"
        ? body.image2.trim()
        : "";

    /**
     * =====================================================
     * 6. PROPORÇÃO
     * =====================================================
     */

    const allowedAspectRatios = [
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

    /**
     * =====================================================
     * 7. ESTILO
     * =====================================================
     */

    const style =
      typeof body?.style === "string"
        ? body.style.trim()
        : "";

    /**
     * =====================================================
     * 8. MODELO
     * =====================================================
     *
     * Mantemos o mesmo modelo utilizado
     * pela rota de Texto → Imagem.
     */

    const modelName =
      typeof body?.model_name === "string" &&
      body.model_name.trim()
        ? body.model_name.trim()
        : "kling-v1-5";

    /**
     * =====================================================
     * 9. PROMPT FINAL
     * =====================================================
     */

    const finalPrompt = style
      ? `${prompt}. Estilo visual: ${style}.`
      : prompt;

    /**
     * =====================================================
     * 10. PREPARAR PAYLOAD
     * =====================================================
     *
     * A imagem recebida pelo frontend pode ser:
     *
     * data:image/jpeg;base64,...
     *
     * ou
     *
     * uma URL.
     */

    const klingBody: Record<string, unknown> = {
      model_name: modelName,

      prompt: finalPrompt,

      image: image,

      aspect_ratio: aspectRatio,

      n: 1,
    };

    /**
     * Adiciona a segunda imagem somente
     * quando realmente foi enviada.
     */
    if (image2) {
      klingBody.image2 = image2;
    }

    /**
     * =====================================================
     * 11. LOG SEGURO
     * =====================================================
     *
     * Nunca colocamos Base64 completo no log.
     */

    console.log(
      "=============================================="
    );

    console.log(
      "CIEL IA STUDIO - KLING IMAGE TO IMAGE"
    );

    console.log(
      "Endpoint:",
      `${KLING_API_URL}/v1/images/generations`
    );

    console.log(
      "Model:",
      modelName
    );

    console.log(
      "Aspect Ratio:",
      aspectRatio
    );

    console.log(
      "Image 1:",
      image ? "RECEIVED" : "NOT_RECEIVED"
    );

    console.log(
      "Image 1 length:",
      image.length
    );

    console.log(
      "Image 2:",
      image2 ? "RECEIVED" : "NOT_RECEIVED"
    );

    console.log(
      "Image 2 length:",
      image2.length
    );

    console.log(
      "Prompt length:",
      finalPrompt.length
    );

    console.log(
      "=============================================="
    );

    /**
     * =====================================================
     * 12. CHAMADA PARA KLING
     * =====================================================
     */

    const response = await fetch(
      `${KLING_API_URL}/v1/images/generations`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",

          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          klingBody
        ),

        cache: "no-store",
      }
    );

    /**
     * =====================================================
     * 13. LER RESPOSTA
     * =====================================================
     */

    const responseText =
      await response.text();

    let data: any;

    try {
      data =
        responseText
          ? JSON.parse(responseText)
          : {};
    } catch {
      data = {
        rawResponse:
          responseText,
      };
    }

    /**
     * Logs da resposta.
     */

    console.log(
      "Kling HTTP Status:",
      response.status
    );

    console.log(
      "Kling Response:",
      JSON.stringify(data)
    );

    /**
     * =====================================================
     * 14. ERRO DA KLING
     * =====================================================
     */

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",

          stage: "kling",

          message:
            data?.message ||
            "A Kling recusou a solicitação de imagem.",

          httpStatus:
            response.status,

          httpStatusText:
            response.statusText,

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

          klingResponse:
            data,

          requestSent: {
            endpoint:
              `${KLING_API_URL}/v1/images/generations`,

            model_name:
              modelName,

            aspect_ratio:
              aspectRatio,

            promptReceived:
              true,

            promptLength:
              finalPrompt.length,

            imageReceived:
              true,

            image2Received:
              Boolean(image2),

            n: 1,
          },
        },
        {
          /**
           * Mantemos 200 para o frontend
           * conseguir mostrar os detalhes
           * devolvidos pela Kling.
           */
          status: 200,
        }
      );
    }

    /**
     * =====================================================
     * 15. EXTRAIR TASK ID
     * =====================================================
     */

    const taskId =
      data?.data?.task_id ??
      data?.task_id ??
      data?.data?.taskId ??
      data?.taskId ??
      "";

    /**
     * =====================================================
     * 16. EXTRAIR URL DA IMAGEM
     * =====================================================
     *
     * A Kling pode retornar a URL diretamente
     * ou dentro de image_list.
     */

    let imageUrl =
      data?.data?.image_url ??
      data?.data?.imageUrl ??
      data?.image_url ??
      data?.imageUrl ??
      "";

    /**
     * Algumas respostas da Kling podem
     * utilizar image_list.
     */

    if (
      !imageUrl &&
      Array.isArray(
        data?.data?.image_list
      )
    ) {
      imageUrl =
        data.data.image_list?.[0]
          ?.url ??
        "";
    }

    /**
     * =====================================================
     * 17. STATUS DA TAREFA
     * =====================================================
     */

    const taskStatus =
      data?.data?.task_status ??
      data?.task_status ??
      "";

    /**
     * =====================================================
     * 18. SUCESSO
     * =====================================================
     */

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

      taskStatus,

      klingResponse:
        data,

      requestSent: {
        endpoint:
          `${KLING_API_URL}/v1/images/generations`,

        model_name:
          modelName,

        aspect_ratio:
          aspectRatio,

        promptReceived:
          true,

        promptLength:
          finalPrompt.length,

        imageReceived:
          true,

        image2Received:
          Boolean(image2),

        n: 1,
      },
    });
  } catch (error) {
    /**
     * =====================================================
     * ERRO INTERNO
     * =====================================================
     */

    console.error(
      "CIEL IA STUDIO - Kling Image-to-Image error:",
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
