import { NextRequest, NextResponse } from "next/server";

const KLING_API_URL =
  "https://api-singapore.klingai.com";

type KlingCreateResponse = {
  code?: number;
  message?: string;
  request_id?: string;
  data?: {
    task_id?: string;
    task_status?: string;
    task_status_msg?: string;
  };
};

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      prompt,
      negative_prompt,
      aspect_ratio = "9:16",
      duration = "5",
      model_name = "kling-v3",
      mode = "std",
    } = body;

    if (
      !prompt ||
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Digite uma descrição para o vídeo.",
        },
        { status: 400 }
      );
    }

    const accessKey =
      process.env.KLING_ACCESS_KEY;

    const secretKey =
      process.env.KLING_SECRET_KEY;

    if (!accessKey || !secretKey) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "As credenciais da Kling não estão configuradas na Vercel.",
        },
        { status: 500 }
      );
    }

    /*
     * IMPORTANTE:
     * A Kling utiliza autenticação JWT.
     *
     * As chaves ficam somente no servidor.
     */

    const jwt = await createKlingJWT(
      accessKey,
      secretKey
    );

    const response = await fetch(
      `${KLING_API_URL}/v1/videos/text2video`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },

        body: JSON.stringify({
          model_name,

          prompt: prompt.trim(),

          ...(negative_prompt &&
          typeof negative_prompt === "string"
            ? {
                negative_prompt:
                  negative_prompt.trim(),
              }
            : {}),

          aspect_ratio,

          duration,

          mode,
        }),
      }
    );

    const responseText =
      await response.text();

    let data: KlingCreateResponse;

    try {
      data = JSON.parse(
        responseText
      ) as KlingCreateResponse;
    } catch {
      console.error(
        "Kling retornou resposta não JSON:",
        responseText
      );

      return NextResponse.json(
        {
          status: "error",
          message:
            "A Kling retornou uma resposta inválida.",
          klingStatus:
            response.status,
          rawResponse:
            responseText.substring(
              0,
              1000
            ),
        },
        {
          status:
            response.status >= 400
              ? response.status
              : 502,
        }
      );
    }

    console.log(
      "CIEL IA STUDIO - Kling Texto → Vídeo:",
      data
    );

    if (
      !response.ok ||
      data.code !== 0
    ) {
      return NextResponse.json(
        {
          status: "error",

          message:
            data.message ||
            "A Kling recusou a solicitação.",

          klingStatus:
            response.status,

          klingResponse:
            data,
        },
        {
          status:
            response.status >= 400
              ? response.status
              : 400,
        }
      );
    }

    const taskId =
      data.data?.task_id || null;

    return NextResponse.json({
      status: "success",

      message:
        "Tarefa enviada para a Kling com sucesso!",

      taskId,

      klingStatus:
        response.status,

      klingResponse:
        data,
    });
  } catch (error) {
    console.error(
      "Erro na rota /api/kling-text-to-video:",
      error
    );

    return NextResponse.json(
      {
        status: "error",

        message:
          error instanceof Error
            ? error.message
            : "Não foi possível conectar à API Kling.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   JWT DA KLING
===================================================== */

async function createKlingJWT(
  accessKey: string,
  secretKey: string
): Promise<string> {
  const encoder =
    new TextEncoder();

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    iss: accessKey,

    exp:
      Math.floor(
        Date.now() / 1000
      ) + 1800,

    nbf:
      Math.floor(
        Date.now() / 1000
      ) - 5,
  };

  const encodedHeader =
    base64UrlEncode(
      JSON.stringify(header)
    );

  const encodedPayload =
    base64UrlEncode(
      JSON.stringify(payload)
    );

  const unsignedToken =
    `${encodedHeader}.${encodedPayload}`;

  const key =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(secretKey),
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(
        unsignedToken
      )
    );

  const encodedSignature =
    base64UrlEncode(
      new Uint8Array(signature)
    );

  return `${unsignedToken}.${encodedSignature}`;
}

/* =====================================================
   BASE64 URL
===================================================== */

function base64UrlEncode(
  value:
    | string
    | Uint8Array
): string {
  let binary = "";

  if (typeof value === "string") {
    binary = btoa(value);
  } else {
    const bytes =
      value;

    let result = "";

    for (
      let i = 0;
      i < bytes.length;
      i++
    ) {
      result += String.fromCharCode(
        bytes[i]
      );
    }

    binary = btoa(result);
  }

  return binary
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
