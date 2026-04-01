const display = document.getElementById("display");

let atual = "";

// ADICIONAR NÚMERO
function numero(num) {
    if (display.textContent === "0") {
        display.textContent = num;
    } else {
        display.textContent += num;
    }
}

// OPERADOR
function operador(op) {
    display.textContent += op;
}

// LIMPAR
function limpar() {
    display.textContent = "0";
}

// APAGAR
function apagar() {
    display.textContent = display.textContent.slice(0, -1) || "0";
}

// CALCULAR
function calcular() {
    try {
        let resultado = eval(display.textContent);
        display.textContent = resultado;
    } catch {
        display.textContent = "Erro";
    }
}

// TECLADO
document.addEventListener("keydown", (e) => {
    if (!isNaN(e.key) || e.key === ".") numero(e.key);
    if (["+", "-", "*", "/"].includes(e.key)) operador(e.key);
    if (e.key === "Enter") calcular();
    if (e.key === "Backspace") apagar();
    if (e.key === "Escape") limpar();
});