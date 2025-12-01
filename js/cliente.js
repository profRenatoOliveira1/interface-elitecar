const enderecoServidor = `https://elitecar-api.onrender.com`; // endereço da API
const endpointClientes = `/api/clientes`; // endpoint (rota) da API

/**
 * Recupera as informações dos clientes na API
 * @returns JSON com informações dos clientes
 */
async function listarClientes() {
    // Faz uma requisição HTTP para a URL formada pela junção do endereço do servidor e o endpoint da API de clientes.
    // A palavra-chave 'await' faz com que o código espere a resposta da API antes de continuar.
    const respostaAPI = await fetch(`${enderecoServidor}${endpointClientes}`);

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
        iconeDeletar.src = "../../assets/delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
        iconeDeletar.alt = "remover";
        iconeDeletar.addEventListener("click", () => { removerCliente(cliente) });

        // Inserindo as propriedades do icone de atualizar
        iconeAtualizar.src = "../../assets/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg";
        iconeAtualizar.alt = "editar";
        iconeAtualizar.addEventListener("click", () => { window.location.href = `../../pages/clientes/edicao-cliente.html?idCliente=${cliente.idCliente}` });

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
    // Remove todos os caracteres que não são números
    const telefoneLimpo = telefone.replace(/\D/g, '');

    // Se o telefone tiver 11 dígitos, aplica a máscara com o dígito extra: (##) # ####-####
    if (telefoneLimpo.length === 11) {
        return telefoneLimpo.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    }

    // Se o telefone tiver 10 dígitos, aplica a máscara tradicional: (##) ####-####
    if (telefoneLimpo.length === 10) {
        return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    // Se não tiver 10 ou 11 dígitos, retorna o número original sem formatação
    return telefone;
}

async function enviarFormularioCadastro(event) {
    // Impede que o formulário seja enviado da forma tradicional (recarregando a página)
    event.preventDefault();

    // Cria um objeto cliente com os dados preenchidos no formulário
    const cliente = {
        nome: document.getElementById('nome-cliente').value, // Captura o valor do campo de nome
        cpf: document.getElementById('cpf-cliente').value,  // Captura o valor do campo de CPF
        telefone: document.getElementById('telefone-cliente').value // Captura o valor do campo de telefone
    };

    // Inicia um bloco try/catch para tratar possíveis erros na requisição
    try {
        // Exibe no console a URL que será usada na requisição (útil para testes e depuração)
        console.log(`${enderecoServidor}${endpointClientes}`);

        // Envia uma requisição HTTP POST para a API, atualizando os dados do cliente
        const respostaAPI = await fetch(`${enderecoServidor}${endpointClientes}`, {
            method: 'POST', // método HTTP usado para inserir dados
            headers: {
                'Content-type': 'application/json' // informa que os dados estão no formato JSON
            },
            body: JSON.stringify(cliente) // transforma o objeto cliente em uma string JSON para envio
        });

        // Verifica se a resposta da API foi bem-sucedida
        if (!respostaAPI.ok) {
            // Exibe um alerta informando que houve erro no cadastro
            alert('Erro ao cadastrar cliente.');

            // Lança um erro para interromper a execução da função
            throw new Error(`Erro ao fazer requisição à API.`);
        }

        // Exibe um alerta informando que o cliente foi cadastrado com sucesso
        alert('Cliente cadastrado com sucesso');

        // Redireciona o usuário para a página de lista de clientes
        window.location.href = '/pages/clientes/lista-clientes.html';
    } catch (error) {
        // Caso ocorra algum erro, exibe uma mensagem no console para ajudar na depuração
        console.error('Erro ao fazer requisição.');
        return;
    }
}

/**
 * Envia solicitação à API para remover um cliente
 * @param {*} cliente Objeto do tipo Cliente
 * @returns Exibe um alerta em caso de sucesso ou falha na requisição
 */
async function removerCliente(cliente) {
    // Pergunta ao usuário se ele realmente quer deletar aquele registro
    // A resposta é armazenada na variável confirmação (booleana)
    const confirmacao = confirm(`Deseja mesmo remover o cliente ${cliente.nome}?`);

    // verifica se confirmação tem o valor **true**
    if (confirmacao) {
        // Faz a requisição à API passando o ID do cliente a ser removido
        // armazena a reposta para saber se o cliente foi ou não removido
        const respostaAPI = await fetch(`${enderecoServidor}${endpointClientes}/remover/${cliente.idCliente}`, {
            method: 'PUT'
        });

        // Se o atributo ok da reposta da API for falso
        // é mostrada uma mensagem de erro para o usuário, e um erro com os detalhes é mostrado nos logs
        if (!respostaAPI.ok) {
            // Mensagem de erro
            alert('Erro ao remover cliente.');

            // Exibe no console um erro com o código de status da resposta e o texto retornado pela API.
            // Isso ajuda a identificar o motivo da falha na requisição.
            console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        }

        // Exibe um alerta de sucesso ao usuário
        alert('Cliente removido com sucesso!');

        // Recarrega a página
        window.location.reload();
    } else {
        // retorna um valor vazio, indicando que o usuário cancelou a ação
        return;
    }
}

/**
 * Envia solicitação à API para buscar infromações de um cliente a partir do ID.
 * Em caso de sucesso, chama a função preencherFormularioAtualizacao passando o objeto recuperado.
 * @returns 
 */
async function buscarCliente() {
    // Captura a parte da URL que contém os parâmetros da query string (ex: ?idCliente=123)
    const queryString = window.location.search;

    // Cria um objeto URLSearchParams para facilitar a leitura dos parâmetros da query string
    const urlParams = new URLSearchParams(queryString);

    // Extrai o valor do parâmetro 'idCliente' da URL
    const idCliente = urlParams.get('idCliente');

    // Inicia um bloco try/catch para tratar possíveis erros durante a requisição
    try {
        // Faz uma requisição HTTP GET para a API, buscando os dados do cliente com o ID especificado
        const respostaAPI = await fetch(`${enderecoServidor}${endpointClientes}/${idCliente}`);

        // Verifica se a resposta da API foi bem-sucedida (status HTTP 200–299)
        if (!respostaAPI.ok) {
            // Exibe um alerta informando que houve erro na busca
            alert('Erro ao buscar cliente.');

            // Exibe no console um erro com o código de status da resposta e o texto retornado pela API.
            // Isso ajuda a identificar o motivo da falha na requisição.
            console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        }

        // Converte o corpo da resposta da API (em JSON) para um objeto JavaScript
        const cliente = await respostaAPI.json();

        // Chama a função preencherFormularioAtualizacao passando o objeto cliente como argumento
        // Essa função irá preencher os campos do formulário com os dados recebidos
        preencherFormularioAtualizacao(cliente);
    } catch (error) {
        // Caso ocorra algum erro na requisição ou no processamento, exibe um alerta ao usuário
        alert('Erro ao buscar informações do cliente.');

        // Exibe o erro completo no console para facilitar o diagnóstico durante o desenvolvimento
        console.error(`Erro ao buscar informações do cliente. ${error}`);

        // Encerra a função retornando vazio
        return;
    }
}

/**
 * Preenche o formulário de atualização com os dados atuais do cliente
 * @param {*} cliente Objeto com as informações do cliente
 */
function preencherFormularioAtualizacao(cliente) {
    // Acessa o campo de ID do cliente no formulário e insere o valor vindo da API
    document.getElementById('id-cliente').value = cliente.idCliente;

    // Acessa o campo de nome do cliente e insere o nome recebido da API
    document.getElementById('nome-cliente').value = cliente.nome;

    // Acessa o campo de CPF e insere o CPF do cliente recebido da API
    document.getElementById('cpf-cliente').value = cliente.cpf;

    // Acessa o campo de telefone e insere o telefone do cliente recebido da API
    document.getElementById('telefone-cliente').value = cliente.telefone;
}

/**
 * Função responsável por enviar os dados atualizados do cliente para a API.
 * Essa função é chamada quando o formulário de edição é enviado.
 * 
 * @param {*} event Evento de envio do formulário (submit)
 * @returns Nada é retornado diretamente, mas a função redireciona ou exibe mensagens conforme o resultado
 */
async function enviarFormularioAtualizacao(event) {
    // Impede que o formulário seja enviado da forma tradicional (recarregando a página)
    event.preventDefault();

    // Cria um objeto cliente com os dados preenchidos no formulário
    const cliente = {
        idCliente: document.getElementById('id-cliente').value, // Captura o valor do campo de ID do cliente
        nome: document.getElementById('nome-cliente').value, // Captura o valor do campo de nome
        cpf: document.getElementById('cpf-cliente').value,  // Captura o valor do campo de CPF
        telefone: document.getElementById('telefone-cliente').value // Captura o valor do campo de telefone
    };

    // Inicia um bloco try/catch para tratar possíveis erros na requisição
    try {
        // Exibe no console a URL que será usada na requisição (útil para testes e depuração)
        console.log(`${enderecoServidor}${endpointClientes}/${cliente.idCliente}`);

        // Envia uma requisição HTTP PUT para a API, atualizando os dados do cliente
        const respostaAPI = await fetch(`${enderecoServidor}${endpointClientes}/${cliente.idCliente}`, {
            method: 'PUT', // método HTTP usado para atualizar dados
            headers: {
                'Content-type': 'application/json' // informa que os dados estão no formato JSON
            },
            body: JSON.stringify(cliente) // transforma o objeto cliente em uma string JSON para envio
        });

        // Verifica se a resposta da API foi bem-sucedida
        if (!respostaAPI.ok) {
            // Exibe um alerta informando que houve erro na atualização
            alert('Erro ao atualizar cliente.');

            // Exibe no console um erro com o código de status da resposta e o texto retornado pela API.
            // Isso ajuda a identificar o motivo da falha na requisição.
            console.error('Erro na requisição:', respostaAPI.status, await respostaAPI.text());
        }

        // Exibe um alerta informando que o cliente foi atualizado com sucesso
        alert('Cliente atualizado com sucesso');

        // Redireciona o usuário para a página de lista de clientes
        window.location.href = '/pages/clientes/lista-clientes.html';
    } catch (error) {
        // Caso ocorra algum erro, exibe uma mensagem no console para ajudar na depuração
        console.error('Erro ao fazer requisição.');
        return;
    }
}