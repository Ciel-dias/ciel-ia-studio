import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const KLING_API_URL =
  "https://api-singapore.klingai.com";

const KLING_ENDPOINT =
  `${KLING_API_URL}/v1/videos/image2video`;

function getApiKey() {
  return (
    process.env.KLING_API_KEY ||
    process.env.CHAVE_API_KLING ||
    ""
  );
}

/**
 * GET
 *
 * Sem taskId:
 * verifica se a API está configurada.
 *
 * Com ?taskId=:
 * consulta o status de uma geração.
 */
export async function GET(
  request: NextRequest
) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "A chave da Kling não está configurada na Vercel.",
        klingConfigured: false,
      },
      { status: 500 }
    );
  }

  const taskId =
    request.nextUrl.searchParams.get(
      "taskId"
    );

  /*
   * Apenas teste da configuração.
   */
  if (!taskId) {
    return NextResponse.json({
      status: "ok",
      routeVersion:
        "kling-image-to-video-v3",
      runtime: "nodejs",
      klingConfigured: true,
      endpoint: KLING_ENDPOINT,
    });
  }

  /*
   * Consulta o andamento da tarefa.
   */
  try {
    const response =
      await fetch(
        `${KLING_ENDPOINT}/${encodeURIComponent(
          taskId
        )}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${apiKey}`,
          },
          cache: "no-store",
        }
      );

    const responseText =
      await response.text();

    let klingData: any = null;

    try {
      klingData = responseText
        ? JSON.parse(responseText)
        : null;
    } catch {
      klingData = null;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message:
            klingData?.message ||
            responseText ||
            "Erro ao consultar a tarefa na Kling.",
          klingStatus:
            response.status,
          klingResponse:
            klingData,
        },
        {
          status: response.status,
        }
      );
    }

    /*
     * Código interno da Kling.
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
            "A Kling retornou um erro.",
          klingResponse:
            klingData,
        },
        {
          status: 400,
        }
      );
    }

    const data =
      klingData?.data ?? {};

    const taskStatus =
      data?.task_status ??
      null;

    /*
     * Se terminou com sucesso,
     * pegamos a URL do vídeo.
     */
    if (
      taskStatus === "succeed"
    ) {
      const video =
        data?.task_result
          ?.videos?.[0] ??
        null;

      const videoUrl =
        typeof video === "string"
          ? video
          : video?.url ??
            video?.video_url ??
            null;

      return NextResponse.json({
        status: "success",
        taskStatus,
        taskId,
        videoUrl,
        video: video ?? null,
        klingResponse:
          klingData,
        routeVersion:
          "kling-image-to-video-v3",
      });
    }

    /*
     * Se a Kling informou falha.
     */
    if (
      taskStatus === "failed"
    ) {
      return NextResponse.json({
        status: "error",
        taskStatus,
        taskId,
        message:
          data?.task_status_msg ||
          "A Kling não conseguiu gerar o vídeo.",
        klingResponse:
          klingData,
        routeVersion:
          "kling-image-to-video-v3",
      });
    }

    /*
     * submitted ou processing.
     */
    return NextResponse.json({
      status: "processing",
      taskStatus,
      taskId,
      message:
        taskStatus ===
        "submitted"
          ? "A Kling recebeu a tarefa."
          : "A Kling está gerando o vídeo.",
      klingResponse:
        klingData,
      routeVersion:
        "kling-image-to-video-v3",
    });
  } catch (error) {
    console.error(
      "Erro ao consultar vídeo Kling:",
      error
    );

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro interno ao consultar a Kling.",
      },
      { status: 500 }
    );
  }
}


/**
 * POST
 *
 * Cria uma tarefa de Image-to-Video.
 */
