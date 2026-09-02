import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não autenticado.",
        },
        { status: 401 }
      );
    }

    const {
      data: credits,
      error: creditsError,
    } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (creditsError) {
      console.error(
        "Erro ao buscar saldo:",
        creditsError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível consultar seus Diamantes.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      balance: credits?.balance ?? 0,
    });
  } catch (error) {
    console.error(
      "Erro interno na rota de créditos:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Erro interno ao consultar os Diamantes.",
      },
      { status: 500 }
    );
  }
}
