import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

function getImageSize(aspectRatio: string): string {
  switch (aspectRatio) {
    case "9:16":
      return "1024x1536";

    case "16:9":
      return "1536x1024";

    case "1:1":
    default:
      return "1024x1024";
  }
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

export async function POST(
  request: Request
) {
  try {
    /*
     * =================================================
     * VERIFICAÇÃO DA API
     * =================================================
     */

    if (!process.env.OPENAI_API_KEY) {
      console.error(
        "OPENAI_API_KEY não configurada."
      );

      return NextResponse.json(
        {
          status: "error",
          message:
            "A chave da API da OpenAI não está configurada no servidor.",
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

    if (
      ![
        "1:1",
        "9:16",
        "16:9",
      ].includes(aspectRatio)
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
     * LIMITE DE SEGURANÇA DO PAYLOAD
     * =================================================
     *
     * A página já reduz as imagens antes de enviar.
     * Esta proteção evita receber payloads absurdamente
     * grandes diretamente na API.
     */

    const MAX_BASE64_LENGTH =
      3_000_000;

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
     */

    const image1Base64 =
      removeDataUrlPrefix(image);

    const image1Buffer =
      Buffer.from(
        image1Base64,
        "base64"
      );

    if (!image1Buffer.length) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A primeira imagem não pôde ser processada.",
        },
        { status: 400 }
      );
    }

    const imageFiles: File[] = [];

    const imageFile1 =
      await toFile(
        image1Buffer,
        "reference-1.jpg",
        {
          type: "image/jpeg",
        }
      );

    imageFiles.push(
      imageFile1
    );

    /*
     * =================================================
     * SEGUNDA IMAGEM — OPCIONAL
     * =================================================
     */

    if (image2) {
      const image2Base64 =
        removeDataUrlPrefix(
          image2
        );

      const image2Buffer =
        Buffer.from(
          image2Base64,
          "base64"
        );

      if (!image2Buffer.length) {
        return NextResponse.json(
          {
            status: "error",
            message:
              "A segunda imagem não pôde ser processada.",
          },
          { status: 400 }
        );
      }

      const imageFile2 =
        await toFile(
          image2Buffer,
          "reference-2.jpg",
          {
            type: "image/jpeg",
          }
        );

      imageFiles.push(
        imageFile2
      );
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

    const size =
      getImageSize(
        aspectRatio
      );

    console.log(
      "CIEL IA STUDIO - OpenAI Image-to-Image"
    );

    console.log(
      "Modelo:",
      "gpt-image-1"
    );

    console.log(
      "Imagens:",
      imageFiles.length
    );

    console.log(
      "Proporção:",
      aspectRatio
    );

    console.log(
      "Tamanho:",
      size
    );

    console.log(
      "Estilo:",
      style
    );

    /*
     * =================================================
     * OPENAI IMAGE EDIT
     * =================================================
     */

    const result =
      await openai.images.edit({
        model: "gpt-image-1",

        image:
          imageFiles,

        prompt:
          finalPrompt,

        size:
          size as
            | "1024x1024"
            | "1024x1536"
            | "1536x1024",

        quality: "high",

        n: 1,

        input_fidelity:
          "high",
      });

    /*
     * =================================================
     * PEGAR RESULTADO
     * =================================================
     */

    const imageBase64 =
      result.data?.[0]?.b64_json;

    if (!imageBase64) {
      console.error(
        "OpenAI não retornou b64_json:",
        result
      );

      return NextResponse.json(
        {
          status: "error",
          message:
            "A OpenAI não retornou uma imagem válida.",
        },
        { status: 502 }
      );
    }

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
        "gpt-image-1",

      aspectRatio,

      size,

      style,
    });
  } catch (error: any) {
    console.error(
      "CIEL IA STUDIO - Erro OpenAI Image-to-Image:",
      error
    );

    /*
     * =================================================
     * TRATAMENTO DE ERROS DA OPENAI
     * =================================================
     */

    const statusCode =
      error?.status ||
      error?.statusCode ||
      500;

    const apiMessage =
      error?.error?.message ||
      error?.message ||
      "";

    /*
     * Erro de autenticação
     */

    if (
      statusCode === 401
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "A chave da API da OpenAI é inválida ou não está autorizada.",
        },
        { status: 401 }
      );
    }

    /*
     * Sem créditos / limite da OpenAI
     */

    if (
      statusCode === 429
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            apiMessage ||
            "A conta da OpenAI atingiu o limite disponível para esta solicitação.",
        },
        { status: 429 }
      );
    }

    /*
     * Erro de conteúdo ou imagem
     */

    if (
      statusCode === 400
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            apiMessage ||
            "A OpenAI não conseguiu processar as imagens ou o pedido enviado.",
        },
        { status: 400 }
      );
    }

    /*
     * Erro geral
     */

    return NextResponse.json(
      {
        status: "error",
        message:
          apiMessage ||
          "Não foi possível gerar a imagem pela OpenAI.",
      },
      {
        status:
          typeof statusCode === "number" &&
          statusCode >= 400 &&
          statusCode < 600
            ? statusCode
            : 500,
      }
    );
  }
}
