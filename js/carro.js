// endereço do servidor da API
const serverURL = `http://localhost:3333/api/carros`;

/**
 * Recupera as informações dos carros na API
 * @returns JSON com informações dos carros
 */
async function listarCarros() {
    // Faz uma requisição HTTP para a URL formada pela junção do endereço do servidor e o endpoint da API de clientes.
    // A palavra-chave 'await' faz com que o código espere a resposta da API antes de continuar.
    const respostaAPI = await fetch(`${serverURL}`);

    // Verifica se a resposta da API foi bem-sucedida (códigos de status HTTP 200–299).
    // Se não for, entra no bloco 'if' para tratar o erro.
    if(!respostaAPI.ok) {
        // Exibe no console um erro com o código de status da resposta e o texto retornado pela API.
        // Isso ajuda a identificar o motivo da falha na requisição.
        console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());
        
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
    // Aguarda a lista de carros ser carregada (função que busca dados de uma API)
    const listaDeCarros = await listarCarros();

    // Seleciona o elemento <tbody> da tabela no DOM
    const tbody = document.querySelector('tbody');
    // Limpa o conteúdo do <tbody> antes de preencher (evita duplicações)
    tbody.innerHTML = '';

    // Percorre cada objeto 'carro' da lista
    listaDeCarros.forEach(carro => {
        // Cria uma nova linha <tr> para a tabela
        const tr = document.createElement('tr');

        // Define o HTML interno da linha com as células <td> usando template literals
        // As expressões ${...} inserem os valores do objeto 'carro' diretamente no HTML
        tr.innerHTML = `
            <td>${carro.idCarro}</td>
            <td>${carro.marca}</td>
            <td>${carro.modelo}</td>
            <td>${carro.ano}</td>
            <td>${carro.cor}</td>
            <td>
                <img src='/assets/delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg' alt='remover' class='btn-delete'/>
                <img src='/assets/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg' alt='editar' class='btn-edit'/>
            </td>
        `;

        // Adiciona a linha <tr> dentro do <tbody> já selecionado
        tbody.appendChild(tr);

        // adiciona eventos
        // Seleciona o ícone de "deletar" dentro da linha atual e adiciona um listener de clique
        tr.querySelector('.btn-delete').addEventListener('click', () => alert('deletar'));
        // Seleciona o ícone de "editar" dentro da linha atual e adiciona um listener de clique
        tr.querySelector('.btn-edit').addEventListener('click', () => alert('editar'));
    });
}