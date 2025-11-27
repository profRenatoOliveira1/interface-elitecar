// endereço do servidor da API
const serverURL = `http://localhost:3333/api/clientes`;

/**
 * Recupera as informações dos clientes na API
 * @returns JSON com informações dos clientes
 */
async function listarClientes() {
    // Faz uma requisição HTTP para a URL formada pela junção do endereço do servidor e o endpoint da API de clientes.
    // A palavra-chave 'await' faz com que o código espere a resposta da API antes de continuar.
    const respostaAPI = await fetch(`${serverURL}`);

    // Verifica se a resposta da API foi bem-sucedida (códigos de status HTTP 200–299).
    // Se não for, entra no bloco 'if' para tratar o erro.
    if (!respostaAPI.ok) {
        // Exibe no console um erro com o código de status da resposta e o texto retornado pela API.
        // Isso ajuda a identificar o motivo da falha na requisição.
        console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());

        // Encerra a execução da função, retornando 'undefined'.
        // Isso evita que o código continue tentando usar uma resposta inválida.
        return;
    }

    // Converte o corpo da resposta da API (que está em formato JSON) em um objeto JavaScript.
    // Também usa 'await' porque essa conversão é assíncrona.
    const jsonClientes = await respostaAPI.json();

    // Retorna o objeto JavaScript contendo os dados dos clientes para quem chamou essa função.
    return jsonClientes;
}

/**
 * Monta a tabela com as informações dos clientes
 */
async function montarTabelaClientes() {
    const listaDeClientes = await listarClientes(); // chama a função para obter a lista de clientes

    // obtendo o elemento tabela
    const tabela = document.querySelector('table');

    // obtendo a tag de corpo da tabela
    const tbody = document.querySelector('tbody');

    // percorre toda a lista de clientes
    // para cada interação é criado um objeto apelidado de cliente
    listaDeClientes.forEach(cliente => {
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
        
        // Inserindo as propriedades do icone de atualizar
        iconeAtualizar.src = "/assets/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
        iconeAtualizar.alt = "editar";
        
        // Inserindo as informações dos clientes
        tdIdCliente.textContent = cliente.idCliente;
        tdNomeCliente.textContent = cliente.nome;
        tdCpfCliente.textContent = cliente.cpf;
        tdTelefoneCliente.textContent = cliente.telefone;

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