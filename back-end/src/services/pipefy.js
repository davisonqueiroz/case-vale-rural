import 'dotenv/config';
import { getPipefyToken } from '../tokenGenerate.js';

const url = "https://api.pipefy.com/graphql";

function setBody(query, variables) {
  return JSON.stringify({
    query: query,
    variables: variables
  })
}

async function executeRequest (data) {
  const token = await getPipefyToken()
  const request = {
    url,
    options: {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      },
      body: setBody(
        data.body,
        data.payload
      )
    }
  }

  const response = await fetch(
      request.url,
      request.options
  );
  const result = await response.json();

  if (!response.ok || result.errors) {
    const details = result.errors ?? result;
    throw new Error(`Pipefy request failed (${response.status}): ${JSON.stringify(details)}`);
  }

  return result;
}

function createCard(data) {
  const cardCreation = {
    body: `mutation CreateCard($input: CreateCardInput!) {
            createCard(input: $input) {
              card { id title }
            }
          }`,
    payload: {
      input: {
        pipe_id: "307310553",
        title: data.social_reason,
        fields_attributes: [
          {
            field_id: "cnpj_cpf",
            field_value: data.document
          },
          {
            field_id: "raz_o_social_nome",
            field_value: data.social_reason
          },
          {
            field_id: "tipo_de_pessoa",
            field_value: data.person_type
          },
          {
            field_id: "valor_solicitado",
            field_value: data.requested_value
          }
        ]
      }
    }
  };

  return executeRequest(cardCreation);
}

function requestUploadUrl(data) {
  const pressignedUrl = {
    body: `mutation CreateUrl($input: CreatePresignedUrlInput!) {
            createPresignedUrl(input: $input) {
              url
              downloadUrl
            }
          }`,
    payload: {
      input: {
        organizationId:  "301691766",
        fileName: data.file_name,
        contentType: "application/pdf",
      }
    }
  };

  return executeRequest(pressignedUrl);
}

function updateCardDocument(data) {
  
  let path = data.download_url
  let startPath = path.indexOf("orgs/");
  let endPath = path.indexOf("?signature=");

  path =path.slice(startPath, endPath);
  const cardUpdate = {
    body: `mutation SetDoc($input: UpdateCardFieldInput!) {
            updateCardField(input: $input) { success }
          }`,
    payload: {
      input: {
        card_id:  data.card_id,
        field_id: "documentos",
        new_value: [ path ],
      }
    }
  };

  return executeRequest(cardUpdate);
}

function moveCard(data) {
  const cardToInput ={
    body: `mutation Move($input: MoveCardToPhaseInput!) {
            moveCardToPhase(input: $input) { card { id } }
          }`,
    payload: {
      input: {
        card_id:  data.card_id,
        destination_phase_id: "344063541",
      }
    }
  };

  return executeRequest(cardToInput);
}

function getCardStatus(card_id){
  const status = {
    body: `query Status($id: ID!) {
            card(id: $id) {
            id
            title
            current_phase { id name }
            fields { name value field { id } }
            }
          }`,
    payload: {
      id: card_id
    }
  };

  return executeRequest(status);    
}

function execute(action, payload) {
  switch (action) {
    case "CreateCard":
      return createCard(payload);
    case "moveCard":
      return moveCard(payload);
    case "updateCardDocument":
      return updateCardDocument(payload);
    case "GetStatus":
      return getCardStatus(payload);
    case "requestUploadUrl":
      return requestUploadUrl(payload);
    default:
      throw new Error("Invalid action");
  }
}

export { execute }