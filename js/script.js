
console.log("Sistema de Controle de Estoque iniciado!");



function recuperarDados(chave) {
    const dados = localStorage.getItem(chave);

    if (dados === null) {
        return [];
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {
        console.error("Erro ao recuperar dados:", erro);
        return [];
    }
}

const produtos = recuperarDados("produtos");
const movimentacoes = recuperarDados("movimentacoes");
const alteracoes = recuperarDados("alteracoes");

let codigoEmEdicao = null;

function salvarProdutos() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

function salvarMovimentacoes() {
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

function salvarAlteracoes() {
    localStorage.setItem("alteracoes", JSON.stringify(alteracoes));
}



const formularioProduto = document.getElementById("form-produto");
const formularioMovimentacao = document.getElementById("form-movimentacao");

const tabelaEstoque = document.getElementById("tabela-estoque");
const tabelaAlteracoes = document.getElementById("tabela-alteracoes");
const tabelaMovimentacoes = document.getElementById("tabela-movimentacoes");

const campoBusca = document.getElementById("input-busca");
const totalProdutos = document.getElementById("total-produtos");

const botaoSalvar = document.getElementById("btn-salvar");

// Evita que dados digitados sejam interpretados como HTML.
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function obterDataHora() {
    return new Date().toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}



function cadastrarProduto(novoProduto) {

    const codigoExiste = produtos.some(
        produto => produto.codigo === novoProduto.codigo
    );

    if (codigoExiste) {
        alert("Erro: este código já está cadastrado!");
        return false;
    }

    produtos.push(novoProduto);

    salvarProdutos();

    console.log("Produto cadastrado:", novoProduto.nome);

    return true;
}


function listarProdutos(lista = produtos) {

    tabelaEstoque.innerHTML = "";

    if (lista.length === 0) {
        tabelaEstoque.innerHTML = `
            <tr>
                <td colspan="7">Nenhum produto encontrado.</td>
            </tr>
        `;
    }

    lista.forEach(produto => {

        const estoqueBaixo =
            produto.quantidade <= produto.estoqueMinimo;

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${escaparHTML(produto.codigo)}</td>

            <td>${escaparHTML(produto.nome)}</td>

            <td>${escaparHTML(produto.categoria || "-")}</td>

            <td class="coluna-numero">
                ${produto.quantidade}
                ${estoqueBaixo ? '<span class="estoque-baixo"> (Baixo)</span>' : ""}
            </td>

            <td class="coluna-numero">${produto.estoqueMinimo}</td>

            <td class="coluna-numero">
                ${formatarPreco(produto.preco)}
            </td>

            <td class="coluna-acoes">
                <button class="btn-editar"
                    data-codigo="${escaparHTML(produto.codigo)}">
                    Editar
                </button>

                <button class="btn-excluir"
                    data-codigo="${escaparHTML(produto.codigo)}">
                    Excluir
                </button>
            </td>
        `;

        tabelaEstoque.appendChild(linha);
    });

    totalProdutos.textContent =
        `Total de produtos cadastrados: ${produtos.length}`;
}



function pesquisarProduto(nomePesquisado) {

    const termo = nomePesquisado.trim().toLowerCase();

    const encontrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.codigo.toLowerCase().includes(termo)
    );

    listarProdutos(encontrados);
}

campoBusca.addEventListener("input", function () {
    pesquisarProduto(this.value);
});



function registrarAlteracao(codigo) {

    alteracoes.unshift({
        data: obterDataHora(),
        codigo: codigo
    });

    salvarAlteracoes();

    listarAlteracoes();
}

function listarAlteracoes() {

    tabelaAlteracoes.innerHTML = "";

    if (alteracoes.length === 0) {
        tabelaAlteracoes.innerHTML = `
            <tr>
                <td colspan="2">Nenhuma alteração registrada.</td>
            </tr>
        `;
        return;
    }

    alteracoes.forEach(alteracao => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${escaparHTML(alteracao.data)}</td>
            <td>${escaparHTML(alteracao.codigo)}</td>
        `;

        tabelaAlteracoes.appendChild(linha);
    });
}



function editarProduto(codigo) {

    const produtoEncontrado = produtos.find(
        produto => produto.codigo === codigo
    );

    if (!produtoEncontrado) {
        alert("Produto não encontrado!");
        return;
    }

    codigoEmEdicao = codigo;

    document.getElementById("prod-codigo").value = produtoEncontrado.codigo;
    document.getElementById("prod-nome").value = produtoEncontrado.nome;
    document.getElementById("prod-categoria").value = produtoEncontrado.categoria;
    document.getElementById("prod-quantidade").value = produtoEncontrado.quantidade;
    document.getElementById("prod-estoque-min").value = produtoEncontrado.estoqueMinimo;
    document.getElementById("prod-preco").value = produtoEncontrado.preco;

    document.getElementById("prod-codigo").disabled = true;

    botaoSalvar.textContent = "Salvar alterações";

    document.getElementById("secao-cadastro").scrollIntoView({
        behavior: "smooth"
    });
}

function atualizarProduto(codigo, novosDados) {

    const indice = produtos.findIndex(
        produto => produto.codigo === codigo
    );

    if (indice === -1) {
        alert("Produto não encontrado!");
        return false;
    }

    produtos[indice] = {
        ...produtos[indice],
        nome: novosDados.nome,
        categoria: novosDados.categoria,
        quantidade: novosDados.quantidade,
        estoqueMinimo: novosDados.estoqueMinimo,
        preco: novosDados.preco
    };

    salvarProdutos();

    registrarAlteracao(codigo);

    console.log("Produto atualizado:", novosDados.nome);

    return true;
}



function excluirProduto(codigo) {

    const indice = produtos.findIndex(
        produto => produto.codigo === codigo
    );

    if (indice === -1) {
        alert("Produto não encontrado!");
        return;
    }

    const nomeExcluido = produtos[indice].nome;

    const confirmacao = confirm(
        `Deseja realmente excluir o produto ${nomeExcluido}?`
    );

    if (!confirmacao) {
        return;
    }

    produtos.splice(indice, 1);

    salvarProdutos();

    listarProdutos();

    console.log("Produto excluído:", nomeExcluido);
}



formularioProduto.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const codigo = document.getElementById("prod-codigo").value
        .trim().toUpperCase();

    const nome = document.getElementById("prod-nome").value.trim();

    const categoria = document.getElementById("prod-categoria").value.trim();

    const quantidade = Number(
        document.getElementById("prod-quantidade").value
    );

    const estoqueMinimo = Number(
        document.getElementById("prod-estoque-min").value
    );

    const preco = Number(
        document.getElementById("prod-preco").value
    );

    

    if (!codigo || !nome) {
        alert("Preencha o código e o nome do produto!");
        return;
    }

    if (
        !Number.isInteger(quantidade) ||
        quantidade < 0 ||
        !Number.isInteger(estoqueMinimo) ||
        estoqueMinimo < 0
    ) {
        alert("Quantidade e estoque mínimo devem ser números inteiros positivos!");
        return;
    }

    if (!Number.isFinite(preco) || preco < 0) {
        alert("Informe um preço válido!");
        return;
    }

    const novoProduto = {
        codigo,
        nome,
        categoria,
        quantidade,
        estoqueMinimo,
        preco
    };

    let sucesso;

    if (codigoEmEdicao !== null) {

        sucesso = atualizarProduto(codigoEmEdicao, novoProduto);

    } else {

        sucesso = cadastrarProduto(novoProduto);
    }

    if (sucesso) {

        formularioProduto.reset();

        codigoEmEdicao = null;

        document.getElementById("prod-codigo").disabled = false;

        botaoSalvar.textContent = "Salvar produto";

        listarProdutos();

    }
});



