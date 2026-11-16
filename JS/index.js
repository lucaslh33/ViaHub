const botaoAbrir = document.getElementById("abrir_modal");
const modalViagem = document.getElementById("modal_viagem");
const listaViagens = document.getElementById("lista_viagens");
const formViagem = document.getElementById("form_viagem");
formViagem.addEventListener("submit", cadastrarViagem);

const modalDetalhes = document.getElementById("modal_detalhes");
const tituloDetalhes = document.getElementById("titulo_detalhes");
const saidaDetalhes = document.getElementById("saida_detalhes");
const botaoAdicionarParada = document.getElementById("adicionar_parada");
const paradasExtras = document.getElementById("paradas_extras");
const mapaPoltronas = document.getElementById("mapa_poltronas");

let viagens = JSON.parse(localStorage.getItem("viahub_viagens") ?? "[]");



botaoAbrir.addEventListener("click", () =>{
    modalViagem.showModal();
})

botaoAdicionarParada.addEventListener("click", () =>{
    const campo = document.createElement("label");
    campo.className = "campo";
    campo.textContent= `Parada ${paradasExtras.children.length + 2}`;

    const input = document.createElement("input");
    input.type = "text";
    input.name = "parada";

    campo.append(input);
    paradasExtras.append(campo);
    input.focus();
});


function cadastrarViagem(evento){
    evento.preventDefault();

    const viagem = {
        destino: document.getElementById("destino").value,
        embarque: document.getElementById("embarque").value,
        paradas: new FormData(formViagem).getAll("parada").map(parada => parada.trim()).filter(Boolean),
        saida: document.getElementById("data_viagem").value,
        termino: document.getElementById("termino_viagem").value,
        vagas: Number(document.getElementById("qtde_poltrona").value),
        status: "agendada"
    };

    const terminoEm = Date.parse(viagem.termino);

    if (terminoEm <= Date.parse(viagem.saida)){
        alert("o término da viagem deve ser depois da saída.");
        return;
    }

    if (terminoEm <= Date.now()){
        alert("O término da viagem deve estar no futuro.");
        return;
    }

    viagens.push(viagem);
    localStorage.setItem("viahub_viagens", JSON.stringify(viagens));
    mostrarViagens();

    formViagem.reset();
    paradasExtras.replaceChildren();
    modalViagem.close();
    
}

function mostrarViagens(){
    const disponiveis = viagens.filter(viagem =>
        viagem.status === "agendada" && viagem.vagas > 0
    );

    listaViagens.replaceChildren();

    if (disponiveis.length === 0) {
        listaViagens.textContent = "Nenhuma viagem disponível no momento.";
        return;
    }

    for (const viagem of disponiveis) {
        const card = document.createElement("article");
        card.className = "card_viagem";

        const destino = document.createElement("h3");
        destino.textContent = viagem.destino;

        const saidaCard = document.createElement("p");
        saidaCard.textContent = `Saída em ${formatarSaida(viagem.saida)}`;

        const vagasCard = document.createElement("p");
        vagasCard.textContent = viagem.vagas === 1 ? "1 vaga disponível" : `${viagem.vagas} vagas disponíveis`;

        const detalhesViagem = document.createElement("button");
        detalhesViagem.type = "button";
        detalhesViagem.textContent = "Detalhes da viagem";

        detalhesViagem.addEventListener("click", () =>{
            tituloDetalhes.textContent = `Viagem para ${viagem.destino}`;
            saidaDetalhes.textContent = `Saída em ${formatarSaida(viagem.saida)}`;
            mostrarPoltronas(viagem.vagas);
            modalDetalhes.showModal();
        });

        const botaoCancelar = document.createElement("button");
        botaoCancelar.type="button";
        botaoCancelar.textContent = "Cancelar viagem";

        botaoCancelar.addEventListener("click", () => {
            const confirmou = confirm(`Cancelar a viagem para ${viagem.destino}?`);

            if (!confirmou) return;

            viagens = viagens.filter(item => item !== viagem);
            localStorage.setItem("viahub_viagens", JSON.stringify(viagens));
            mostrarViagens();
        })
        
        card.append(destino, saidaCard, vagasCard, detalhesViagem, botaoCancelar);
        listaViagens.append(card);
        
    }
}

function formatarSaida(valor){
    const saida = new Date(valor);
    const data = saida.toLocaleDateString("pt-BR", { dateStyle: "long"});
    const hora = saida.toLocaleTimeString("pt-BR", { timeStyle: "short"});

    return `${data} às ${hora}`;
}

function mostrarPoltronas(quantidade){
    mapaPoltronas.replaceChildren();

    const colunas =[1, 2, 4, 5];

    for (let numero = 1; numero <= quantidade; numero++){
        const poltrona = document.createElement("li");
        poltrona.className = "poltrona";
        poltrona.textContent = String(numero).padStart(2, "0");
        poltrona.style.gridColumn = colunas[(numero - 1) % 4];
        
        mapaPoltronas.append(poltrona);
    }
}

function removerViagensEncerradas(){
    const agora = Date.now();

    const restantes = viagens.filter(viagem => {
        const terminoEm = Date.parse(viagem.termino);
        return !Number.isFinite(terminoEm) || terminoEm > agora;
    });

    if (restantes.length === viagens.length) return;

    viagens = restantes;
    localStorage.setItem("viahub_viagens", JSON.stringify(viagens));
    mostrarViagens();
}

removerViagensEncerradas();
mostrarViagens();

setInterval(removerViagensEncerradas, 3_000);