async function sendRequest(action, payload) {
  const response = await fetch('/pipefy-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action,
      payload
    })
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
}

async function createCard(data) {
    const createdCard = await sendRequest("CreateCard", data);

    return createdCard.data.createCard.card.id
}

async function createProposal(data) {

    const requestedUrl = await sendRequest("requestUploadUrl", data);
    data["url"] = requestedUrl.data.createPresignedUrl.url
    data["download_url"] = requestedUrl.data.createPresignedUrl.downloadUrl

    await uploadFile(data.url, data.file);

    await sendRequest("updateCardDocument", data);

    await sendRequest("moveCard", data);
}

async function getProposalStatus (cardId) {
    const status = await sendRequest("GetStatus",cardId);
    return status;
}

async function waitFinalStatus(cardId) {
    const interval = 5000;
    const maxTime = 180000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxTime) {
        const response = await getProposalStatus(cardId);
        const card = response?.data?.card;
    const phaseName = card?.current_phase?.name?.trim();

    if (phaseName === "Aprovado" || phaseName === "Reprovado") {
            return response;
        }
        
        await new Promise(resolve => 
            setTimeout(resolve, interval));

    }

    const error = new Error("Max time excepted.");
    error.code = "STATUS_TIMEOUT";
    throw error
}

async function uploadFile(url, file) {
    try {
        const response = await fetch(url,{
            method: "PUT",
            headers: {
                "Content-Type": "application/pdf"
            },
            body: file
        });

        if (!response.ok) {
            throw new Error(`Error in send file: ${response.status}`);
        }

        return true;
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`, {
            cause: error
        });
    }
}

function getCardField(card, fieldId) {
  const field = card?.fields?.find(
    ({ field }) => field?.id === fieldId
  );

  return field?.value ?? "";
}

export { createCard, createProposal, getProposalStatus , waitFinalStatus, getCardField };