tabelaEstoque.addEventListener("click", function (evento) {

    const botao = evento.target.closest("button");

    if (!botao) {
        return;
    }

    const codigo = botao.dataset.codigo;

    if (botao.classList.contains("btn-editar")) {
        editarProduto(codigo);
    }

    if (botao.classList.contains("btn-excluir")) {
        excluirProduto(codigo);
    }
});



function movimentarEstoque(codigo, tipo, quantidade) {

    const produto = produtos.find(
        produto => produto.codigo === codigo
    );

    if (!produto) {
        alert("Produto não encontrado!");
        return false;
    }

    if (
        tipo !== "ENTRADA" &&
        tipo !== "SAÍDA"
    ) {
        alert("Tipo de movimentação inválido!");
        return false;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Informe uma quantidade inteira maior que zero!");
        return false;
    }

    if (tipo === "SAÍDA" && quantidade > produto.quantidade) {
        alert("Erro: estoque insuficiente para realizar a saída!");
        return false;
    }

    if (tipo === "ENTRADA") {
        produto.quantidade += quantidade;
    } else {
        produto.quantidade -= quantidade;
    }

    salvarProdutos();

    movimentacoes.unshift({
        data: obterDataHora(),
        codigo: produto.codigo,
        tipo: tipo,
        quantidade: quantidade
    });

    salvarMovimentacoes();

    listarProdutos();
    listarMovimentacoes();

    console.log("Movimentação registrada:", produto.nome);

    alert("Movimentação registrada com sucesso!");

    return true;
}

// ==========================================
// 12. FORMULÁRIO DE MOVIMENTAÇÕES
// ==========================================

formularioMovimentacao.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const codigo = document.getElementById("trans-prod-codigo")
        .value.trim().toUpperCase();

    const tipo = document.getElementById("trans-tipo").value;

    const quantidade = Number(
        document.getElementById("trans-quantidade").value
    );

    const sucesso = movimentarEstoque(
        codigo,
        tipo,
        quantidade
    );

    if (sucesso) {
        formularioMovimentacao.reset();
    }
});



function listarMovimentacoes() {

    tabelaMovimentacoes.innerHTML = "";

    if (movimentacoes.length === 0) {
        tabelaMovimentacoes.innerHTML = `
            <tr>
                <td colspan="4">Nenhuma movimentação registrada.</td>
            </tr>
        `;
        return;
    }

    movimentacoes.forEach(movimentacao => {

        const linha = document.createElement("tr");

        const classe =
            movimentacao.tipo === "ENTRADA"
                ? "texto-entrada"
                : "texto-saida";

        const tipoExibido =
            movimentacao.tipo === "ENTRADA"
                ? "Entrada"
                : "Saída";

        linha.innerHTML = `
            <td>${escaparHTML(movimentacao.data)}</td>

            <td>${escaparHTML(movimentacao.codigo)}</td>

            <td>
                <span class="${classe}">${tipoExibido}</span>
            </td>

            <td class="coluna-numero">
                ${movimentacao.quantidade}
            </td>
        `;

        tabelaMovimentacoes.appendChild(linha);
    });
}



formularioProduto.addEventListener("reset", function () {

    codigoEmEdicao = null;

    document.getElementById("prod-codigo").disabled = false;

    botaoSalvar.textContent = "Salvar produto";
});



listarProdutos();
listarAlteracoes();
listarMovimentacoes();

console.log("Sistema pronto para utilização!");
