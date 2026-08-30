import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const KLING_API_URL =
  "https://api-singapore.klingai.com";

const KLING_ENDPOINT =
  `${KLING_API_URL}/v1/videos/image2video`;

export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "image-to-video-api-key-v2",
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

    const image =
      body?.image ??
      body?.imageUrl ??
      body?.image_url ??
      null;

    const prompt =
      typeof body?.prompt === "string"
        ? body.prompt.trim()
        : "";

    const duration =
      body?.duration === "10" ||
      body?.duration === 10
        ? "10"
        : "5";

    /*
     * A Kling aceita:
     * - URL pública da imagem
     * - Base64 puro, sem "data:image/...;base64,"
     */

    if (!image) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Nenhuma imagem foi enviada.",
        },
        { status: 400 }
      );
    }

    if (typeof image !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message:
            "O campo image precisa ser uma string contendo uma URL ou Base64.",
        },
        { status: 400 }
      );
    }

    /*
     * URL.createObjectURL() gera URLs "blob:".
     * Elas existem somente no navegador e não podem
     * ser acessadas pelo servidor/Kling.
     */

    if (image.startsWith("blob:")) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A imagem foi enviada como blob local. A Kling precisa receber uma URL pública ou Base64 da imagem.",
          code: "LOCAL_BLOB_URL",
        },
        { status: 400 }
      );
    }

    /*
     * Se vier como Data URL, removemos o prefixo.
     *
     * Exemplo:
     *
     * data:image/png;base64,AAAA...
     *
     * vira:
     *
     * AAAA...
     */

    let klingImage = image;

    if (
      image.startsWith(
        "data:image/"
      )
    ) {
      const commaIndex =
        image.indexOf(",");

      if (commaIndex === -1) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "Base64 da imagem inválido.",
          },
          { status: 400 }
        );
      }

      klingImage =
        image.substring(
          commaIndex + 1
        );
    }

    /*
     * Verificação básica do Base64.
     *
     * URLs http/https são mantidas normalmente.
     */

    const isHttpUrl =
      klingImage.startsWith(
        "http://"
      ) ||
      klingImage.startsWith(
        "https://"
      );

    if (!isHttpUrl) {
      const base64Regex =
        /^[A-Za-z0-9+/]+={0,2}$/;

      if (
        !base64Regex.test(
          klingImage
        )
      ) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "A imagem precisa ser uma URL pública ou Base64 válido.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Prompt é opcional na API.
     * Porém, se o usuário informou, enviamos.
     */

    const klingBody: Record<
      string,
      unknown
    > = {
      model_name: "kling-v2-6",

      image: klingImage,

      duration,

      mode: "std",

      negative_prompt:
        "baixa qualidade, deformações, mãos deformadas, rosto deformado",
    };

    if (prompt) {
      klingBody.prompt = prompt;
    }

    /*
     * Endpoint FIXO.
     *
     * Não usamos KLING_API_URL da Vercel.
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
     * Tentamos interpretar a resposta
     * como JSON.
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
     * Erro HTTP da Kling.
     */

    if (!klingResponse.ok) {
      const klingMessage =
        klingData?.message ||
        klingData?.error ||
        responseText ||
        "A Kling retornou um erro.";

      /*
       * Saldo insuficiente.
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
        },
        {
          status:
            klingResponse.status,
        }
      );
    }

    /*
     * Código de erro interno da Kling.
     *
     * HTTP pode ser 200 mesmo quando a API
     * informa um código diferente de zero.
     */

    if (
      klingData &&
      typeof klingData.code !==
        "undefined" &&
      Number(klingData.code) !== 0
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
        },
        {
          status:
            klingResponse.status ||
            400,
        }
      );
    }

    /*
     * Task ID retornado pela Kling.
     */

    const taskId =
      klingData?.data?.task_id ??
      klingData?.task_id ??
      null;

    /*
     * Solicitação aceita.
     */

    return NextResponse.json(
      {
        status: "success",

        message:
          "Sua tarefa foi enviada para a Kling com sucesso.",

        taskId,

        klingStatus:
          klingResponse.status,

        klingResponse:
          klingData,

        routeVersion:
          "image-to-video-api-key-v2",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro em /api/kling-image-to-video:",
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
          "image-to-video-api-key-v2",
      },
      {
        status: 500,
      }
    );
  }
}
