import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * =========================================================
 * CIEL IA STUDIO
 * Card 4 — Imagem → Imagem
 *
 * Autenticação Kling:
 * KLING_ACCESS_KEY
 * KLING_SECRET_KEY
 *
 * JWT:
 * HS256
 * =========================================================
 */

/**
 * Base64URL
 */
function base64Url(input: Buffer | string): string {
  const buffer =
    typeof input === "string"
      ? Buffer.from(input)
      : input;

  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Gera JWT para autenticação da Kling.
 */
function createKlingJWT(
  accessKey: string,
  secretKey: string
): string {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    iss: accessKey,
    exp: now + 1800,
    nbf: now - 5,
  };

  const encodedHeader =
    base64Url(JSON.stringify(header));

  const encodedPayload =
    base64Url(JSON.stringify(payload));

  const unsignedToken =
    `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac(
      "sha256",
      secretKey
    )
    .update(unsignedToken)
    .digest();

  return `${unsignedToken}.${base64Url(signature)}`;
}

/**
 * =========================================================
 * GET
 * Teste da rota
 * =========================================================
 */
export async function GET() {
  const accessKey =
    process.env.KLING_ACCESS_KEY;

  const secretKey =
    process.env.KLING_SECRET_KEY;

  return NextResponse.json({
    status: "ok",

    routeVersion:
      "image-to-image-v4",

    runtime: "nodejs",

    klingConfigured:
      Boolean(accessKey && secretKey),

    accessKeyExists:
      Boolean(accessKey),

    secretKeyExists:
      Boolean(secretKey),

    accessKeyLength:
      accessKey?.length ?? 0,

    secretKeyLength:
      secretKey?.length ?? 0,

    apiUrl:
      KLING_API_URL,

    endpoint:
      `${KLING_API_URL}/v1/images/generations`,

    authentication:
      "JWT HS256",

    generationTest:
      false,
  });
}

/**
 * =========================================================
 * POST
 * Imagem → Imagem
 * =========================================================
 */
export async function POST(
  request: Request
) {
  try {
    /**
     * -----------------------------------------------------
     * 1. Recupera credenciais
     * -----------------------------------------------------
     */

    const accessKey =
      process.env.KLING_ACCESS_KEY;

    const secretKey =
      process.env.KLING_SECRET_KEY;

    if (!accessKey || !secretKey) {
      console.error(
        "CIEL IA STUDIO: KLING_ACCESS_KEY ou KLING_SECRET_KEY não configuradas."
      );

      return NextResponse.json(
        {
          status: "error",

          message:
            "A autenticação da Kling não está configurada no servidor.",
        },
        {
          status: 500,
        }
      );
    }

    /**
     * -----------------------------------------------------
     * 2. Lê JSON enviado pelo frontend
     * -----------------------------------------------------
     */

    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",

          message:
            "Os dados enviados são inválidos.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * -----------------------------------------------------
     * 3. Dados principais
     * -----------------------------------------------------
     */

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

          message:
            "Descreva o que deseja criar.",
        },
        {
          status: 400,
        }
      );
    }

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

    /**
     * -----------------------------------------------------
     * 4. Opções
     * -----------------------------------------------------
     */

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

    const negativePrompt =
      typeof body?.negative_prompt === "string"
        ? body.negative_prompt.trim()
        : "";

    /**
     * -----------------------------------------------------
     * 5. Prompt final
     * -----------------------------------------------------
     */

    const finalPrompt =
      `${prompt}\n\n` +
      `Estilo visual: ${style}.`;

    /**
     * -----------------------------------------------------
     * 6. Gera JWT
     * -----------------------------------------------------
     */

    const token = createKlingJWT(
      accessKey,
      secretKey
    );

    /**
     * -----------------------------------------------------
     * 7. Corpo da requisição Kling
     * -----------------------------------------------------
     *
     * A imagem principal é enviada como referência.
     */

    const klingBody: Record<
      string,
      unknown
    > = {
      model_name:
        body?.model_name ||
        "kling-v1",

      prompt:
        finalPrompt,

      negative_prompt:
        negativePrompt,

      image:
        image,

      aspect_ratio:
        aspectRatio,

      n: 1,
    };

    /**
     * -----------------------------------------------------
     * 8. Segunda imagem
     * -----------------------------------------------------
     *
     * Não enviamos image2 diretamente como parâmetro
     * desconhecido para a API.
     *
     * A primeira imagem é a referência principal.
     */

    if (image2) {
      console.log(
        "CIEL IA STUDIO: segunda imagem recebida."
      );
    }

    /**
     * -----------------------------------------------------
     * 9. Log seguro
     * -----------------------------------------------------
     */

    console.log(
      "CIEL IA STUDIO: iniciando geração Image → Image"
    );

    console.log(
      "Kling endpoint:",
      `${KLING_API_URL}/v1/images/generations`
    );

    console.log(
      "Aspect ratio:",
      aspectRatio
    );

    /**
     * -----------------------------------------------------
     * 10. Chamada Kling
     * -----------------------------------------------------
     */

    const response = await fetch(
      `${KLING_API_URL}/v1/images/generations`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",

          Accept:
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

    /**
     * -----------------------------------------------------
     * 11. Lê resposta
     * -----------------------------------------------------
     */

    const responseText =
      await response.text();

    let klingData: any;

    try {
      klingData =
        JSON.parse(
          responseText
        );
    } catch {
      klingData = {
        rawResponse:
          responseText,
      };
    }

    console.log(
      "CIEL IA STUDIO - Kling HTTP:",
      response.status
    );

    /**
     * -----------------------------------------------------
     * 12. Erro Kling
     * -----------------------------------------------------
     */

    if (!response.ok) {
      console.error(
        "CIEL IA STUDIO - Kling error:",
        klingData
      );

      const klingCode =
        klingData?.code ??
        klingData?.data?.code ??
        null;

      const klingMessage =
        klingData?.message ??
        klingData?.data?.message ??
        null;

      const requestId =
        klingData?.request_id ??
        klingData?.data?.request_id ??
        null;

      /**
       * Erro de autenticação
       */
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return NextResponse.json(
          {
            status:
              "error",

            message:
              "A autenticação da Kling foi recusada. Verifique KLING_ACCESS_KEY e KLING_SECRET_KEY.",

            klingStatus:
              response.status,

            klingCode,

            klingMessage,

            requestId,
          },
          {
            status:
              response.status,
          }
        );
      }

      /**
       * Limite/crédito
       */
      if (
        response.status === 402 ||
        response.status === 429
      ) {
        return NextResponse.json(
          {
            status:
              "error",

            message:
              "A Kling recusou a geração. Pode haver limite, crédito ou excesso de solicitações.",

            klingStatus:
              response.status,

            klingCode,

            klingMessage,

            requestId,
          },
          {
            status:
              response.status,
          }
        );
      }

      /**
       * Outros erros
       */
      return NextResponse.json(
        {
          status:
            "error",

          message:
            "A Kling não aceitou a solicitação de imagem.",

          klingStatus:
            response.status,

          klingCode,

          klingMessage,

          requestId,
        },
        {
          status:
            response.status,
        }
      );
    }

    /**
     * -----------------------------------------------------
     * 13. Localiza task_id
     * -----------------------------------------------------
     */

    const taskId =
      klingData?.data?.task_id ||
      klingData?.task_id ||
      klingData?.data?.taskId ||
      klingData?.taskId ||
      null;

    /**
     * -----------------------------------------------------
     * 14. Localiza URL de imagem
     * -----------------------------------------------------
     */

    const imageUrl =
      klingData?.data?.image_url ||
      klingData?.data?.imageUrl ||
      klingData?.image_url ||
      klingData?.imageUrl ||
      null;

    /**
     * -----------------------------------------------------
     * 15. Sucesso
     * -----------------------------------------------------
     */

    console.log(
      "CIEL IA STUDIO: Kling aceitou a solicitação."
    );

    console.log(
      "Task ID:",
      taskId
    );

    return NextResponse.json({
      status:
        "success",

      message:
        "Solicitação de imagem enviada com sucesso.",

      taskId,

      imageUrl,

      data:
        klingData,
    });
  } catch (error) {
    /**
     * -----------------------------------------------------
     * Erro inesperado
     * -----------------------------------------------------
     */

    console.error(
      "CIEL IA STUDIO - Image-to-Image exception:",
      error
    );

    return NextResponse.json(
      {
        status:
          "error",

        message:
          "Não foi possível conectar ao serviço de geração de imagens.",
      },
      {
        status:
          500,
      }
    );
  }
}
