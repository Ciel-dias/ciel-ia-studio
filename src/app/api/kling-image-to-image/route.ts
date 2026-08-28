import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * GET
 * Teste da rota Imagem → Imagem.
 *
 * URL:
 * /api/kling/image-to-image
 */
export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-to-image-v2",
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
 *
 * {
 *   prompt: string,
 *   image: string,
 *   image2?: string,
 *   aspect_ratio?: "1:1" | "16:9" | "9:16",
 *   style?: string
 * }
 *
 * As imagens podem ser enviadas como:
 * - Data URL
 * - Base64
 * - URL pública
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.KLING_API_KEY;

    /*
     * Verifica a configuração antes de qualquer chamada.
     */
    if (!apiKey) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "O serviço de geração de imagens está temporariamente indisponível.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Lê o corpo enviado pelo Card 4.
     */
    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Dados da solicitação inválidos.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt =
      typeof body.prompt === "string"
        ? body.prompt.trim()
        : "";

    const image =
      typeof body.image === "string"
        ? body.image
        : "";

    const image2 =
      typeof body.image2 === "string"
        ? body.image2
        : "";

    /*
     * Validação do prompt.
     */
    if (!prompt) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Descreva o que deseja criar na imagem.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Pelo menos uma imagem é obrigatória.
     */
    if (!image) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Envie pelo menos uma imagem de referência.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Proporção.
     */
    const allowedAspectRatios = [
      "1:1",
      "16:9",
      "9:16",
    ];

    const aspectRatio =
      typeof body.aspect_ratio === "string" &&
      allowedAspectRatios.includes(
        body.aspect_ratio
      )
        ? body.aspect_ratio
        : "1:1";

    /*
     * Estilo.
     */
    const style =
      typeof body.style === "string" &&
      body.style.trim()
        ? body.style.trim()
        : "Realista";

    /*
     * Prompt final.
     */
    const finalPrompt = `${prompt}

Estilo visual: ${style}.
Preserve os elementos importantes das imagens de referência.
Mantenha aparência natural, coerência visual, iluminação consistente e alta qualidade.`;

    /*
     * Corpo enviado para a Kling.
     *
     * Mantemos somente os campos necessários
     * para o endpoint de geração.
     */
    const klingBody: Record<string, unknown> = {
      model_name:
        typeof body.model_name === "string" &&
        body.model_name.trim()
          ? body.model_name
          : "kling-image",

      prompt: finalPrompt,

      image: image,

      aspect_ratio: aspectRatio,
    };

    /*
     * Negative prompt opcional.
     */
    if (
      typeof body.negative_prompt === "string" &&
      body.negative_prompt.trim()
    ) {
      klingBody.negative_prompt =
        body.negative_prompt.trim();
    }

    /*
     * Segunda imagem opcional.
     *
     * Só enviamos quando realmente existe.
     */
    if (image2) {
      klingBody.image2 = image2;
    }

    /*
     * Envia para a Kling.
     */
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

    /*
     * A Kling pode retornar JSON ou texto.
     */
    const responseText =
      await response.text();

    let klingData: unknown;

    try {
      klingData =
        responseText
          ? JSON.parse(responseText)
          : null;
    } catch {
      klingData = {
        rawResponse: responseText,
      };
    }

    /*
     * Tratamento de erro.
     *
     * O usuário NÃO recebe detalhes internos
     * da Kling.
     */
    if (!response.ok) {
      const errorData =
        klingData as {
          code?: number | string;
          message?: string;
          request_id?: string;
        };

      console.error(
        "Kling Image-to-Image error:",
        {
          status: response.status,
          code: errorData?.code,
          message: errorData?.message,
          request_id:
            errorData?.request_id,
        }
      );

      /*
       * Saldo insuficiente.
       */
      if (
        response.status === 429 ||
        String(errorData?.code) === "1102"
      ) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "No momento não foi possível gerar sua imagem. Tente novamente mais tarde.",
          },
          {
            status: 429,
          }
        );
      }

      /*
       * Outros erros da API.
       */
      return NextResponse.json(
        {
          status: "error",
          message:
            "Não foi possível gerar sua imagem no momento.",
        },
        {
          status:
            response.status >= 400 &&
            response.status < 600
              ? response.status
              : 500,
        }
      );
    }

    /*
     * Tentamos localizar o task_id.
     */
    const successData =
      klingData as {
        data?: {
          task_id?: string;
          task_status?: string;
          task_result?: unknown;
        };

        task_id?: string;

        task_status?: string;

        task_result?: unknown;
      };

    const taskId =
      successData?.data?.task_id ||
      successData?.task_id ||
      null;

    /*
     * Retorno de sucesso.
     */
    return NextResponse.json(
      {
        status: "success",

        message:
          "Solicitação de imagem enviada com sucesso.",

        taskId,

        data: klingData,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    /*
     * Erro inesperado do servidor.
     */
    console.error(
      "Image-to-Image route error:",
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
