const API_KEY = "99717699325a15202c333342b7ca4be6";

const nome = document.getElementById("nome");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const icon = document.getElementById("icon");
const vento = document.getElementById("vento");
const umidade = document.getElementById("umidade");

const erro = document.getElementById("erro");
const loading = document.getElementById("loading");
const input = document.getElementById("cidade");
const btn = document.getElementById("buscar");
const localBtn = document.getElementById("local");

// 🌐 BUSCAR POR CIDADE
async function buscarCidade(cidade) {
    if (!cidade) return;

    erro.textContent = "";
    loading.style.display = "block";

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${API_KEY}&units=metric&lang=pt_br`
        );

        const data = await res.json();

        if (data.cod != 200) {
            erro.textContent = "Cidade não encontrada 😢";
            return;
        }

        mostrarClima(data);

    } catch (e) {
        erro.textContent = "Erro ao buscar dados 😢";
    } finally {
        loading.style.display = "none";
    }
}

// 📍 GEOLOCALIZAÇÃO
function buscarLocalizacao() {
    erro.textContent = "";
    loading.style.display = "block";

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
                );

                const data = await res.json();
                mostrarClima(data);

            } catch {
                erro.textContent = "Erro ao obter localização";
            } finally {
                loading.style.display = "none";
            }
        },
        () => {
            erro.textContent = "Permissão de localização negada";
            loading.style.display = "none";
        }
    );
}

// 🎨 MOSTRAR NA TELA
function mostrarClima(data) {
    nome.textContent = data.name;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    desc.textContent = data.weather[0].description;
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    vento.textContent = `💨 ${data.wind.speed} km/h`;
    umidade.textContent = `💧 ${data.main.humidity}%`;
}

// EVENTOS
btn.onclick = () => buscarCidade(input.value);
localBtn.onclick = buscarLocalizacao();

input.addEventListener("keypress", e => {
    if (e.key === "Enter") btn.click();
});