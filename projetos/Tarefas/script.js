const input = document.getElementById("input-tarefa");
const btn = document.getElementById("btn-add");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const limparBtn = document.getElementById("limpar");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtro = "all";

// SALVAR
function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// CONTADOR
function atualizarContador() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.done).length;
    contador.textContent = `${concluidas}/${total} concluídas`;
}

// RENDER
function render() {
    lista.innerHTML = "";

    tarefas
        .filter(t => {
            if (filtro === "active") return !t.done;
            if (filtro === "done") return t.done;
            return true;
        })
        .forEach((tarefa, index) => {

            const li = document.createElement("li");
            li.setAttribute("draggable", true);
            li.dataset.index = index;

            li.innerHTML = `
                <span class="${tarefa.done ? 'done' : ''}">
                    ${tarefa.texto}
                </span>

                <div class="acoes">
                    <button onclick="toggle(${index})">✔</button>
                    <button onclick="editar(${index})">✏️</button>
                    <button onclick="remover(${index})">🗑</button>
                </div>
            `;

            // animação ao aparecer
            li.classList.add("fade-in");

            // DRAG EVENTS
            li.addEventListener("dragstart", dragStart);
            li.addEventListener("dragover", dragOver);
            li.addEventListener("drop", drop);

            lista.appendChild(li);
        });

    atualizarContador();
}

// ADICIONAR
btn.onclick = () => {
    if (!input.value.trim()) return;

    tarefas.push({
        texto: input.value,
        done: false
    });

    input.value = "";
    salvar();
    render();
};

// EDITAR
function editar(index) {
    const novoTexto = prompt("Editar tarefa:", tarefas[index].texto);
    if (novoTexto !== null && novoTexto.trim() !== "") {
        tarefas[index].texto = novoTexto;
        salvar();
        render();
    }
}

// TOGGLE
function toggle(index) {
    tarefas[index].done = !tarefas[index].done;
    salvar();
    render();
}

// REMOVER
function remover(index) {
    tarefas.splice(index, 1);
    salvar();
    render();
}

// LIMPAR
limparBtn.onclick = () => {
    tarefas = tarefas.filter(t => !t.done);
    salvar();
    render();
};

// FILTROS
document.querySelectorAll(".filtros button").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".filtros button")
            .forEach(b => b.classList.remove("ativo"));

        btn.classList.add("ativo");
        filtro = btn.dataset.filter;
        render();
    };
});

// ENTER
input.addEventListener("keypress", e => {
    if (e.key === "Enter") btn.click();
});


// ===== DRAG & DROP =====

let dragIndex;

function dragStart(e) {
    dragIndex = e.target.dataset.index;
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    const dropIndex = e.target.closest("li").dataset.index;

    const item = tarefas.splice(dragIndex, 1)[0];
    tarefas.splice(dropIndex, 0, item);

    salvar();
    render();
}

// INICIAR
render();