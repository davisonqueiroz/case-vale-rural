import { cpf, cnpj } from 'https://esm.sh/cpf-cnpj-validator@2.1.2';

function renderProposalForm() {
  return `
    <section id="new-proposal" class="flex flex-col items-center " >
        <form id="proposal-form"
                class="flex flex-col items-center w-[70%] mt-5 mb-10 rounded-lg bg-[#FFFFFF]">
            <label for="fdocument" class="my-2 text-[#66736A]"> CPF/CNPJ</label>
            <input type="text" id="fdocument" name="fdocument"
                class="border border-gray-300 rounded-lg px-3 py-2 w-11/12" required placeholder="000.000.000-00">
            <label for="freason" class="mt-5 mb-2 text-[#66736A]"> Razão Social/ Nome</label>
            <input type="text" id="freason" name="freason"
                class="border border-gray-300 rounded-lg px-3 py-2 w-11/12" required placeholder="Empresa Fantasia XXX"><br>
            <p class="text-[#66736A]"> Tipo de Pessoa</p>
            <div>
                <input type="radio" id="pessoa_fisica" name="ftype_person" value="Pessoa Física" required>
                <label for="pessoa_fisica " class="text-[#66736A]" >Pessoa Física</label>
                <input type="radio" id="pessoa_juridica" name="ftype_person" value="Pessoa Jurídica" class="ml-8">
                <label for="pessoa_juridica" class="text-[#66736A]">Pessoa Jurídica</label>
            </div><br>
            <label for="fvalue" class="mb-2 text-[#66736A]"> Valor Solicitado</label>
            <input type="text" id="fvalue" name="fvalue"
                class="border border-gray-300 rounded-lg px-3 py-2 w-11/12 mb-3" required placeholder="150.000,00">
            <label for="ffile" class="mb-4 text-[#66736A]">Anexar Documento(s)</label>
            <input type="file" id="ffile" name="ffile" accept=".pdf" required>

                <button type="submit" id="btn-send-proposal" class="w-11/12 my-5 py-3 rounded-lg bg-[#2F6B3F] text-[#e2f0fe] hover:bg-[#245532]"> Enviar Proposta</button>
        </form>
    </section>
  `;
}

function toggleForm(show) {
  const sectionForm = document.getElementById("new-proposal");
  sectionForm.classList.toggle('hidden', !show);
}

function getFormData(){
    const form = document.getElementById("proposal-form");        
    const formData = new FormData(form);
    const file = formData.get("ffile");

    if (!(file instanceof File) || file.size === 0) {
        throw new Error("Selecione um arquivo PDF.");
    }
    
    const selectedRadio = formData.get("ftype_person")
    const documentValue = formData.get("fdocument").replace(/\D/g, "");

    const validatedDocument = selectedRadio === "Pessoa Física" ? cpf.isValid(documentValue) : cnpj.isValid(documentValue);

    if (!validatedDocument) {
        throw new Error("Documento inválido.");
    }

    return {
        document: documentValue,
        social_reason: formData.get("freason"),
        person_type: formData.get("ftype_person"),
        requested_value: formData.get("fvalue")
        .replace(/[^\d,]/g, "")
        .replace(",", "."),
        file,
        file_name: file.name
    };
}

export { renderProposalForm, toggleForm, getFormData }