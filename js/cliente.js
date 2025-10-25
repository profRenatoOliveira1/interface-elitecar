const enderecoServidor = `http://localhost:3333`;
const endpointClientes = `/api/clientes`;

/**
 * Recupera as informações dos clientes na API
 * @returns JSON com informações dos clientes
 */
async function listarClientes() {
    const respostaAPI = await fetch(`${enderecoServidor}${endpointClientes}`);
    if (!respostaAPI.ok) {
        console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        return;
    }
    const jsonClientes = await respostaAPI.json();
    return jsonClientes;
}

/**
 * Monta a tabela com as informações dos clientes
 */
async function montarTabelaClientes() {
    const listaDeClientes = await listarClientes(); // chama a função para obter a lista de clientes

    // obtendo o elemento tabela
    const tabela = document.querySelector('table');

    // criando a tag de corpo da tabela
    const tbody = document.querySelector('tbody');

    listaDeClientes.forEach(cliente => {
        console.log(cliente);
        // Criando os elementos da tabela
        const tableRow = document.createElement('tr');
        const tdIdCliente = document.createElement('td');
        const tdNomeCliente = document.createElement('td');
        const tdCpfCliente = document.createElement('td');
        const tdTelefoneCliente = document.createElement('td');
        const tdAcoes = document.createElement('td');
        const iconeDeletar = document.createElement('img');
        const iconeAtualizar = document.createElement('img');

        // Inserindo as propriedades do icone de deletar
        iconeDeletar.src = "/assets/delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
        iconeDeletar.alt = "remover";
        iconeDeletar.addEventListener("click", () => { alert('remover') });

        // Inserindo as propriedades do icone de atualizar
        iconeAtualizar.src = "/assets/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
        iconeAtualizar.alt = "editar";
        iconeAtualizar.addEventListener("click", () => { alert('editar') });

        // Inserindo as informações dos clientes
        tdIdCliente.textContent = cliente.idCliente;
        tdNomeCliente.textContent = cliente.nome;
        tdCpfCliente.textContent = formatarCPF(cliente.cpf);
        tdTelefoneCliente.textContent = formatarTelefone(cliente.telefone);
        
        // Anexando os ícones no tdAcoes
        tdAcoes.appendChild(iconeDeletar);
        tdAcoes.appendChild(iconeAtualizar);

        // Anexando as infos do cliente no tableRow
        tableRow.appendChild(tdIdCliente);
        tableRow.appendChild(tdNomeCliente);
        tableRow.appendChild(tdCpfCliente);
        tableRow.appendChild(tdTelefoneCliente);
        tableRow.appendChild(tdAcoes);

        // Anexando o tableRow no tbody
        tbody.appendChild(tableRow);
    });

    // Anexando o tbody na tabela
    tabela.appendChild(tbody);
}

/**
 * Formata um CPF para ser exibido no formato 000.000.000-00
 * @param {*} cpf CPF a ser formatado
 * @returns CPF formatado
 */
function formatarCPF(cpf) {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Aplica a máscara ###.###.###-##
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um telefone para ser exibido no formato (00) 0 0000-0000`
 * @param {*} telefone Telefone a ser formatado
 * @returns Telefone formatado
 */
function formatarTelefone(telefone) {
    // Remove caracteres não numéricos
    const telefoneLimpo = telefone.replace(/\D/g, '');

    // Aplica a máscara (##) # ####-####
    return telefoneLimpo.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
}