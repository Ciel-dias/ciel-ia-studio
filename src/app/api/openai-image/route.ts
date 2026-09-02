import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

// Custo da geração de imagem no CIEL IA STUDIO
const IMAGE_COST = 3;

export async function POST(request: Request) {
  const supabase = await createClient();

  let diamondsConsumed = false;

  try {
    // =========================================================
    // 1. VERIFICAR USUÁRIO
    // =========================================================

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

    // =========================================================
    // 2. VERIFICAR API KEY
    // =========================================================

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

    // =========================================================
    // 3. LER DADOS
    // =========================================================

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

    // =========================================================
    // 4. DEFINIR TAMANHO DA IMAGEM
    // =========================================================

    let size:
      | "1024x1024"
      | "1536x1024"
      | "1024x1536" = "1024x1024";

    if (aspectRatio === "16:9") {
      size = "1536x1024";
    }

    if (aspectRatio === "9:16") {
      size = "1024x1536";
    }

    // =========================================================
    // 5. COBRAR 3 DIAMANTES
    // =========================================================

    for (let i = 0; i < IMAGE_COST; i++) {
      const {
        data: diamondResult,
        error: consumeError,
      } = await supabase.rpc("use_one_diamond");

      if (consumeError) {
        console.error(
          "Erro ao consumir Diamante:",
          consumeError
        );

        // Se já consumimos alguns Diamantes antes do erro,
        // devolvemos todos eles.
        if (diamondsConsumed) {
          for (let refundIndex = 0; refundIndex <= i - 1; refundIndex++) {
            const { error: refundError } =
              await supabase.rpc("refund_one_diamond");

            if (refundError) {
              console.error(
                "Erro ao estornar Diamante:",
                refundError
              );
            }
          }
        }

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

      console.log(
        `Diamante ${i + 1}/${IMAGE_COST} consumido.`,
        diamondResult
      );
    }

    // =========================================================
    // 6. GERAR IMAGEM COM OPENAI
    // =========================================================

    try {
      const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt: cleanPrompt,
        size,
        quality: "high",
        n: 1,
      });

      // =======================================================
      // 7. VERIFICAR RESPOSTA
      // =======================================================

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

      // =======================================================
      // 8. RETORNAR IMAGEM
      // =======================================================

      return NextResponse.json({
        success: true,
        image: `data:image/png;base64,${base64Image}`,
        prompt: cleanPrompt,
        model: "gpt-image-1",
        quality: "high",
        size,
        aspectRatio,
        diamondsUsed: IMAGE_COST,
      });
    } catch (openaiError: unknown) {
      console.error(
        "Erro na geração da imagem pela OpenAI:",
        openaiError
      );

      // =======================================================
      // 9. ESTORNAR OS 3 DIAMANTES
      // =======================================================

      let refundedCount = 0;

      for (let i = 0; i < IMAGE_COST; i++) {
        const {
          error: refundError,
        } = await supabase.rpc(
          "refund_one_diamond"
        );

        if (refundError) {
          console.error(
            "ERRO CRÍTICO: não foi possível estornar Diamante:",
            refundError
          );
        } else {
          refundedCount++;
        }
      }

      let errorMessage =
        "Não foi possível gerar a imagem com a OpenAI.";

      if (openaiError instanceof Error) {
        errorMessage = openaiError.message;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          refunded:
            refundedCount === IMAGE_COST,
          refundedDiamonds: refundedCount,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error(
      "Erro interno na API de imagem:",
      error
    );

    // =========================================================
    // 10. ESTORNO DE SEGURANÇA
    // =========================================================

    if (diamondsConsumed) {
      let refundedCount = 0;

      for (let i = 0; i < IMAGE_COST; i++) {
        const {
          error: refundError,
        } = await supabase.rpc(
          "refund_one_diamond"
        );

        if (refundError) {
          console.error(
            "Erro ao estornar Diamante:",
            refundError
          );
        } else {
          refundedCount++;
        }
      }

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Não foi possível processar a geração da imagem.",
          refunded:
            refundedCount === IMAGE_COST,
          refundedDiamonds: refundedCount,
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
