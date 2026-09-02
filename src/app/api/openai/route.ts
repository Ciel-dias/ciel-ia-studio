import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

const PROMPT_COST = 1;

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    /*
     * 1. Verifica usuário autenticado
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Você precisa estar conectado para usar o Criar Prompts.",
        },
        { status: 401 }
      );
    }

    /*
     * 2. Verifica se a OpenAI está configurada
     */
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

    /*
     * 3. Lê e valida a solicitação
     */
    const body = await request.json();

    const prompt = body?.prompt;

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

    /*
     * 4. Cobra 1 Diamante
     */
    const {
      data: diamondResult,
      error: consumeError,
    } = await supabase.rpc("use_one_diamond");

    if (consumeError) {
      console.error(
        "Erro ao consumir Diamante:",
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
              "Você não possui Diamantes suficientes para gerar este prompt.",
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

    /*
     * Novo saldo depois da cobrança
     */
    const newBalance =
      diamondResult?.balance;

    /*
     * 5. Chama a OpenAI
     */
    try {
      const response =
        await openai.responses.create({
          model: "gpt-5.6-luna",
          input: cleanPrompt,
        });

      /*
       * 6. Confirma resposta válida
       */
      if (!response.output_text) {
        throw new Error(
          "A OpenAI não retornou nenhum conteúdo."
        );
      }

      /*
       * 7. Sucesso
       */
      return NextResponse.json({
        success: true,
        response: response.output_text,
        diamondsUsed: PROMPT_COST,
        remainingDiamonds: newBalance,
      });
    } catch (openaiError: unknown) {
      console.error(
        "Erro na API da OpenAI:",
        openaiError
      );

      /*
       * 8. Estorna o Diamante
       */
      const {
        data: refundResult,
        error: refundError,
      } = await supabase.rpc(
        "refund_one_diamond"
      );

      if (refundError) {
        console.error(
          "ERRO CRÍTICO: não foi possível estornar o Diamante:",
          refundError
        );
      }

      let errorMessage =
        "Não foi possível processar a solicitação com a OpenAI.";

      if (openaiError instanceof Error) {
        errorMessage =
          openaiError.message;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          refunded:
            !refundError,
          remainingDiamonds:
            refundResult?.balance ?? null,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error(
      "Erro interno na API de geração:",
      error
    );

    let errorMessage =
      "Não foi possível processar a solicitação.";

    if (error instanceof Error) {
      errorMessage =
        error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
