import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
  process.env.KLING_API_BASE_URL ||
  "https://api-singapore.klingai.com";

/**
 * Cria o JWT exigido pela API da Kling.
 *
 * As credenciais ficam exclusivamente no servidor:
 * KLING_ACCESS_KEY
 * KLING_SECRET_KEY
 */
function createKlingToken(): string {
  const accessKey = process.env.KLING_ACCESS_KEY;
  const secretKey = process.env.KLING_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error(
      "Kling Access Key ou Secret Key não configuradas no servidor."
    );
  }

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

  function base64Url(value: string) {
    return Buffer.from(value)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  const encodedHeader = base64Url(
    JSON.stringify(header)
  );

  const encodedPayload = base64Url(
    JSON.stringify(payload)
  );

  const unsignedToken =
    `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(unsignedToken)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${signature}`;
}

/**
 * GET
 *
 * Verifica somente se as credenciais existem.
 * Nunca retorna a Access Key ou Secret Key.
 */
export async function GET() {
  const accessKey =
    process.env.KLING_ACCESS_KEY;

  const secretKey =
    process.env.KLING_SECRET_KEY;

  return NextResponse.json({
    status: "ok",

    routeVersion:
      "image-to-image-access-secret-v1",

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
  });
}

/**
 * POST
 *
 * Recebe:
 * image
 * image2 opcional
 * prompt
 * aspect_ratio
 * style
 */
export async function POST(
  request: Request
) {
  try {
    const accessKey =
      process.env.KLING_ACCESS_KEY;

    const secretKey =
      process.env.KLING_SECRET_KEY;

    if (!accessKey || !secretKey) {
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

    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Dados da solicitação inválidos.",
        },
        {
          status: 400,
        }
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

    const finalPrompt =
      `${prompt}\n\nEstilo visual: ${style}.`;

    /**
     * Gera o token JWT no servidor.
     */
    let token: string;

    try {
      token = createKlingToken();
    } catch (error) {
      console.error(
        "Erro ao criar token Kling:",
        error
      );

      return NextResponse.json(
        {
          status: "error",
          message:
            "Não foi possível autenticar com o serviço de imagens.",
        },
        {
          status: 500,
        }
      );
    }

    /**
     * Corpo da solicitação.
     */
    const klingBody: Record<
      string,
      unknown
    > = {
      model_name:
        body?.model_name ||
        "kling-image",

      prompt: finalPrompt,

      image,

      aspect_ratio:
        aspectRatio,
    };

    if (image2) {
      klingBody.image2 = image2;
    }

    console.log(
      "CIEL IA STUDIO - Enviando solicitação para Kling"
    );

    /**
     * Chamada autenticada.
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
          JSON.stringify(klingBody),

        cache:
          "no-store",
      }
    );

    const responseText =
      await response.text();

    let klingData: any;

    try {
      klingData =
        JSON.parse(responseText);
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
     * Kling recusou a solicitação.
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
            "A Kling recusou a solicitação de geração.",

          klingStatus:
            response.status,

          klingCode:
            klingData?.code ??
            klingData?.data?.code ??
            null,

          requestId:
            klingData?.request_id ??
            klingData?.data?.request_id ??
            null,
        },
        {
          status: response.status,
        }
      );
    }

    /**
     * Localiza o task_id.
     */
    const taskId =
      klingData?.data?.task_id ||
      klingData?.task_id ||
      klingData?.data?.taskId ||
      klingData?.taskId ||
      null;

    /**
     * Algumas respostas podem trazer
     * uma URL imediatamente.
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
        "Solicitação enviada com sucesso.",

      taskId,

      imageUrl,

      data:
        klingData,
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
