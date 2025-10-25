const enderecoServidor = 'https://elitecar-api.onrender.com';   // endereço da API
const endpointPedidos = '/api/pedidos'; // endpoint (rota) da API

/**
 * Recupera as informações dos pedidos na API
 * @returns JSON com as informações dos pedidos
 */
async function listarPedidos() {
    // Faz uma requisição HTTP para a URL formada pela junção do endereço do servidor e o endpoint da API de pedidos.
    // A palavra-chave 'await' faz com que o código espere a resposta da API antes de continuar.
    const respostaAPI = await fetch(`${enderecoServidor}${endpointPedidos}`);

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
    const jsonPedidos = await respostaAPI.json();

    // Retorna o objeto JavaScript contendo os dados dos clientes para quem chamou essa função.
    return jsonPedidos;
}

/*
 * Monta a tabela com as informações dos pedidos
 */
async function montarTabelaPedidos() {
    const listaDePedidos = await listarPedidos(); // chama a função para obter a lista de pedidos

    // obtendo o elemento tabela
    const tabela = document.querySelector('table');

    // obtendo a tag de corpo da tabela
    const tbody = document.querySelector('tbody');

    // percorre toda a lista de pedidos
    // para cada interação é criado um objeto apelidado de pedido
    listaDePedidos.forEach(pedido => {
        // Criando os elementos da tabela
        const tableRow = document.createElement('tr');
        const tdIdPedido = document.createElement('td');
        const tdCliente = document.createElement('td');
        const tdCarro = document.createElement('td');
        const tdDataPedido = document.createElement('td');
        const tdValorPedido = document.createElement('td');
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
        tdIdPedido.textContent = pedido.idPedido;
        tdCliente.textContent = pedido.nomeCliente;
        tdCarro.textContent = pedido.marcaCarro + ' ' + pedido.modeloCarro;
        tdDataPedido.textContent = new Date(pedido.dataPedido).toLocaleDateString();
        tdValorPedido.textContent = formatarMoeda(pedido.valorPedido);

        // Anexando os ícones no tdAcoes
        tdAcoes.appendChild(iconeDeletar);
        tdAcoes.appendChild(iconeAtualizar);

        // Anexando as infos do cliente no tableRow
        tableRow.appendChild(tdIdPedido);
        tableRow.appendChild(tdCliente);
        tableRow.appendChild(tdCarro);
        tableRow.appendChild(tdDataPedido);
        tableRow.appendChild(tdValorPedido);
        tableRow.appendChild(tdAcoes);

        // Anexando o tableRow no tbody
        tbody.appendChild(tableRow);
    });

    // Anexando o tbody na tabela
    tabela.appendChild(tbody);
}

/**
 * Formata a moeda em Real BRL
 * @param {*} valor Valor a ser formatado em Real BRL
 * @returns valor formatado
 */
function formatarMoeda(valor) {
    // Cria um objeto Intl.NumberFormat para formatar números como moeda brasileira (Real - BRL).
    // 'pt-BR' define o idioma e a convenção regional (Português do Brasil).
    // 'style: currency' indica que o número será formatado como moeda.
    // 'currency: BRL' especifica que a moeda usada será o Real brasileiro.
    valorFormatadoBRL = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    // Usa o objeto criado para formatar o valor passado como argumento.
    // O resultado será uma string como "R$ 1.234,56", dependendo do valor.
    return valorFormatadoBRL.format(valor);
}