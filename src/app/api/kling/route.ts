import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL = "https://api.klingai.com";

function createKlingJWT() {
  const accessKey = process.env.KLING_ACCESS_KEY;
  const secretKey = process.env.KLING_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error(
      "KLING_ACCESS_KEY ou KLING_SECRET_KEY não configurada na Vercel."
    );
  }

  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    iss: accessKey,
    exp: now + 1800,
    nbf: now - 5,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const encodedHeader = encode(header);
  const encodedPayload = encode(payload);

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}

/**
 * GET
 * Apenas verifica se as variáveis da Kling
 * estão chegando ao servidor.
 */
export async function GET() {
  const accessKey = process.env.KLING_ACCESS_KEY;
  const secretKey = process.env.KLING_SECRET_KEY;

  return NextResponse.json({
    status: "ok",
    routeVersion: "v4",
    runtime: "nodejs",

    accessKeyExists: Boolean(accessKey),
    secretKeyExists: Boolean(secretKey),

    accessKeyLength: accessKey?.length ?? 0,
    secretKeyLength: secretKey?.length ?? 0,

    generationTest: false,
  });
}

/**
 * POST
 * Envia uma geração de vídeo para a Kling.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "O campo 'prompt' é obrigatório.",
        },
        { status: 400 }
      );
    }

    const token = createKlingJWT();

    const klingBody = {
      model_name: body.model_name || "kling-v1",
      prompt,
      negative_prompt: body.negative_prompt || "",
      mode: body.mode || "std",
      duration: body.duration || "5",
      aspect_ratio: body.aspect_ratio || "16:9",
    };

    const response = await fetch(
      `${KLING_API_URL}/v1/videos/text2video`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(klingBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: "A Kling recusou a solicitação.",
          klingStatus: response.status,
          klingResponse: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Tarefa enviada para a Kling.",
      taskId: data?.data?.task_id || data?.task_id || null,
      klingResponse: data,
    });
  } catch (error) {
    console.error("Kling API error:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro interno na API Kling.",
      },
      { status: 500 }
    );
  }
}
