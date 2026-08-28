async function handleGenerate() {
  if (!image1 && !image2) {
    setErrorMessage(
      "Selecione pelo menos uma imagem de referência."
    );
    return;
  }

  if (!prompt.trim()) {
    setErrorMessage(
      "Descreva o que deseja criar na imagem."
    );
    return;
  }

  setLoading(true);
  setErrorMessage("");
  setResultMessage("");
  setTaskId("");

  try {
    // Converte as imagens para Data URL
    const image1Data = image1
      ? await fileToDataURL(image1)
      : "";

    const image2Data = image2
      ? await fileToDataURL(image2)
      : "";

    // Envia para a nossa rota do Card 4
    const response = await fetch(
      "/api/kling-image-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          image: image1Data,
          image2: image2Data || undefined,
          aspect_ratio: aspectRatio,
          style,
        }),
      }
    );

    // Lê primeiro como texto para não esconder
    // respostas que não sejam JSON
    const responseText = await response.text();

    let data: any = null;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }

    /*
     * Se o servidor respondeu com erro HTTP,
     * mostramos o retorno real da nossa API.
     */
    if (!response.ok) {
      const klingCode =
        data?.klingCode ??
        data?.code ??
        data?.klingResponse?.code ??
        null;

      const klingMessage =
        data?.klingMessage ??
        data?.message ??
        data?.klingResponse?.message ??
        null;

      const requestId =
        data?.requestId ??
        data?.klingResponse?.request_id ??
        null;

      let message =
        klingMessage ||
        data?.message ||
        "Não foi possível processar sua solicitação.";

      /*
       * Tratamento específico para saldo insuficiente.
       */
      if (
        response.status === 429 &&
        String(klingCode) === "1102"
      ) {
        message =
          "Saldo insuficiente para gerar esta imagem no momento.";
      }

      setErrorMessage(
        [
          message,
          `HTTP: ${response.status}`,
          klingCode
            ? `Código: ${klingCode}`
            : null,
          requestId
            ? `Request ID: ${requestId}`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      );

      return;
    }

    /*
     * Se a resposta não for JSON mesmo com HTTP 200.
     */
    if (!data) {
      setErrorMessage(
        `O servidor respondeu de forma inesperada.\nHTTP: ${response.status}`
      );
      return;
    }

    /*
     * Nossa própria API informou erro.
     */
    if (data?.status === "error") {
      const klingCode =
        data?.klingCode ??
        data?.code ??
        null;

      const klingMessage =
        data?.klingMessage ??
        data?.message ??
        null;

      const requestId =
        data?.requestId ??
        null;

      let message =
        klingMessage ||
        "Não foi possível gerar sua imagem.";

      if (
        String(klingCode) === "1102"
      ) {
        message =
          "Saldo insuficiente para gerar esta imagem no momento.";
      }

      setErrorMessage(
        [
          message,
          klingCode
            ? `Código: ${klingCode}`
            : null,
          requestId
            ? `Request ID: ${requestId}`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      );

      return;
    }

    /*
     * Solicitação aceita.
     */
    const returnedTaskId =
      data?.taskId ||
      data?.data?.task_id ||
      data?.klingResponse?.data?.task_id ||
      "";

    if (returnedTaskId) {
      setTaskId(returnedTaskId);
    }

    setResultMessage(
      "Sua solicitação foi enviada com sucesso. A imagem está sendo processada."
    );

  } catch (error) {
    console.error(
      "Erro no Card 4 — Imagem → Imagem:",
      error
    );

    /*
     * Agora esta mensagem só aparece quando
     * realmente houve falha de comunicação.
     */
    setErrorMessage(
      "Não foi possível se conectar ao servidor. Verifique sua conexão e tente novamente."
    );

  } finally {
    setLoading(false);
  }
}
