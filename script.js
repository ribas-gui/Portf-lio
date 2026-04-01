const projetos = [
    {
        nome: "Calculadora",
        descricao: "Calculadora funcional",
        link: "projetos/Calculadora/index.html",
        codigo: "https://github.com/ribas-gui/calculadora.js",
        imagem: "img/Calculadora.png"
    },
    {
        nome: "Dashboard de Tarefas",
        descricao: "Lista de Tarefas",
        link: "projetos/Tarefas/index.html",
        codigo: "https://github.com/ribas-gui/Dashboard-de-Tarefas",
        imagem: "img/Tarefas.png"
    },
    {
        nome: "Streaming de Filmes",
        descricao: "Catálogo de filmes simulando um serviço de streaming, contendo imagem, descrição e trailer do filme.",
        link: "projetos/Streaming/index.html",
        codigo: "https://github.com/ribas-gui/Site-Streaming",
        imagem: "img/Streaming.png"
    },
    {
        nome: "App de Clima",
        descricao: "Consulta do clima de qualquer lugar do mundo.",
        link: "projetos/Clima/index.html",
        codigo: "https://github.com/ribas-gui/App-de-Clima",
        imagem: "img/Clima.png"
    },
    {
        nome: "Controle Financeiro",
        descricao: "Marca entradas e saídas do seu dinheiro e mostra o gráfico filtrado por mês.",
        link: "projetos/Financeiro/index.html",
        codigo: "https://github.com/ribas-gui/Controle-Financeiro",
        imagem: "img/financeiro.png"
    },
    {
        nome: "Mini-Ecommerce",
        descricao: "Site de compras (imagens meramente ilustrativas).",
        link: "projetos/E-commerce/index.html",
        codigo: "https://github.com/ribas-gui/Loja-E-Commerce",
        imagem: "img/ecommerce.png"
    }

];

const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("ativo");
});

document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("ativo");
    });
});

const texto = "Desenvolvedor Front-End em formação";
const elemento = document.getElementById("texto-digitando");

let i = 0;

function digitar() {
    if (i < texto.length) {
        elemento.innerHTML += texto.charAt(i);
        i++;
        setTimeout(digitar, 50);
    }
}

digitar();

const container = document.getElementById("lista-projetos");

projetos.forEach(projeto => {
    const card = document.createElement("div");
    card.classList.add("card-projeto");

    card.innerHTML = `
        <img src="${projeto.imagem}" alt="${projeto.nome}">

        <div class="conteudo">
            <h3>${projeto.nome}</h3>
            <p>${projeto.descricao}</p>

            <div class="techs">
                <span>HTML</span>
                <span>CSS</span>
                <span>JS</span>
            </div>

            <div class="botoes">
                <a href="${projeto.link}" target="_blank" class="btn">Ver Projeto</a>
                <a href="${projeto.codigo}" target="_blank" class="btn-outline">Código</a>
            </div>
        </div>
    `;

    // Clique no card abre modal
    card.addEventListener("click", (e) => {
        // evita conflito com clique nos botões
        if (e.target.tagName !== "A") {
            abrirModal(projeto);
        }
    });

    container.appendChild(card);
});

// MODAL
const modal = document.getElementById("modal");
const titulo = document.getElementById("modal-titulo");
const descricao = document.getElementById("modal-descricao");
const link = document.getElementById("modal-link");
const codigo = document.getElementById("modal-codigo");
const fechar = document.getElementById("fechar");

function abrirModal(projeto) {
    titulo.textContent = projeto.nome;
    descricao.textContent = projeto.descricao;
    link.href = projeto.link;
    codigo.href = projeto.codigo;
    modal.style.display = "flex";
}

fechar.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
};

const links = document.querySelectorAll("nav a");

links.forEach(link => {
    link.addEventListener("click", () => {
        const id = link.getAttribute("href");
        const secao = document.querySelector(id);

        // remove de todas
        document.querySelectorAll("section").forEach(s => {
            s.classList.remove("section-ativa");
        });

        // adiciona efeito
        setTimeout(() => {
            secao.classList.add("section-ativa");
        }, 300);

        // remove depois
        setTimeout(() => {
            secao.classList.remove("section-ativa");
        }, 1000);
    });
});

// FLIP NO TOQUE (mobile)
document.querySelectorAll(".flip-card").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("ativo");
    });
});


// ANIMAÇÃO AO ROLAR
const items = document.querySelectorAll(".timeline-item");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

items.forEach(item => observer.observe(item));

