import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestBody = {
  prompt?: string;
  image?: string;
  image2?: string;
  aspect_ratio?: string;
  style?: string;
};

function removeDataUrlPrefix(base64: string): string {
  return base64.replace(
    /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
    ""
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
- Respeite a composição solicitada pelo usuário.
- Mantenha aparência visual coerente e natural.
- Preserve identidade visual, proporções, detalhes e características relevantes das referências.
- Não adicione elementos que não tenham relação com o pedido.
- Produza uma imagem visualmente consistente, detalhada e de alta qualidade.
- O resultado deve parecer uma imagem final profissional.
`.trim();
}

function wait(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

export async function POST(
  request: Request
) {
  try {
    /*
     * =================================================
     * VERIFICAÇÃO DA KLING API
     * =================================================
     */

    const klingApiKey =
      process.env.KLING_API_KEY;

    if (!klingApiKey) {
      console.error(
        "KLING_API_KEY não configurada."
      );

      return NextResponse.json(
        {
          status: "error",
          message:
            "A chave da API da Kling não está configurada no servidor.",
        },
        { status: 500 }
      );
    }

    /*
     * =================================================
     * RECEBER DADOS
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
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Descreva o que deseja criar na imagem.",
        },
        { status: 400 }
      );
    }

    const allowedAspectRatios = [
      "1:1",
      "9:16",
      "16:9",
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
        { status: 400 }
      );
    }

    /*
     * =================================================
     * LIMITE DE SEGURANÇA
     * =================================================
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
        { status: 413 }
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
        { status: 413 }
      );
    }

    /*
     * =================================================
     * PREPARAR IMAGENS
     * =================================================
     *
     * A Kling aceita Base64 sem o prefixo
     * data:image/...;base64,
     */

    const image1Base64 =
      removeDataUrlPrefix(image);

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
     * SEGUNDA IMAGEM
     * =================================================
     */

    if (image2) {
      const image2Base64 =
        removeDataUrlPrefix(
          image2
        );

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

    console.log(
      "========================================"
    );

    console.log(
      "CIEL IA STUDIO - Kling Image"
    );

    console.log(
      "Modelo:",
      "kling-v2-1"
    );

    console.log(
      "Imagens:",
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
        "https://api-singapore.klingai.com/v1/images/multi-image2image",
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
              "kling-v2-1",

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

    const createData =
      await createResponse.json();

    console.log(
      "Kling create response:",
      createData
    );

    if (
      !createResponse.ok ||
      createData?.code !== 0
    ) {
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

    const taskId =
      createData?.data?.task_id;

    if (!taskId) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A Kling não retornou o ID da tarefa.",
        },
        { status: 502 }
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
     * A Kling processa a imagem de forma assíncrona.
     */

    const maxAttempts = 60;

    for (
      let attempt = 0;
      attempt < maxAttempts;
      attempt++
    ) {
      await wait(2000);

      const statusResponse =
        await fetch(
          `https://api-singapore.klingai.com/v1/images/multi-image2image/${taskId}`,
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

      console.log(
        "Kling status:",
        statusData?.data?.task_status,
        "tentativa:",
        attempt + 1
      );

      if (
        !statusResponse.ok
      ) {
        return NextResponse.json(
          {
            status: "error",
            message:
              statusData?.message ||
              "Erro ao consultar a tarefa da Kling.",
            kling:
              statusData,
          },
          {
            status:
              statusResponse.status >= 400
                ? statusResponse.status
                : 502,
          }
        );
      }

      const taskStatus =
        statusData?.data?.task_status;

      /*
       * =================================================
       * SUCESSO
       * =================================================
       */

      if (
        taskStatus ===
        "succeed"
      ) {
        const imageUrl =
          statusData?.data
            ?.task_result
            ?.images?.[0]
            ?.url;

        if (!imageUrl) {
          return NextResponse.json(
            {
              status: "error",
              message:
                "A Kling concluiu a geração, mas não retornou a URL da imagem.",
            },
            { status: 502 }
          );
        }

        /*
         * Baixar a imagem da Kling
         * e devolver como Base64 para manter
         * compatibilidade com o frontend atual.
         */

        const imageResponse =
          await fetch(
            imageUrl
          );

        if (
          !imageResponse.ok
        ) {
          return NextResponse.json(
            {
              status: "error",
              message:
                "A imagem foi gerada pela Kling, mas não pôde ser baixada.",
            },
            { status: 502 }
          );
        }

        const imageBuffer =
          await imageResponse.arrayBuffer();

        const imageBase64 =
          Buffer.from(
            imageBuffer
          ).toString(
            "base64"
          );

        console.log(
          "Kling Image concluído com sucesso."
        );

        /*
         * =================================================
         * RESPOSTA PARA O FRONTEND
         * =================================================
         */

        return NextResponse.json({
          status: "success",

          imageBase64,

          imageUrl:
            `data:image/png;base64,${imageBase64}`,

          model:
            "kling-v2-1",

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
        return NextResponse.json(
          {
            status: "error",

            message:
              statusData?.data
                ?.task_status_msg ||
              statusData?.message ||
              "A Kling falhou ao gerar a imagem.",

            taskId,
          },
          { status: 502 }
        );
      }
    }

    /*
     * =================================================
     * TIMEOUT
     * =================================================
     */

    return NextResponse.json(
      {
        status: "error",

        message:
          "A Kling demorou mais que o esperado para concluir a imagem. Tente novamente.",

        taskId,
      },
      { status: 504 }
    );

  } catch (error: any) {
    console.error(
      "CIEL IA STUDIO - Erro Kling Image:",
      error
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
