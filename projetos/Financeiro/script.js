const lista = document.getElementById("lista");
const saldoEl = document.getElementById("saldo");
const entradaEl = document.getElementById("entrada");
const saidaEl = document.getElementById("saida");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "entrada";

const ctx = document.getElementById("grafico").getContext("2d");
let chart;

// FORMATO COM VÍRGULA
function formatarValor(valor) {
    return parseFloat(valor.replace(",", "."));
}

// SALVAR
function salvar() {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

// RENDER
function render() {
    lista.innerHTML = "";

    let total = 0;
    let entrada = 0;
    let saida = 0;

    const filtro = document.getElementById("filtroData").value;

    let filtradas = transacoes;

    if (filtro) {
        filtradas = transacoes.filter(t => t.data.startsWith(filtro));
    }

    filtradas.forEach((t, index) => {
        const li = document.createElement("li");

        li.classList.add(t.valor >= 0 ? "positivo" : "negativo");

        li.innerHTML = `
            <strong>${t.descricao}</strong>
            <span>${t.data}</span>
            <span>R$ ${t.valor.toFixed(2)}</span>
            <button onclick="remover(${index})">🗑</button>
        `;

        lista.appendChild(li);

        total += t.valor;
        if (t.valor >= 0) entrada += t.valor;
        else saida += t.valor;
    });

    saldoEl.textContent = `R$ ${total.toFixed(2)}`;
    entradaEl.textContent = `R$ ${entrada.toFixed(2)}`;
    saidaEl.textContent = `R$ ${saida.toFixed(2)}`;

    atualizarGrafico(entrada, Math.abs(saida));
}

// GRÁFICO
function atualizarGrafico(entrada, saida) {
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Entradas", "Saídas"],
            datasets: [{
                data: [entrada, saida],
                backgroundColor: [
                    "#00ff88", // entrada (igual botão)
                    "#ff4d4d"  // saída (igual botão)
                ],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            }
        }
    });
}

// ADICIONAR
function adicionar(tipo) {
    const descricao = document.getElementById("descricao").value;
    const valorInput = document.getElementById("valor").value;
    const data = document.getElementById("data").value;

    if (!descricao || !valorInput || !data) return;

    let valor = formatarValor(valorInput);

    if (tipo === "saida") valor = -Math.abs(valor);

    transacoes.push({ descricao, valor, data });

    salvar();
    render();

    document.getElementById("form").reset();
}

// BOTÕES
document.getElementById("entradaBtn").onclick = () => adicionar("entrada");
document.getElementById("saidaBtn").onclick = () => adicionar("saida");

// REMOVER
function remover(index) {
    transacoes.splice(index, 1);
    salvar();
    render();
}

// FILTRO
document.getElementById("filtroData").onchange = render;

// INICIAR
render();