const botaoAbrir = document.getElementById("abrir_modal");
const modalViagem = document.getElementById("modal_viagem");

botaoAbrir.addEventListener("click", () =>{
    modalViagem.showModal();
})

const listaViagens = document.getElementById("lista_viagens");
const formViagem = document.getElementById("fomr_viagem");
formViagem.addEventListener("submit", cadastrarViagem);

function cadastrarViagem(evento){
    evento.preventDefault();

    const destino = document.getElementById("destino").value;
    console.log(destino);
}

const viagens = [];


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

        const detalhes = document.createElement("p");
        detalhes.textContent = `Saída ${viagem.saida} · Vagas: ${viagem.vagas}`;

        card.append(destino, detalhes);
        listaViagens.append(card);
    }
}

mostrarViagens();