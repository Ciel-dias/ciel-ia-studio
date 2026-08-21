import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API Kling do CIEL IA STUDIO está funcionando",
    klingConfigured: !!process.env.KLING_API_KEY,
  });
}
