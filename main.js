// Define uma constante para a chave usada para armazenar dados no localStorage
const KEY_BD = '@usuariosestudo';

// Cria um objeto que armazena os registros de usuários, com uma propriedade para o último ID gerado e um array para os usuários
var listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: []
};

// Inicializa uma variável para o filtro de pesquisa
var FILTRO = '';

// Função para gravar os registros no localStorage
function gravarBD() {
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros));
}

// Função para ler os registros do localStorage e atualizar a lista de registros
function lerBD() {
    const data = localStorage.getItem(KEY_BD);
    if (data) {
        listaRegistros = JSON.parse(data);
    }
    // Chama a função para desenhar os registros na interface
    desenhar();
}

// Função para definir o valor do filtro de pesquisa e chamar a função de desenho
function pesquisar(value) {
    FILTRO = value;
    desenhar();
}

// Função para visualizar detalhes de um usuário ou editar um usuário existente
function vizualizar(pagina, novo = false, id = null) {
    // Define a página a ser exibida
    document.body.setAttribute('page', pagina);
    // Verifica se a página é a de cadastro
    if (pagina === 'cadastro') {
        // Verifica se foi passado um ID de usuário para editar
        if (id) {
            // Encontra o usuário na lista de registros
            const usuario = listaRegistros.usuarios.find(usuario => usuario.id == id);
            // Preenche os campos do formulário com os dados do usuário encontrado
            if (usuario) {
                document.getElementById('id').value = usuario.id;
                document.getElementById('nome').value = usuario.nome;
                document.getElementById('cpf').value = usuario.cpf;
                document.getElementById('dataNascimento').value = usuario.dataNascimento;
                document.getElementById('estadoCivil').value = usuario.estadoCivil;
                document.getElementById('rendaMensal').value = usuario.rendaMensal;
                document.getElementById('logradouro').value = usuario.logradouro;
                document.getElementById('numero').value = usuario.numero;
                document.getElementById('complemento').value = usuario.complemento;
                document.getElementById('estado').value = usuario.estado;
                document.getElementById('cidade').value = usuario.cidade;
                document.getElementById('fone').value = usuario.fone;
            }
        }
        // Define o foco para o campo de nome do formulário
        document.getElementById('nome').focus();
    } else {
        // Esconde o formulário de cadastro
        document.getElementById('cadastroRegistro').style.display = 'none';
    }
}

// Função para desenhar os registros na interface
function desenhar() {
    // Obtém a referência ao corpo da tabela
    const tbody = document.getElementById('listaRegistrosBody');
    if (tbody) {
        // Obtém os registros de usuários
        var data = listaRegistros.usuarios;
        // Filtra os registros com base no filtro de pesquisa
        if (FILTRO.trim()) {
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g, '.*')}/i`);
            data = data.filter(usuario => {
                return expReg.test(usuario.id) ||
                    expReg.test(usuario.nome) ||
                    expReg.test(usuario.cpf) ||
                    expReg.test(usuario.dataNascimento) ||
                    expReg.test(usuario.estadoCivil) ||
                    expReg.test(usuario.rendaMensal) ||
                    expReg.test(usuario.logradouro) ||
                    expReg.test(usuario.numero) ||
                    expReg.test(usuario.complemento) ||
                    expReg.test(usuario.estado) ||
                    expReg.test(usuario.cidade);
            });
        }
        // Ordena os registros por nome
        data = data.sort((a, b) => {
            return a.nome < b.nome ? 1 : 1;
        })
        // Converte os registros em HTML e os adiciona ao corpo da tabela
        .map(usuario => {
            return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.cpf}</td>
                        <td>${usuario.dataNascimento}</td>
                        <td>${usuario.estadoCivil}</td>
                        <td>${usuario.rendaMensal}</td>
                        <td>${usuario.logradouro}</td>
                        <td>${usuario.numero}</td>
                        <td>${usuario.complemento}</td>
                        <td>${usuario.estado}</td>
                        <td>${usuario.cidade}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`;
        });
        // Atualiza o conteúdo do corpo da tabela com os registros desenhados
        tbody.innerHTML = data.join('');
    }
}

// Função para submeter o formulário de cadastro
function submeter(e) {
    e.preventDefault();
    // Obtém os valores dos campos do formulário
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const estadoCivil = document.getElementById('estadoCivil').value;
    const rendaMensal = document.getElementById('rendaMensal').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;

    // Verifica se existe um ID para determinar se é uma edição ou inserção
    if (id) {
        editUsuario(id, nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade);
    } else {
        insertUsuario(nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade);
    }
    // Desenha os registros na interface e exibe a lista de registros
    desenhar();
    vizualizar('lista');
}

// Função para inserir um novo usuário na lista de registros
function insertUsuario(nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade) {
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade
    });
    // Grava os registros atualizados no localStorage
    gravarBD();
}

// Função para editar os dados de um usuário na lista de registros
function editUsuario(id, nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade) {
    var usuario = listaRegistros.usuarios.find(usuario => usuario.id == id);
    usuario.nome = nome;
    usuario.cpf = cpf;
    usuario.dataNascimento = dataNascimento;
    usuario.estadoCivil = estadoCivil;
    usuario.rendaMensal = rendaMensal;
    usuario.logradouro = logradouro;
    usuario.numero = numero;
    usuario.complemento = complemento;
    usuario.estado = estado;
    usuario.cidade = cidade;
    // Grava os registros atualizados no localStorage
    gravarBD();
}

// Função para deletar um usuário da lista de registros
function deletarUsuario(id) {
    const index = listaRegistros.usuarios.findIndex(usuario => usuario.id === id);
    if (index !== -1) {
        listaRegistros.usuarios.splice(index, 1);
        // Grava os registros atualizados no localStorage
        gravarBD();
        // Desenha os registros na interface
        desenhar();
    }
}

// Função para perguntar ao usuário se deseja realmente deletar um usuário
function perguntarSeDeleta(id) {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
        deletarUsuario(id);
    }
}

// Adiciona um listener para o evento de carregamento da página
window.addEventListener('load', () => {
    // Lê os registros do localStorage ao carregar a página
    lerBD();
    // Adiciona um listener para o evento de submissão do formulário de cadastro
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter);
    // Adiciona um listener para o evento de digitação no campo de pesquisa
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value);
    });
});
