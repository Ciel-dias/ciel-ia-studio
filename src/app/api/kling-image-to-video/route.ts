import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KLING_API_URL =
process.env.KLING_API_BASE_URL ||
"https://api-singapore.klingai.com";

/**

* GET
* 
* Verifica se a autenticação da Kling
* está configurada no servidor.
  */
  export async function GET() {
  const apiKey = process.env.KLING_API_KEY;

return NextResponse.json({
status: "ok",
routeVersion: "image-to-video-api-key-v1",
runtime: "nodejs",

klingConfigured: Boolean(apiKey),
apiKeyExists: Boolean(apiKey),
apiKeyLength: apiKey?.length ?? 0,

apiUrl: KLING_API_URL,

endpoint:
  `${KLING_API_URL}/v1/videos/image2video`,

generationTest: false,

});
}

/**

* POST

* 

* Imagem → Vídeo

* 

* Recebe:

* 

* {

* image: Base64 ou URL,

* prompt: string,

* duration?: "5" | "10",

* mode?: "std" | "pro",

* sound?: "on" | "off"

* }

* 

* Autenticação:

* KLING_API_KEY
  */
  export async function POST(request: Request) {
  try {
  const apiKey = process.env.KLING_API_KEY;
  
  /**
  
  * Verifica a chave da Kling.
    */
    if (!apiKey) {
    return NextResponse.json(
    {
    status: "error",
    stage: "configuration",
    
    message:
    "KLING_API_KEY não configurada na Vercel.",
    },
    { status: 500 }
    );
    }
  
  /**
  
  * Lê o JSON enviado pelo frontend.
    */
    let body: any;
  
  try {
  body = await request.json();
  } catch {
  return NextResponse.json(
  {
  status: "error",
  stage: "request",
  
     message:
     "O corpo da requisição não contém JSON válido.",
 },
 { status: 400 }
  
  );
  }
  
  /**
  
  * Prompt.
    */
    const prompt =
    typeof body?.prompt === "string"
    ? body.prompt.trim()
    : "";
  
  if (!prompt) {
  return NextResponse.json(
  {
  status: "error",
  stage: "validation",
  
     message:
     "O campo 'prompt' é obrigatório.",
 },
 { status: 400 }
  
  );
  }
  
  /**
  
  * Imagem de referência.
  * 
  * Pode ser:
  * 
  * - URL pública
  * - Base64 puro
  * 
  * A Kling não deve receber:
  * 
  * data:image/png;base64,...
  * 
  * por isso removemos esse prefixo
  * caso o frontend envie a imagem nesse formato.
    */
    let image =
    typeof body?.image === "string"
    ? body.image.trim()
    : "";
  
  if (!image) {
  return NextResponse.json(
  {
  status: "error",
  stage: "validation",
  
     message:
     "Envie uma imagem de referência.",
 },
 { status: 400 }
  
  );
  }
  
  /**
  
  * Remove prefixo Data URL caso exista.
    */
    if (image.startsWith("data:")) {
    const commaIndex = image.indexOf(",");
  
  if (commaIndex !== -1) {
  image =
  image.substring(commaIndex + 1);
  }
  }
  
  /**
  
  * Modelo.
  * 
  * Usamos kling-v2-6 como padrão nesta rota.
  * 
  * A estrutura fica preparada para trocar
  * facilmente o modelo futuramente.
    */
    const modelName =
    typeof body?.model_name === "string" &&
    body.model_name.trim()
    ? body.model_name.trim()
    : "kling-v2-6";
  
  /**
  
  * Duração.
  * 
  * A API aceita duração em string.
    */
    const duration =
    body?.duration === "10"
    ? "10"
    : "5";
  
  /**
  
  * Modo.
    */
    const mode =
    body?.mode === "pro"
    ? "pro"
    : "std";
  
  /**
  
  * Som.
    */
    const sound =
    body?.sound === "on"
    ? "on"
    : "off";
  
  /**
  
  * Negative prompt opcional.
    */
    const negativePrompt =
    typeof body?.negative_prompt === "string"
    ? body.negative_prompt.trim()
    : "";
  
  /**
  
  * Corpo enviado para a Kling.
    */
    const klingBody: Record<string, unknown> = {
    model_name: modelName,
  
  image,
  
  prompt,
  
  negative_prompt: negativePrompt,
  
  duration,
  
  mode,
  
  sound,
  
  callback_url: "",
  
  external_task_id: "",
  };
  
  console.log(
  "CIEL IA STUDIO - Imagem → Vídeo"
  );
  
  console.log(
  "Kling Image-to-Video Request:",
  JSON.stringify({
  ...klingBody,
  image: "[IMAGE]",
  })
  );
  
  /**
  
  * Chamada para a Kling.
    */
    const response = await fetch(
    "${KLING_API_URL}/v1/videos/image2video",
    {
    method: "POST",
    
    headers: {
    Accept: "application/json",
    
    /**
    * MESMA AUTENTICAÇÃO
    * DOS OUTROS CARDS.
    */
    Authorization: "Bearer ${apiKey}",
    
    "Content-Type":
    "application/json",
    },
    
    body: JSON.stringify(klingBody),
    
    cache: "no-store",
    }
    );
  
  /**
  
  * Lê a resposta como texto primeiro.
    */
    const text =
    await response.text();
  
  let data: any;
  
  try {
  data = JSON.parse(text);
  } catch {
  data = {
  rawResponse: text,
  };
  }
  
  console.log(
  "Kling Image-to-Video HTTP:",
  response.status
  );
  
  console.log(
  "Kling Image-to-Video Response:",
  JSON.stringify(data)
  );
  
  /**
  
  * ERRO DA KLING
    */
    if (!response.ok) {
    return NextResponse.json(
    {
    status: "error",
    
    stage: "kling",
    
    message:
    "A Kling recusou a solicitação de vídeo.",
    
    httpStatus:
    response.status,
    
    httpStatusText:
    response.statusText,
    
    klingCode:
    data?.code ??
    data?.data?.code ??
    null,
    
    klingMessage:
    data?.message ??
    data?.data?.message ??
    null,
    
    requestId:
    data?.request_id ??
    data?.data?.request_id ??
    null,
    
    klingResponse: data,
    
    requestSent: {
    endpoint:
    "${KLING_API_URL}/v1/videos/image2video",
    
     model_name:
   modelName,

 duration,

 mode,

 sound,

 promptReceived: true,

 promptLength:
   prompt.length,

 imageReceived: true,

 imageLength:
   image.length,
    
    },
    },
    {
    /**
    * Mantemos HTTP 200 para o frontend
    * conseguir mostrar os detalhes da Kling,
    * seguindo o mesmo padrão das outras rotas.
    */
    status: 200,
    }
    );
    }
  
  /**
  
  * TASK ID
    */
    const taskId =
    data?.data?.task_id ||
    data?.task_id ||
    data?.data?.taskId ||
    data?.taskId ||
    null;
  
  /**
  
  * STATUS INICIAL
    */
    const taskStatus =
    data?.data?.task_status ||
    data?.task_status ||
    null;
  
  /**
  
  * SUCESSO
    */
    return NextResponse.json({
    status: "success",
  
  stage: "kling",
  
  message:
  "A Kling aceitou a solicitação de vídeo.",
  
  taskId,
  
  taskStatus,
  
  klingCode:
  data?.code ??
  data?.data?.code ??
  null,
  
  klingMessage:
  data?.message ??
  data?.data?.message ??
  null,
  
  requestId:
  data?.request_id ??
  data?.data?.request_id ??
  null,
  
  klingResponse: data,
  
  requestSent: {
  endpoint:
  "${KLING_API_URL}/v1/videos/image2video",
  
   model_name:
   modelName,

 duration,

 mode,

 sound,

 promptReceived: true,

 promptLength:
   prompt.length,

 imageReceived: true,

 imageLength:
   image.length,
  
  },
  });
  } catch (error) {
  console.error(
  "CIEL IA STUDIO - Image-to-Video API error:",
  error
  );
  
  return NextResponse.json(
  {
  status: "error",
  
   stage: "server",

 message:
   error instanceof Error
     ? error.message
     : "Erro interno na API de vídeo Kling.",
  
  },
  {
  status: 500,
  }
  );
  }
  }
