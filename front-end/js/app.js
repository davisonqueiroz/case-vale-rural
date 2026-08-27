import { renderProposalForm, toggleForm, getFormData } from './proposal.js';
import { renderConsultForm, toggleConsult, buildFinalMessage, getCardId,
          toggleStatus, renderStatusArea, renderProcessingStatus, renderTimeOutStatus } from './status.js';
import { createCard, createProposal, waitFinalStatus, getCardField  } from './api.js';

const btnProposal = document.getElementById("btn-proposal");
btnProposal.addEventListener('click', () => {
    toggleForm(true);
    toggleConsult(false);
    toggleStatus(false);
    setActiveButton(btnProposal, btnConsult);
});

const btnConsult = document.getElementById("btn-consult");
btnConsult.addEventListener('click', () => {
  toggleForm(false);
  toggleConsult(true);
  toggleStatus(true);

  setActiveButton(btnConsult, btnProposal);
});

const content = document.getElementById('content-container');
content.innerHTML = renderProposalForm() + renderConsultForm();

toggleConsult(false);

setActiveButton(btnProposal, btnConsult);

function setActiveButton(activeButton, inactiveButton) {
  activeButton.classList.add("border-b-4", "shadow-inner", "translate-y-[3px]");
  inactiveButton.classList.remove("border-b-4", "shadow-inner", "translate-y-[3px]");
}

const submitForms = document.getElementById("proposal-form");
submitForms.addEventListener('submit',async (event) => {
  event.preventDefault();

  try {
    const data = getFormData()

    const cardId = await createCard(data)
    data.card_id = cardId;

    await createProposal(data);

    alert(`Proposta criada com sucesso. ID: ${cardId}`);
    submitForms.reset();
    toggleForm(false);
    toggleConsult(true);
    toggleStatus(true);
    setActiveButton(btnConsult, btnProposal);
    renderStatusArea(cardId);
    renderProcessingStatus();
    await requestStatus(cardId);

  } catch (error) {
    alert(error.message);
  }

  
});

const consultStatusButton = document.getElementById("consultation-form");
consultStatusButton.addEventListener('submit',async (event) => {
  event.preventDefault();

  const cardId = getCardId()

  renderStatusArea(cardId);
  renderProcessingStatus();
  requestStatus(cardId)
});

async function requestStatus(cardId) {
  try {
    const response = await waitFinalStatus(cardId)

    const card = response.data.card;
    const status = card.current_phase.name.trim();
    const message = [
      ["CNPJ/CPF", getCardField(card, "cnpj_cpf")],
      ["Razão Social / Nome", getCardField(card, "raz_o_social_nome")],
      ["Tipo de Pessoa", getCardField(card, "tipo_de_pessoa")],
      ["Valor Solicitado", getCardField(card, "valor_solicitado")],
      ["Parecer da IA", getCardField(card, "parecer_da_ia")],
      ["Parecer do Analista", getCardField(card, "parecer_do_analista_1")],
      ["Analista Responsável", getCardField(card, "analista_respons_vel_1")],
      ["Justificativa", getCardField(card, "justificativa_da_reprova_o")]
    ];

    buildFinalMessage(message, status);
  } catch (error) {
    if (error.code === "STATUS_TIMEOUT") {
      renderTimeOutStatus(() => {
        renderStatusArea(cardId);
        renderProcessingStatus();
        requestStatus(cardId);
      });
    } else {
      alert("Não foi possível consultar a proposta." + error.message);
    }
  }
}