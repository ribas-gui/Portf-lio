const produtos = [
    { id: 1, nome: "Notebook", preco: 3500, img: "https://picsum.photos/200?1" },
    { id: 2, nome: "Mouse Gamer", preco: 150, img: "https://picsum.photos/200?2" },
    { id: 3, nome: "Teclado Mecânico", preco: 300, img: "https://picsum.photos/200?3" }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const container = document.getElementById("produtos");
const lista = document.getElementById("lista-carrinho");
const totalEl = document.getElementById("total");
const contador = document.getElementById("contador");

const busca = document.getElementById("busca");
const filtro = document.getElementById("filtro");

const carrinhoBox = document.getElementById("carrinho");
const checkout = document.getElementById("checkout");

// 🔍 RENDER PRODUTOS
function renderProdutos(listaProdutos = produtos) {
    container.innerHTML = "";

    listaProdutos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img src="${p.img}">
            <h3>${p.nome}</h3>
            <p>R$ ${p.preco}</p>
            <button onclick="addCarrinho(${p.id})">Adicionar</button>
        `;

        container.appendChild(div);
    });
}

// 🔍 BUSCA
busca.oninput = () => {
    const termo = busca.value.toLowerCase();

    const filtrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termo)
    );

    renderProdutos(filtrados);
};

// 🔽 FILTRO
filtro.onchange = () => {
    let listaFiltrada = [...produtos];

    if (filtro.value === "caro") {
        listaFiltrada.sort((a, b) => b.preco - a.preco);
    }

    if (filtro.value === "barato") {
        listaFiltrada.sort((a, b) => a.preco - b.preco);
    }

    renderProdutos(listaFiltrada);
};

// 🛒 ADD COM QUANTIDADE
function addCarrinho(id) {
    const item = carrinho.find(p => p.id === id);

    if (item) {
        item.qtd++;
    } else {
        const produto = produtos.find(p => p.id === id);
        carrinho.push({ ...produto, qtd: 1 });
    }

    salvar();
    renderCarrinho();
}

// ➖ REMOVER
function remover(index) {
    carrinho.splice(index, 1);
    salvar();
    renderCarrinho();
}

// ➕➖ QUANTIDADE
function alterarQtd(index, tipo) {
    if (tipo === "mais") carrinho[index].qtd++;
    if (tipo === "menos") carrinho[index].qtd--;

    if (carrinho[index].qtd <= 0) carrinho.splice(index, 1);

    salvar();
    renderCarrinho();
}

// 🛒 RENDER
function renderCarrinho() {
    lista.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${item.nome} - R$ ${item.preco}
            <div class="qtd">
                <button onclick="alterarQtd(${index}, 'menos')">-</button>
                ${item.qtd}
                <button onclick="alterarQtd(${index}, 'mais')">+</button>
            </div>
            <button onclick="remover(${index})">❌</button>
        `;

        lista.appendChild(li);

        total += item.preco * item.qtd;
    });

    totalEl.textContent = total.toFixed(2);
    contador.textContent = carrinho.length;
}

// 💾 SALVAR
function salvar() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// 🛒 ABRIR
document.getElementById("carrinho-btn").onclick = () => {
    carrinhoBox.classList.add("ativo");
};

// ❌ FECHAR
function fecharCarrinho() {
    carrinhoBox.classList.remove("ativo");
}

// 💳 CHECKOUT
document.getElementById("checkoutBtn").onclick = () => {
    checkout.style.display = "flex";
};

document.getElementById("pagarBtn").onclick = () => {
    alert("Compra realizada com sucesso!");
    carrinho = [];
    salvar();
    renderCarrinho();
    checkout.style.display = "none";
};

// INICIAR
renderProdutos();
renderCarrinho();