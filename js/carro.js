const enderecoServidor = 'https://elitecar-api.onrender.com';   // endereço da API
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
        iconeDeletar.src = "../../assets/delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
        iconeDeletar.alt = "remover";
        iconeDeletar.addEventListener("click", () => { removerCarro(carro) });

        // Inserindo as propriedades do icone de atualizar
        iconeAtualizar.src = "../../assets/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
        iconeAtualizar.alt = "editar";
        iconeAtualizar.addEventListener("click", () => { window.location.href = `../../pages/carros/edicao-carro.html?idCarro=${carro.idCarro}` });

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

async function enviarFormularioCadastro(event) {
    event.preventDefault();

    const carro = {
        marca: document.getElementById('marca-carro').value,
        modelo: document.getElementById('modelo-carro').value,
        ano: document.getElementById('ano-carro').value,
        cor: document.getElementById('cor-carro').value
    }

    try {
        const respostaAPI = await fetch(`${enderecoServidor}${endpointCarros}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(carro)
        });

        if (!respostaAPI.ok) {
            alert('Erro ao cadastrar carro.');

            throw new Error('Erro ao fazer requisição à API.');
        }

        alert('Carro cadastrado com sucesso!');

        window.location.href = '../../pages/carros/lista-carros.html';
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}

async function removerCarro(carro) {
    const confirmacao = confirm(`Deseja mesmo remover o carro ${carro.marca} ${carro.modelo}?`);

    try {
        if (confirmacao) {
            const respostaAPI = await fetch(`${enderecoServidor}${endpointCarros}/${carro.idCarro}`, {
                method: 'DELETE'
            });

            if (!respostaAPI.ok) {
                alert('Erro ao remover carro.');

                console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());

                return;
            }

            alert('Carro removido com sucesso!');

            window.location.reload();
        } else {
            return;
        }
    } catch (error) {
        console.error('Erro ao fazer requisição.');
        return;
    }
}

async function buscarCarro() {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    const idCarro = urlParams.get('idCarro');

    try {
        const respostaAPI = await fetch(`${enderecoServidor}${endpointCarros}/${idCarro}`);

        if (!respostaAPI.ok) {
            alert('Erro ao buscar carro.');

            console.error('Erro na requisição: ', respostaAPI.status, await respostaAPI.text());
        }

        const carro = await respostaAPI.json();

        preencherFormularioAtualizacao(carro);
    } catch (error) {
        // Caso ocorra algum erro na requisição ou no processamento, exibe um alerta ao usuário
        alert('Erro ao buscar informações do carro.');

        // Exibe o erro completo no console para facilitar o diagnóstico durante o desenvolvimento
        console.error(`Erro ao buscar informações do carro. ${error}`);

        // Encerra a função retornando vazio
        return;
    }
}

function preencherFormularioAtualizacao(carro) {
    document.getElementById('id-carro').value = carro.idCarro;
    document.getElementById('marca-carro').value = carro.marca;
    document.getElementById('modelo-carro').value = carro.modelo;
    document.getElementById('ano-carro').value = carro.ano;
    document.getElementById('cor-carro').value = carro.cor;
}

async function enviarFormularioAtualizacao(event) {
    // Impede que o formulário seja enviado da forma tradicional (recarregando a página)
    event.preventDefault();

    // Cria um objeto cliente com os dados preenchidos no formulário
    const carro = {
        idCarro: document.getElementById('id-carro').value, // Captura o valor do campo de ID do cliente
        marca: document.getElementById('marca-carro').value,
        modelo: document.getElementById('modelo-carro').value,
        ano: document.getElementById('ano-carro').value,
        cor: document.getElementById('cor-carro').value
    };

    // Inicia um bloco try/catch para tratar possíveis erros na requisição
    try {
        // Envia uma requisição HTTP PUT para a API, atualizando os dados do cliente
        const respostaAPI = await fetch(`${enderecoServidor}${endpointCarros}/${carro.idCarro}`, {
            method: 'PUT', // método HTTP usado para atualizar dados
            headers: {
                'Content-type': 'application/json' // informa que os dados estão no formato JSON
            },
            body: JSON.stringify(carro) // transforma o objeto cliente em uma string JSON para envio
        });

        // Verifica se a resposta da API foi bem-sucedida
        if (!respostaAPI.ok) {
            // Exibe um alerta informando que houve erro na atualização
            alert('Erro ao atualizar carro.');

            // Exibe no console um erro com o código de status da resposta e o texto retornado pela API.
            // Isso ajuda a identificar o motivo da falha na requisição.
            console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        }

        // Exibe um alerta informando que o cliente foi atualizado com sucesso
        alert('Carro atualizado com sucesso');

        // Redireciona o usuário para a página de lista de clientes
        window.location.href = '../../pages/carros/lista-carros.html';
    } catch (error) {
        // Caso ocorra algum erro, exibe uma mensagem no console para ajudar na depuração
        console.error('Erro ao fazer requisição.');
        return;
    }
}