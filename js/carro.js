const enderecoServidor = 'http://localhost:3333';   // endereço da API
const endpointCarros = '/api/carros';   // endpoint (rota) da API

/**
 * Busca a lista de carros na API
 * @returns lista com os carros cadastrados no banco de dados
 */
async function listarCarros() {
    // Faz uma requisição HTTP para a URL formada pela junção do endereço do servidor e o endpoint da API de carros.
    // A palavra-chave 'await' faz com que o código espere a resposta da API antes de continuar.
    const respostaAPI = await fetch(`${enderecoServidor}${endpointCarros}`);

    // Verifica se a resposta da API foi bem-sucedida (códigos de status HTTP 200–299).
    // Se não for, entra no bloco 'if' para tratar o erro.
    if(!respostaAPI.ok) {
        // Exibe no console um erro com o código de status da resposta e o texto retornado pela API.
        // Isso ajuda a identificar o motivo da falha na requisição.
        console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        
        // Encerra a execução da função, retornando 'undefined'.
        // Isso evita que o código continue tentando usar uma resposta inválida.
        return;
    }

    // Converte o corpo da resposta da API (que está em formato JSON) em um objeto JavaScript.
    // Também usa 'await' porque essa conversão é assíncrona.
    const jsonCarros = await respostaAPI.json();
    
    // Retorna o objeto JavaScript contendo os dados dos clientes para quem chamou essa função.
    return jsonCarros;
}

/**
 * Monta a tabela com as informações dos carros
 */
async function montarTabelaCarros() {
    const listaDeCarros = await listarCarros(); // chama a função para obter a lista de carros

    // obtendo o elemento tabela
    const tabela = document.querySelector('table');

    // obtendo a tag de corpo da tabela
    const tbody = document.querySelector('tbody');

    // percorre toda a lista de carros
    // para cada interação é criado um objeto apelidado de carro
    listaDeCarros.forEach(carro => {
        // Criando os elementos da tabela
        const tableRow = document.createElement('tr');
        const tdIdCarro = document.createElement('td');
        const tdMarcaCarro = document.createElement('td');
        const tdModeloCarro = document.createElement('td');
        const tdAnoCarro = document.createElement('td');
        const tdCorCaro = document.createElement('td');
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
        tdIdCarro.textContent = carro.idCarro;
        tdMarcaCarro.textContent = carro.marca;
        tdModeloCarro.textContent = carro.modelo;
        tdAnoCarro.textContent = carro.ano;
        tdCorCaro.textContent = carro.cor;
        
        // Anexando os ícones no tdAcoes
        tdAcoes.appendChild(iconeDeletar);
        tdAcoes.appendChild(iconeAtualizar);

        // Anexando as infos do cliente no tableRow
        tableRow.appendChild(tdIdCarro);
        tableRow.appendChild(tdMarcaCarro);
        tableRow.appendChild(tdModeloCarro);
        tableRow.appendChild(tdAnoCarro);
        tableRow.appendChild(tdCorCaro);
        tableRow.appendChild(tdAcoes);

        // Anexando o tableRow no tbody
        tbody.appendChild(tableRow);
    });

    // Anexando o tbdoy na tabela
    tabela.appendChild(tbody);
}