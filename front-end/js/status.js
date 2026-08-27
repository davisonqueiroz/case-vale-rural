function renderConsultForm() {
    return `
    <section id="consultation-status" class="flex flex-col ">
        <form id="consultation-form" class="flex flex-col-2 justify-center my-5">
            <label for="fconsult" class="my-2"></label>
            <input type="text" id="fconsult" name="fconsult"
                class="border border-gray-300 rounded-lg px-3 py-2 w-[41%]" required>
                <button type="submit" id="fconsult-buton" class="w-1/5 h-12 px-6 py-3 ml-5 rounded-lg bg-[#A97855] text-[#e2f0fe] 
                        hover:bg-[#70472F] active:bg-[#E7F0E8]">
                    Consultar
                </button>
        </form>
    </section>
    `
}

function toggleConsult(show) {
    const consultForm = document.getElementById("consultation-form");
    consultForm.classList.toggle('hidden', !show);
}

function toggleStatus(show) {
    const finalMessage = document.getElementById("final-message");
    const statusArea = document.getElementById("status-area");
    const timeoutArea = document.getElementById("timeout-area");

    statusArea?.classList.toggle("hidden", !show || Boolean(finalMessage));
    finalMessage?.classList.toggle("hidden", !show);
    timeoutArea?.classList.toggle("hidden", !show);
}

function buildFinalMessage(message, status) {
    const previousMessage = document.getElementById("final-message");

    const messageDiv =  document.createElement("div");
    messageDiv.id = "final-message";

    if (previousMessage) {
        previousMessage.remove();
    }

    messageDiv.classList.add('flex', 'w-[70%]', 'mx-auto', 'flex-col', 'items-start', 'mt-6', 'mb-10', 'p-6', 'rounded-lg')
    if (status === "Aprovado") {
        messageDiv.classList.add('bg-[#ccfff2]')
    }else if(status === "Reprovado") {
        messageDiv.classList.add('bg-[#ffcccc]')
    }else {
        throw new Error(`Invalid status.`);
    }

    const statusArea = document.getElementById("status-area");
    statusArea.classList.add('hidden')    

    const statusTitle = status === "Aprovado"
        ? "Proposta Aprovada"
        : "Proposta Reprovada";
    const finalMessage = `
        <h2 class="text-2xl font-bold mb-5 ml-[38%]">${statusTitle}</h2>
    ` + message
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([label, value]) => 
        `
        <p class="font-bold">${label}</p>
        <p class="mb-3">${value}</p>
        `)
        .join("");

    messageDiv.insertAdjacentHTML("beforeend", finalMessage);
    document.getElementById("content-container").appendChild(messageDiv);
}

function getCardId(){
    const form = document.getElementById("consultation-form");        
    const formData = new FormData(form);
    const cardId = formData.get("fconsult");

    return cardId;
}

function renderStatusArea(proposalNumber){
    let statusArea = document.getElementById("status-area");
    document.getElementById("final-message")?.remove();
    document.getElementById("timeout-area")?.remove();

    if (!statusArea) {
        statusArea = document.createElement("div");
        statusArea.id = "status-area";
        statusArea.className = "w-[70%] mx-auto py-6";
        document
        .getElementById("content-container")
        .appendChild(statusArea);
    }

    statusArea.classList.remove("hidden");
    statusArea.innerHTML = `
        <h1 class="font-bold text-2xl text-[#26352B]">Minha proposta</h1>
        <p class="mt-2 text-[#66736A]">Número: ${proposalNumber}</p>
    `;
}

function renderProcessingStatus (){
    const messageArea = document.getElementById("status-area");
    const awaitMessage = `
        <section id="await-area" class="mt-6">
            <div class="flex items-center">
                <span>
                    <i class="inline-flex w-[22px] h-[22px] items-center justify-center rounded-full bg-green-500 text-white not-italic">✓</i>
                    Proposta recebida
                </span>
            </div>
            <div class="w-0.5 h-6 ml-[10px] bg-[#ccc]"></div>
            <div class="flex items-center">
                <i class="inline-flex w-[22px] h-[22px] items-center justify-center rounded-full bg-green-500 text-white not-italic">✓</i>
                <span class="ml-1">Documentos enviados</span>
            </div>
            <div class="w-0.5 h-6 ml-[10px] bg-[#ccc]"></div>
            <div class="flex items-center mb-20">
                <div class="w-[23px] h-[23px] shrink-0 border-4 border-[#e5e5e5] border-t-[#51d4db] rounded-full animate-spin"></div>
                <span class="ml-1">Análise de Risco (Processando...)</span>
            </div>
            <p class="mb-10 ml-[15%] text-[#6b7280] text-base hidden">A IA está analisando os documentos.<br>Isso pode levar alguns minutos.</p>    
        </section>
    `

    messageArea.insertAdjacentHTML("beforeend", awaitMessage);
}

function renderTimeOutStatus(onRetry){
    let timeoutArea = document.getElementById("timeout-area");

    if (!timeoutArea) {
        timeoutArea = document.createElement("section");
        timeoutArea.id = "timeout-area";
        timeoutArea.innerHTML = `
        <p class="ml-[15%] mb-9 text-[#6b7280]">
            A análise ainda não foi concluída.
            Tempo máximo excedido.
        </p>
        <button id="retry-button" type="button">
            Repetir consulta
        </button>
        `;

        document
        .getElementById("content-container")
        .appendChild(timeoutArea);
    }

    timeoutArea.classList.remove("hidden");

    document
        .getElementById("retry-button")
        .onclick = onRetry;
    
}

export { renderConsultForm, toggleConsult, toggleStatus, buildFinalMessage, getCardId, renderStatusArea, renderProcessingStatus, renderTimeOutStatus }