export async function POST(
  request: NextRequest
) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "A chave da Kling não está configurada na Vercel.",
      },
      { status: 500 }
    );
  }

  try {
    const body =
      await request.json();

    /*
     * Aceita:
     * image
     * imageUrl
     * image_url
     */
    const image =
      body?.image ??
      body?.imageUrl ??
      body?.image_url ??
      null;

    /*
     * Prompt de movimento.
     */
    const prompt =
      typeof body?.prompt ===
      "string"
        ? body.prompt.trim()
        : "";

    /*
     * 5 ou 10 segundos.
     */
    const duration =
      body?.duration === "10" ||
      body?.duration === 10
        ? "10"
        : "5";

    /*
     * std ou pro.
     *
     * Default: pro
     * para priorizar qualidade.
     */
    const mode =
      body?.mode === "std"
        ? "std"
        : "pro";

    /*
     * Som:
     * off por padrão.
     */
    const sound =
      body?.sound === "on"
        ? "on"
        : "off";

    /*
     * Imagem final opcional.
     *
     * Se futuramente quiseremos fazer
     * primeiro frame + último frame,
     * podemos enviar image_tail.
     */
    const imageTail =
      body?.imageTail ??
      body?.image_tail ??
      null;

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

    if (
      typeof image !== "string"
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "O campo image precisa ser uma URL ou Base64.",
        },
        { status: 400 }
      );
    }

    /*
     * Blob URLs não funcionam no servidor.
     */
    if (
      image.startsWith("blob:")
    ) {
      return NextResponse.json(
        {
          status: "error",
          code: "LOCAL_BLOB_URL",
          message:
            "A imagem está em uma URL blob local. Envie a imagem como Base64 ou uma URL pública.",
        },
        { status: 400 }
      );
    }

    /*
     * Remove o prefixo:
     *
     * data:image/png;base64,...
     *
     * A Kling precisa somente do Base64.
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
     * Detecta se é URL.
     */
    const isHttpUrl =
      klingImage.startsWith(
        "http://"
      ) ||
      klingImage.startsWith(
        "https://"
      );

    /*
     * Se não for URL, validamos Base64.
     */
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

      /*
       * Aproximadamente 10 MB.
       *
       * A documentação da Kling
       * estabelece limite de 10 MB para
       * o formato legacy usado aqui.
       */
      if (
        klingImage.length >
        14_000_000
      ) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "A imagem é muito grande para a Kling.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Corpo enviado para a Kling.
     */
    const klingBody: Record<
      string,
      unknown
    > = {
      model_name:
        "kling-v2-6",

      image:
        klingImage,

      duration,

      mode,

      sound,

      negative_prompt:
        "baixa qualidade, baixa resolução, deformações, rosto deformado, mãos deformadas, dedos deformados, membros extras, corpo deformado, aparência artificial, flickering, frame inconsistente",
    };

    /*
     * Prompt é opcional.
     */
    if (prompt) {
      klingBody.prompt =
        prompt;
    }

    /*
     * Segundo frame opcional.
     */
    if (
      typeof imageTail ===
        "string" &&
      imageTail.trim()
    ) {
      let klingImageTail =
        imageTail.trim();

      if (
        klingImageTail.startsWith(
          "data:image/"
        )
      ) {
        const commaIndex =
          klingImageTail.indexOf(
            ","
          );

        if (
          commaIndex === -1
        ) {
          return NextResponse.json(
            {
              status: "error",
              message:
                "Base64 do segundo frame inválido.",
            },
            { status: 400 }
          );
        }

        klingImageTail =
          klingImageTail.substring(
            commaIndex + 1
          );
      }

      if (
        klingImageTail.startsWith(
          "blob:"
        )
      ) {
        return NextResponse.json(
          {
            status: "error",
            code:
              "LOCAL_BLOB_URL_TAIL",
            message:
              "O segundo frame está em uma URL blob local.",
          },
          { status: 400 }
        );
      }

      klingBody.image_tail =
        klingImageTail;
    }

    console.log(
      "Enviando tarefa Image-to-Video para Kling:",
      {
        model:
          klingBody.model_name,
        duration,
        mode,
        sound,
        hasPrompt:
          Boolean(prompt),
        hasImageTail:
          Boolean(imageTail),
      }
    );

    /*
     * Criação da tarefa.
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
     * Erro HTTP.
     */
    if (!klingResponse.ok) {
      const klingMessage =
        klingData?.message ||
        klingData?.error ||
        responseText ||
        "A Kling retornou um erro.";

      const messageLower =
        String(
          klingMessage
        ).toLowerCase();

      /*
       * Saldo.
       */
      if (
        messageLower.includes(
          "account balance not enough"
        ) ||
        messageLower.includes(
          "balance"
        ) &&
          messageLower.includes(
            "not enough"
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
     * Erro interno da Kling.
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
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Task ID.
     */
    const taskId =
      klingData?.data
        ?.task_id ??
      klingData?.task_id ??
      null;

    if (!taskId) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A Kling aceitou a requisição, mas não retornou o task_id.",
          klingResponse:
            klingData,
        },
        { status: 502 }
      );
    }

    /*
     * Tarefa criada.
     */
    return NextResponse.json(
      {
        status: "success",

        message:
          "Sua tarefa de vídeo foi enviada para a Kling com sucesso.",

        taskId,

        taskStatus:
          klingData?.data
            ?.task_status ??
          "submitted",

        model:
          "kling-v2-6",

        duration,

        mode,

        sound,

        klingStatus:
          klingResponse.status,

        routeVersion:
          "kling-image-to-video-v3",
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
          "kling-image-to-video-v3",
      },
      {
        status: 500,
      }
    );
  }
}
