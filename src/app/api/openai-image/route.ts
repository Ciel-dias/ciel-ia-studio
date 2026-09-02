import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

// =========================================================
// CIEL IA STUDIO
// TEXTO → IMAGEM
// =========================================================

const IMAGE_COST = 3;

export async function POST(request: Request) {
  const supabase = await createClient();

  let diamondsConsumed = false;

  try {
    // =======================================================
    // 1. VERIFICAR USUÁRIO
    // =======================================================

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Você precisa estar conectado para gerar uma imagem.",
        },
        { status: 401 }
      );
    }

    // =======================================================
    // 2. VERIFICAR OPENAI
    // =======================================================

    if (!openai) {
      return NextResponse.json(
        {
          success: false,
          error:
            "OPENAI_API_KEY não está configurada nas variáveis de ambiente da Vercel.",
        },
        { status: 500 }
      );
    }

    // =======================================================
    // 3. RECEBER DADOS
    // =======================================================

    const body = await request.json();

    const prompt = body?.prompt;
    const aspectRatio = body?.aspect_ratio || "1:1";

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "O prompt é obrigatório.",
        },
        { status: 400 }
      );
    }

    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      return NextResponse.json(
        {
          success: false,
          error: "O prompt não pode estar vazio.",
        },
        { status: 400 }
      );
    }

    // =======================================================
    // 4. DEFINIR PROPORÇÃO
    // =======================================================

    let size:
      | "1024x1024"
      | "1536x1024"
      | "1024x1536";

    switch (aspectRatio) {
      case "16:9":
        size = "1536x1024";
        break;

      case "9:16":
        size = "1024x1536";
        break;

      case "1:1":
      default:
        size = "1024x1024";
        break;
    }

    // =======================================================
    // 5. CONSUMIR 3 DIAMANTES
    // =======================================================

    const {
      data: diamondResult,
      error: consumeError,
    } = await supabase.rpc("use_diamonds", {
      amount: IMAGE_COST,
    });

    if (consumeError) {
      console.error(
        "Erro ao consumir Diamantes:",
        consumeError
      );

      const errorMessage =
        consumeError.message?.toLowerCase() || "";

      if (
        errorMessage.includes("saldo insuficiente")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Você não possui Diamantes suficientes para gerar esta imagem.",
            code: "INSUFFICIENT_DIAMONDS",
          },
          { status: 402 }
        );
      }

      if (
        errorMessage.includes("não autenticado")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Usuário não autenticado.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível verificar seus Diamantes.",
        },
        { status: 500 }
      );
    }

    diamondsConsumed = true;

    const remainingDiamonds =
      diamondResult?.balance ?? null;

    // =======================================================
    // 6. GERAR IMAGEM — GPT IMAGE 1
    // QUALIDADE HIGH AUTOMÁTICA
    // =======================================================

    try {
      const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt: cleanPrompt,
        size,
        quality: "high",
        n: 1,
      });

      // =====================================================
      // 7. VERIFICAR RESULTADO
      // =====================================================

      const imageData = result.data?.[0];

      if (!imageData) {
        throw new Error(
          "A OpenAI não retornou nenhuma imagem."
        );
      }

      const base64Image = imageData.b64_json;

      if (!base64Image) {
        throw new Error(
          "A OpenAI não retornou os dados da imagem."
        );
      }

      // =====================================================
      // 8. SUCESSO
      // =====================================================

      return NextResponse.json({
        success: true,

        image:
          `data:image/png;base64,${base64Image}`,

        prompt: cleanPrompt,

        model: "gpt-image-1",

        quality: "high",

        size,

        aspectRatio,

        diamondsUsed: IMAGE_COST,

        remainingDiamonds,
      });
    } catch (openaiError: unknown) {
      console.error(
        "Erro na geração da imagem pela OpenAI:",
        openaiError
      );

      // =====================================================
      // 9. ESTORNAR OS 3 DIAMANTES
      // =====================================================

      let refunded = false;
      let refundResult: any = null;

      if (diamondsConsumed) {
        const {
          data,
          error: refundError,
        } = await supabase.rpc(
          "refund_diamonds",
          {
            amount: IMAGE_COST,
          }
        );

        refundResult = data;

        if (refundError) {
          console.error(
            "ERRO CRÍTICO: não foi possível estornar os Diamantes:",
            refundError
          );
        } else {
          refunded = true;
        }
      }

      // =====================================================
      // 10. MENSAGEM DE ERRO
      // =====================================================

      let errorMessage =
        "Não foi possível gerar a imagem com a OpenAI.";

      if (openaiError instanceof Error) {
        errorMessage =
          openaiError.message;
      }

      return NextResponse.json(
        {
          success: false,

          error: errorMessage,

          refunded,

          refundedDiamonds:
            refunded
              ? IMAGE_COST
              : 0,

          remainingDiamonds:
            refundResult?.balance ?? null,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error(
      "Erro interno na API de imagem:",
      error
    );

    // =======================================================
    // 11. ESTORNO DE SEGURANÇA
    // =======================================================

    if (diamondsConsumed) {
      const {
        data: refundResult,
        error: refundError,
      } = await supabase.rpc(
        "refund_diamonds",
        {
          amount: IMAGE_COST,
        }
      );

      if (refundError) {
        console.error(
          "ERRO CRÍTICO: falha no estorno de segurança:",
          refundError
        );
      }

      return NextResponse.json(
        {
          success: false,

          error:
            error instanceof Error
              ? error.message
              : "Não foi possível processar a geração da imagem.",

          refunded:
            !refundError,

          refundedDiamonds:
            !refundError
              ? IMAGE_COST
              : 0,

          remainingDiamonds:
            refundResult?.balance ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Não foi possível processar a geração da imagem.",
      },
      { status: 500 }
    );
  }
}
