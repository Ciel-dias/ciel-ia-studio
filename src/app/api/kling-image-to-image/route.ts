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
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-to-image-api-key-v3",
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
 * Modelo:
 * kling-v1-5
 *
 * A imagem enviada pelo usuário é utilizada
 * como referência de assunto através de:
 *
 * image_reference: "subject"
 */
export async function POST(request: Request) {
  try {
    /**
     * =====================================================
     * 1. VERIFICAR API KEY
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
        },
        {
          status: 500,
        }
      );
    }

    /**
     * =====================================================
     * 2. LER JSON DO FRONTEND
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
     * 3. VALIDAR PROMPT
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
     * 4. VALIDAR IMAGEM PRINCIPAL
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
     *
     * Mantemos a leitura porque o frontend já envia
     * image2, porém o endpoint /v1/images/generations
     * não trata image2 como segunda referência.
     *
     * A primeira imagem será usada como referência
     * principal neste teste.
     * =====================================================
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
     * 7. MODELO
     * =====================================================
     */

    const modelName =
      typeof body?.model_name === "string" &&
      body.model_name.trim()
        ? body.model_name.trim()
        : "kling-v1-5";

    /**
     * =====================================================
     * 8. ESTILO
     * =====================================================
     */

    const style =
      typeof body?.style === "string" &&
      body.style.trim()
        ? body.style.trim()
        : "";

    /**
     * =====================================================
     * 9. PROMPT FINAL
     * =====================================================
     */

    const finalPrompt = style
      ? `${prompt} Estilo visual: ${style}.`
      : prompt;

    /**
     * =====================================================
     * 10. CORPO ENVIADO PARA KLING
     *
     * IMPORTANTE:
     *
     * Para kling-v1-5, quando existe uma imagem,
     * image_reference é obrigatório.
     *
     * subject = referência do assunto/personagem/objeto.
     *
     * image_fidelity:
     * 0.7 = boa fidelidade à imagem original.
     * =====================================================
     */

    const klingBody: Record<string, unknown> = {
      model_name: modelName,

      prompt: finalPrompt,

      negative_prompt: "",

      image: image,

      image_reference: "subject",

      image_fidelity: 0.7,

      human_fidelity: 1,

      aspect_ratio: aspectRatio,

      n: 1,
    };

    /**
     * =====================================================
     * 11. LOG SEGURO
     *
     * Não mostramos o Base64 completo da imagem
     * nos logs da Vercel.
     * =====================================================
     */

    console.log(
      "=============================================="
    );

    console.log(
      "CIEL IA STUDIO - IMAGEM → IMAGEM"
    );

    console.log(
      "Kling endpoint:",
      `${KLING_API_URL}/v1/images/generations`
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
      "Image reference:",
      "subject"
    );

    console.log(
      "Image fidelity:",
      0.7
    );

    console.log(
      "Human fidelity:",
      1
    );

    console.log(
      "Image recebida:",
      Boolean(image)
    );

    console.log(
      "Image 2 recebida:",
      Boolean(image2)
    );

    console.log(
      "Prompt length:",
      finalPrompt.length
    );

    console.log(
      "Kling request:",
      JSON.stringify({
        ...klingBody,
        image: "[IMAGE_BASE64_OR_URL]",
      })
    );

    console.log(
      "=============================================="
    );

    /**
     * =====================================================
     * 12. CHAMAR KLING
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

        body:
          JSON.stringify(klingBody),

        cache: "no-store",
      }
    );

    /**
     * =====================================================
     * 13. LER RESPOSTA
     * =====================================================
     */

    const text =
      await response.text();

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        rawResponse: text,
      };
    }

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

            image_reference:
              "subject",

            image_fidelity:
              0.7,

            human_fidelity:
              1,

            promptReceived:
              true,

            promptLength:
              finalPrompt.length,

            imageReceived:
              true,

            image2Received:
              Boolean(image2),

            n:
              1,
          },
        },
        {
          /**
           * Mantemos 200 para que o frontend
           * consiga mostrar os detalhes do erro.
           */
          status: 200,
        }
      );
    }

    /**
     * =====================================================
     * 15. TASK ID
     * =====================================================
     */

    const taskId =
      data?.data?.task_id ||
      data?.task_id ||
      data?.data?.taskId ||
      data?.taskId ||
      null;

    /**
     * =====================================================
     * 16. POSSÍVEL URL DA IMAGEM
     *
     * Normalmente a criação retorna primeiro
     * o task_id e a imagem fica disponível
     * depois da conclusão da tarefa.
     * =====================================================
     */

    const imageUrl =
      data?.data?.image_url ||
      data?.data?.imageUrl ||
      data?.image_url ||
      data?.imageUrl ||
      null;

    /**
     * =====================================================
     * 17. RESPOSTA DE SUCESSO
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

      taskStatus:
        data?.data?.task_status ??
        data?.task_status ??
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

        image_reference:
          "subject",

        image_fidelity:
          0.7,

        human_fidelity:
          1,

        promptReceived:
          true,

        promptLength:
          finalPrompt.length,

        imageReceived:
          true,

        image2Received:
          Boolean(image2),

        n:
          1,
      },
    });
  } catch (error) {
    /**
     * =====================================================
     * 18. ERRO INTERNO
     * =====================================================
     */

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
