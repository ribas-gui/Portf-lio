const API_KEY = "ec01912385bf3eb2427fc4d25e250002";
const BASE_URL = "https://api.themoviedb.org/3";

const voltarBtn = document.getElementById("voltar");

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const main = document.querySelector("main");
const buscaInput = document.getElementById("busca");

// 🔍 BUSCA
buscaInput.addEventListener("input", async () => {
    const query = buscaInput.value;

    if (query.length < 3) {
        voltarBtn.style.display = "none";
        carregarCategorias();
        return;
    }

    voltarBtn.style.display = "block";

    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`);
    const data = await res.json();

    main.innerHTML = "";
    criarLinha("Resultados", data.results);
});

// 🎬 CATEGORIAS
const categorias = [
    { nome: "Populares", endpoint: "/movie/popular" },
    { nome: "Top Rated", endpoint: "/movie/top_rated" }
];

async function carregarCategorias() {
    main.innerHTML = "";

    for (let categoria of categorias) {
        const res = await fetch(`${BASE_URL}${categoria.endpoint}?api_key=${API_KEY}&language=pt-BR`);
        const data = await res.json();

        criarLinha(categoria.nome, data.results);
    }

    mostrarFavoritos();
}

function criarLinha(titulo, filmes) {
    const section = document.createElement("section");

    section.innerHTML = `
        <h2>${titulo}</h2>
        <div class="carrossel"></div>
    `;

    const carrossel = section.querySelector(".carrossel");

    filmes.forEach(filme => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300${filme.poster_path}">
            <div class="overlay">
                <button onclick="toggleFavorito(${filme.id})">
                    ${favoritos.includes(filme.id) ? "❤️" : "🤍"}
                </button>
            </div>
        `;

        card.addEventListener("click", () => abrirModal(filme));

        carrossel.appendChild(card);
    });

    main.appendChild(section);
}

//
// ❤️ FAVORITOS
//
function toggleFavorito(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
    } else {
        favoritos.push(id);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    carregarCategorias();
}

async function mostrarFavoritos() {
    if (favoritos.length === 0) return;

    const filmes = [];

    for (let id of favoritos) {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
        const data = await res.json();
        filmes.push(data);
    }

    criarLinha("Favoritos", filmes);
}

//
// 🎥 MODAL + TRAILER
//
const modal = document.createElement("div");
modal.classList.add("modal");

modal.innerHTML = `
    <div class="modal-content">
        <span class="fechar">&times;</span>
        <h2 id="titulo"></h2>
        <p id="desc"></p>
        <iframe id="trailer" frameborder="0" allowfullscreen></iframe>
    </div>
`;

document.body.appendChild(modal);

async function abrirModal(filme) {
    document.getElementById("titulo").textContent = filme.title;
    document.getElementById("desc").textContent = filme.overview;

    // pegar trailer
    const res = await fetch(`${BASE_URL}/movie/${filme.id}/videos?api_key=${API_KEY}`);
    const data = await res.json();

    const trailer = data.results.find(v => v.type === "Trailer");

    if (trailer) {
        document.getElementById("trailer").src =
            `https://www.youtube.com/embed/${trailer.key}`;
    }

    modal.style.display = "flex";
}

// fechar modal
modal.querySelector(".fechar").onclick = () => {
    modal.style.display = "none";
    document.getElementById("trailer").src = "";
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.getElementById("trailer").src = "";
    }
};

voltarBtn.onclick = () => {
    buscaInput.value = "";
    voltarBtn.style.display = "none";
    carregarCategorias();
};

// INICIAR
carregarCategorias();