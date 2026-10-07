import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestBody = {
  prompt?: string;
  image?: string;
  image2?: string;
  aspect_ratio?: string;
  style?: string;
};

/*
 * =================================================
 * CONFIGURAÇÕES
 * =================================================
 */

const KLING_API_BASE =
  "https://api-singapore.klingai.com";

const KLING_CREATE_ENDPOINT =
  `${KLING_API_BASE}/v1/images/multi-image2image`;

const KLING_MODEL =
  "kling-v2-1";

/*
 * =================================================
 * UTILITÁRIOS
 * =================================================
 */

function removeDataUrlPrefix(
  base64: string
): string {
  return base64.replace(
    /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
    ""
  );
}

function wait(
  milliseconds: number
): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, milliseconds)
  );
}

function buildPrompt(
  prompt: string,
  style?: string
): string {
  const selectedStyle =
    style?.trim() || "Realista";

  return `
Crie uma nova imagem a partir das imagens de referência fornecidas.

INSTRUÇÕES DO USUÁRIO:
${prompt.trim()}

ESTILO:
${selectedStyle}

REGRAS IMPORTANTES:
- Preserve fielmente as características importantes das pessoas, objetos e elementos presentes nas imagens de referência quando forem relevantes para o pedido.
- Preserve identidade visual, aparência, proporções, características faciais, roupas, objetos e detalhes importantes das referências quando solicitado.
- Respeite exatamente a composição solicitada pelo usuário.
- Mantenha aparência visual natural, coerente e realista.
- Não altere características importantes das referências sem que isso seja solicitado.
- Não adicione elementos que não tenham relação com o pedido.
- Produza uma imagem detalhada, consistente e de alta qualidade.
- O resultado deve parecer uma imagem final profissional.
`.trim();
}

