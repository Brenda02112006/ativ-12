const KEY_BD = '@usuariosestudo'

var listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: []
}
var FILTRO = ''

function gravarBD() {
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerBD() {
    const data = localStorage.getItem(KEY_BD)
    if (data) {
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(value) {
    FILTRO = value;
    desenhar()
}

function limparEdicao() {
    document.getElementById('id').value = "";
    document.getElementById('nome').value = "";
    document.getElementById('cpf').value = "";
    document.getElementById('dataNascimento').value = "";
    document.getElementById('estadoCivil').value = "";
    document.getElementById('rendaMensal').value = "";
    document.getElementById('logradouro').value = "";
    document.getElementById('numero').value = "";
    document.getElementById('complemento').value = "";
    document.getElementById('estado').value = "";
    document.getElementById('cidade').value = "";
}

function vizualizar(pagina, novo = false, id = null) {
    document.body.setAttribute('page', pagina);
    if (pagina === 'cadastro') {
        document.getElementById('cadastroRegistro').style.display = 'block';
        if (novo) {
            limparEdicao();
            document.getElementById('id').value = '';
        }
        if (id) {
            const usuario = listaRegistros.usuarios.find(usuario => usuario.id == id); if (usuario) {
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
            }
        }
        document.getElementById('nome').focus();
    } else {
        document.getElementById('cadastroRegistro').style.display = 'none';
    }
}

function desenhar() {
    const tbody = document.getElementById('listaRegistrosBody')
    if (tbody) {
        var data = listaRegistros.usuarios;
        if (FILTRO.trim()) {
            const expReg = new RegExp(FILTRO.trim().replace(/[^\d\w]+/g, '.*'), 'i');
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
                    expReg.test(usuario.cidade)
            })
        }
        data = data
        .sort((a, b) => {
            return a.nome < b.nome ? 1 : 1;
        })
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
                        <button class='btn btn-editar' onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                        <button class='btn btn-deletar' onclick='deletarUsuario(${usuario.id})'>Deletar</button>
                    </td>
                </tr>`
        })
        tbody.innerHTML = data.join('')
    }
}


function submeter(e) {
    e.preventDefault();
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

    if (id) {
        editUsuario(id, nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade);
    } else {
        insertUsuario(nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade);
    }
    desenhar();
    vizualizar('lista');
}


function insertUsuario(nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade) {
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, cpf, dataNascimento, estadoCivil, rendaMensal, logradouro, numero, complemento, estado, cidade
    });
    gravarBD();
}

function deletarUsuario(id) {
    const idUsuario = listaRegistros.usuarios.findIndex(usuario => usuario.id === id)
    listaRegistros.usuarios.splice(idUsuario, 1);
    desenhar();
    gravarBD();
}

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
    gravarBD();
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})