/*
 * =================================================
 * POST
 * =================================================
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * =================================================
     * CHAVE DA KLING
     * =================================================
     *
     * Preferencial:
     * KLING_API_KEY
     *
     * Compatibilidade:
     * CHAVE_API_KLING
     */

    const klingApiKey =
      process.env.KLING_API_KEY ||
      process.env.CHAVE_API_KLING;

    if (!klingApiKey) {
      console.error(
        "KLING_API_KEY / CHAVE_API_KLING não configurada."
      );

      return NextResponse.json(
        {
          status: "error",
          message:
            "A chave da API da Kling não está configurada no servidor.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =================================================
     * RECEBER DADOS DO FRONTEND
     * =================================================
     */

    const body =
      (await request.json()) as RequestBody;

    const prompt =
      body.prompt?.trim() || "";

    const image =
      body.image?.trim() || "";

    const image2 =
      body.image2?.trim() || "";

    const aspectRatio =
      body.aspect_ratio || "1:1";

    const style =
      body.style || "Realista";

    /*
     * =================================================
     * VALIDAÇÕES
     * =================================================
     */

    if (!image) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A primeira imagem de referência é obrigatória.",
        },
        {
          status: 400,
        }
      );
    }

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
     * A Kling Image 2.1 aceita estas proporções.
     */

    const allowedAspectRatios = [
      "16:9",
      "9:16",
      "1:1",
      "4:3",
      "3:4",
      "3:2",
      "2:3",
      "21:9",
    ];

    if (
      !allowedAspectRatios.includes(
        aspectRatio
      )
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Proporção de imagem inválida.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * LIMITE DAS IMAGENS
     * =================================================
     *
     * A documentação da Kling limita cada imagem
     * de referência a 10 MB.
     *
     * Como o frontend envia Base64, usamos um limite
     * de segurança de payload.
     */

    const MAX_BASE64_LENGTH =
      10_000_000;

    if (
      image.length >
      MAX_BASE64_LENGTH
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A primeira imagem ficou muito grande. Escolha uma imagem menor.",
        },
        {
          status: 413,
        }
      );
    }

    if (
      image2 &&
      image2.length >
        MAX_BASE64_LENGTH
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A segunda imagem ficou muito grande. Escolha uma imagem menor.",
        },
        {
          status: 413,
        }
      );
    }

    /*
     * =================================================
     * PREPARAR IMAGEM 1
     * =================================================
     */

    const image1Base64 =
      removeDataUrlPrefix(
        image
      );

    if (!image1Base64) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A primeira imagem não pôde ser processada.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =================================================
     * LISTA DE IMAGENS DE REFERÊNCIA
     * =================================================
     *
     * A Kling espera:
     *
     * subject_image_list: [
     *   {
     *     subject_image: "BASE64"
     *   }
     * ]
     *
     * Pode receber até 4 imagens.
     */

    const subjectImageList: {
      subject_image: string;
    }[] = [
      {
        subject_image:
          image1Base64,
      },
    ];

    /*
     * =================================================
     * IMAGEM 2 — OPCIONAL
     * =================================================
     */

    if (image2) {
      const image2Base64 =
        removeDataUrlPrefix(
          image2
        );

      if (!image2Base64) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "A segunda imagem não pôde ser processada.",
          },
          {
            status: 400,
          }
        );
      }

      subjectImageList.push({
        subject_image:
          image2Base64,
      });
    }

    /*
     * =================================================
     * PROMPT FINAL
     * =================================================
     */

    const finalPrompt =
      buildPrompt(
        prompt,
        style
      );

    /*
     * =================================================
     * LOGS
     * =================================================
     */

    console.log(
      "========================================"
    );

    console.log(
      "CIEL IA STUDIO - KLING IMAGE"
    );

    console.log(
      "Endpoint:",
      KLING_CREATE_ENDPOINT
    );

    console.log(
      "Modelo:",
      KLING_MODEL
    );

    console.log(
      "Quantidade de referências:",
      subjectImageList.length
    );

    console.log(
      "Proporção:",
      aspectRatio
    );

    console.log(
      "Estilo:",
      style
    );

    /*
     * =================================================
     * CRIAR TAREFA NA KLING
     * =================================================
     */

    const createResponse =
      await fetch(
        KLING_CREATE_ENDPOINT,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${klingApiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model_name:
              KLING_MODEL,

            prompt:
              finalPrompt,

            negative_prompt:
              "",

            subject_image_list:
              subjectImageList,

            n: 1,

            aspect_ratio:
              aspectRatio,

            watermark_info: {
              enabled: false,
            },
          }),
        }
      );

    /*
     * =================================================
     * LER RESPOSTA
     * =================================================
     */

    const createData =
      await createResponse.json();

    console.log(
      "Kling create response:",
      createData
    );

    /*
     * =================================================
     * ERRO AO CRIAR TAREFA
     * =================================================
     */

    if (
      !createResponse.ok ||
      createData?.code !== 0
    ) {
      console.error(
        "Kling não criou a tarefa:",
        createData
      );

      return NextResponse.json(
        {
          status: "error",

          message:
            createData?.message ||
            "A Kling não conseguiu criar a tarefa de geração da imagem.",

          kling:
            createData,
        },
        {
          status:
            createResponse.status >= 400
              ? createResponse.status
              : 502,
        }
      );
    }

    /*
     * =================================================
     * TASK ID
     * =================================================
     */

    const taskId =
      createData?.data?.task_id;

    if (!taskId) {
      console.error(
        "Kling não retornou task_id:",
        createData
      );

      return NextResponse.json(
        {
          status: "error",
          message:
            "A Kling não retornou o ID da tarefa.",
        },
        {
          status: 502,
        }
      );
    }

    console.log(
      "Kling task_id:",
      taskId
    );

    /*
     * =================================================
     * CONSULTAR TAREFA
     * =================================================
     *
     * A geração é assíncrona.
     *
     * submitted
     * processing
     * succeed
     * failed
     */

    const maxAttempts =
      45;

    for (
      let attempt = 0;
      attempt < maxAttempts;
      attempt++
    ) {
      /*
       * Aguarda 2 segundos
       * antes de consultar novamente.
       */

      await wait(2000);

      const statusEndpoint =
        `${KLING_CREATE_ENDPOINT}/${taskId}`;

      const statusResponse =
        await fetch(
          statusEndpoint,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${klingApiKey}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const statusData =
        await statusResponse.json();

      const taskStatus =
        statusData?.data?.task_status;

      console.log(
        "Kling status:",
        taskStatus,
        "| tentativa:",
        attempt + 1
      );

      /*
       * =================================================
       * ERRO AO CONSULTAR
       * =================================================
       */

      if (
        !statusResponse.ok
      ) {
        console.error(
          "Erro consultando Kling:",
          statusData
        );

        return NextResponse.json(
          {
            status: "error",

            message:
              statusData?.message ||
              "Erro ao consultar a tarefa da Kling.",

            kling:
              statusData,

            taskId,
          },
          {
            status:
              statusResponse.status >= 400
                ? statusResponse.status
                : 502,
          }
        );
      }

      /*
       * =================================================
       * SUCESSO
       * =================================================
       */

      if (
        taskStatus ===
        "succeed"
      ) {
        const generatedImageUrl =
          statusData?.data
            ?.task_result
            ?.images?.[0]
            ?.url;

        if (!generatedImageUrl) {
          console.error(
            "Kling concluiu sem URL:",
            statusData
          );

          return NextResponse.json(
            {
              status: "error",

              message:
                "A Kling concluiu a geração, mas não retornou a URL da imagem.",

              taskId,
            },
            {
              status: 502,
            }
          );
        }

        console.log(
          "Imagem gerada:",
          generatedImageUrl
        );

        /*
         * =================================================
         * BAIXAR IMAGEM DA KLING
         * =================================================
         *
         * Fazemos isso para manter compatibilidade
         * com o frontend atual, que espera imageBase64.
         */

        const imageResponse =
          await fetch(
            generatedImageUrl
          );

        if (
          !imageResponse.ok
        ) {
          console.error(
            "Não foi possível baixar imagem:",
            imageResponse.status
          );

          return NextResponse.json(
            {
              status: "error",

              message:
                "A Kling gerou a imagem, mas o servidor não conseguiu baixá-la.",

              taskId,
            },
            {
              status: 502,
            }
          );
        }

        /*
         * =================================================
         * CONVERTER PARA BASE64
         * =================================================
         */

        const imageBuffer =
          await imageResponse.arrayBuffer();

        const imageBase64 =
          Buffer.from(
            imageBuffer
          ).toString(
            "base64"
          );

        /*
         * =================================================
         * IDENTIFICAR TIPO DA IMAGEM
         * =================================================
         */

        const contentType =
          imageResponse.headers.get(
            "content-type"
          ) ||
          "image/png";

        /*
         * =================================================
         * RESPOSTA FINAL
         * =================================================
         */

        console.log(
          "========================================"
        );

        console.log(
          "CIEL IA STUDIO - Kling concluído"
        );

        console.log(
          "Task:",
          taskId
        );

        console.log(
          "Status:",
          "succeed"
        );

        console.log(
          "========================================"
        );

        return NextResponse.json({
          status: "success",

          imageBase64,

          imageUrl:
            `data:${contentType};base64,${imageBase64}`,

          /*
           * Mantemos o URL original também.
           * O frontend pode usar posteriormente.
           */

          klingImageUrl:
            generatedImageUrl,

          model:
            KLING_MODEL,

          aspectRatio,

          style,

          taskId,
        });
      }

      /*
       * =================================================
       * FALHA
       * =================================================
       */

      if (
        taskStatus ===
        "failed"
      ) {
        const failureMessage =
          statusData?.data
            ?.task_status_msg ||
          statusData?.message ||
          "A Kling falhou ao gerar a imagem.";

        console.error(
          "Kling falhou:",
          failureMessage
        );

        return NextResponse.json(
          {
            status: "error",

            message:
              failureMessage,

            taskId,
          },
          {
            status: 502,
          }
        );
      }

      /*
       * Se estiver:
       *
       * submitted
       * processing
       *
       * continua o loop.
       */
    }

    /*
     * =================================================
     * TIMEOUT
     * =================================================
     */

    console.error(
      "Timeout aguardando Kling:",
      taskId
    );

    return NextResponse.json(
      {
        status: "error",

        message:
          "A Kling demorou mais que o esperado para concluir a imagem. Tente novamente.",

        taskId,
      },
      {
        status: 504,
      }
    );

  } catch (error: any) {
    /*
     * =================================================
     * ERRO GERAL
     * =================================================
     */

    console.error(
      "========================================"
    );

    console.error(
      "CIEL IA STUDIO - Erro Kling Image"
    );

    console.error(
      error
    );

    console.error(
      "========================================"
    );

    const statusCode =
      error?.status ||
      error?.statusCode ||
      500;

    const apiMessage =
      error?.message ||
      "";

    return NextResponse.json(
      {
        status: "error",

        message:
          apiMessage ||
          "Não foi possível gerar a imagem pela Kling.",
      },
      {
        status:
          typeof statusCode ===
            "number" &&
          statusCode >= 400 &&
          statusCode < 600
            ? statusCode
            : 500,
      }
    );
  }
}
