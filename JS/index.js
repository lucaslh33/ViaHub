const botaoAbrir = document.getElementById("abrir_modal");
const modalViagem = document.getElementById("modal_viagem");
const listaViagens = document.getElementById("lista_viagens");
const formViagem = document.getElementById("form_viagem");
formViagem.addEventListener("submit", cadastrarViagem);

const painelDetalhes = document.getElementById("painel_detalhes");
const painelLista = document.getElementById("painel_lista");
const botaoVoltar = document.getElementById("voltar_viagens");
const botaoCancelarViagem = document.getElementById("cancelar_viagem");
let viagemAberta = null;
const tituloDetalhes = document.getElementById("titulo_detalhes");
const saidaDetalhes = document.getElementById("saida_detalhes");
const botaoAdicionarParada = document.getElementById("adicionar_parada");
const paradasExtras = document.getElementById("paradas_extras");
const mapaPoltronas = document.getElementById("mapa_poltronas");

let viagens = JSON.parse(localStorage.getItem("viahub_viagens") ?? "[]");

botaoAbrir.addEventListener("click", () => {
  modalViagem.showModal();
});

botaoAdicionarParada.addEventListener("click", () => {
  const campo = document.createElement("label");
  campo.className = "campo";
  campo.textContent = `Parada ${paradasExtras.children.length + 2}`;

  const input = document.createElement("input");
  input.type = "text";
  input.name = "parada";

  campo.append(input);
  paradasExtras.append(campo);
  input.focus();
});

function cadastrarViagem(evento) {
  evento.preventDefault();

  const campoPreco = document.getElementById("preco_viagem");

  const viagem = {
    destino: document.getElementById("destino").value,
    embarque: document.getElementById("embarque").value,
    paradas: new FormData(formViagem)
      .getAll("parada")
      .map((parada) => parada.trim())
      .filter(Boolean),
    saida: document.getElementById("data_viagem").value,
    termino: document.getElementById("termino_viagem").value,
    vagas: Number(document.getElementById("qtde_poltrona").value),
    preco: campoPreco.value === "" ? null : campoPreco.valueAsNumber,
    status: "agendada",
  };

  const terminoEm = Date.parse(viagem.termino);

  if (terminoEm <= Date.parse(viagem.saida)) {
    alert("o término da viagem deve ser depois da saída.");
    return;
  }

  if (terminoEm <= Date.now()) {
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

function mostrarViagens() {
  const disponiveis = viagens
    .filter(viagem => viagem.status === "agendada" && viagem.vagas > 0)
    .sort((a, b) => {
        const diferenca = Date.parse(a.saida) - Date.parse(b.saida);

        return diferenca || a.destino.localeCompare(b.destino, "pt-BR");
    });

  listaViagens.replaceChildren();

  if (disponiveis.length === 0) {
    listaViagens.textContent = "Nenhuma viagem disponível no momento.";
    return;
  }

  const agora = Date.now();

const proximaViagem = disponiveis.find(
    viagem => Date.parse(viagem.saida) > agora
);

  for (const viagem of disponiveis) {
    const card = document.createElement("article");
    card.className = "card_viagem";

    const cabecalho = document.createElement("div");
    cabecalho.className = "card_cabecalho";

    const destino = document.createElement("h3");
    destino.textContent = viagem.destino;
    cabecalho.append(destino);

    if (Number.isFinite(viagem.preco)) {
      const preco = document.createElement("span");
      preco.className = "card_preco";
      preco.textContent = viagem.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      cabecalho.append(preco);
    }

    const saida = new Date(viagem.saida);

    const dataCard = document.createElement("p");
    dataCard.textContent = saida.toLocaleDateString("pt-BR", {
      dateStyle: "long",
    });

    const horaCard = document.createElement("p");
    horaCard.textContent = `Saída às ${saida.toLocaleTimeString("pt-BR", {
      timeStyle: "short",
    })}`;

    const vagasCard = document.createElement("p");
    vagasCard.className = "card_ocupacao";
    vagasCard.textContent =
      viagem.vagas === 1
        ? "1 poltrona cadastrada"
        : `${viagem.vagas} poltronas cadastradas`;

    const detalhesViagem = document.createElement("button");
    detalhesViagem.type = "button";
    detalhesViagem.textContent = "Abrir painel";
    detalhesViagem.className = "card_acao";

    detalhesViagem.addEventListener("click", () => {
      tituloDetalhes.textContent = `Viagem para ${viagem.destino}`;
      saidaDetalhes.textContent = `Saída em ${formatarSaida(viagem.saida)}`;
      viagemAberta = viagem;
      mostrarPoltronas(viagem.vagas);
      painelLista.hidden = true;
      painelDetalhes.hidden = false;
      botaoVoltar.focus();
    });

    if (viagem === proximaViagem) {
      const selo = document.createElement("p");
      selo.className = "selo_saida";
      selo.textContent = "Próxima saída";
      card.append(selo);
    }

    card.append(cabecalho, dataCard, horaCard, vagasCard, detalhesViagem);
    listaViagens.append(card);
  }
}

function voltarParaViagens() {
    painelDetalhes.hidden = true;
    painelLista.hidden = false;
    viagemAberta = null;
}

botaoVoltar.addEventListener("click", voltarParaViagens);

botaoCancelarViagem.addEventListener("click", () => {
  if (!viagemAberta) return;

  const { destino, saida } = viagemAberta;
  const confirmou = confirm(
    `Cancelar a viagem para ${destino} de ${formatarSaida(saida)}?`,
  );

  if (!confirmou) return;

  viagens = viagens.filter((viagem) => viagem !== viagemAberta);
  localStorage.setItem("viahub_viagens", JSON.stringify(viagens));

  voltarParaViagens();
  mostrarViagens();
});

function formatarSaida(valor) {
  const saida = new Date(valor);
  const data = saida.toLocaleDateString("pt-BR", { dateStyle: "long" });
  const hora = saida.toLocaleTimeString("pt-BR", { timeStyle: "short" });

  return `${data} às ${hora}`;
}

function mostrarPoltronas(quantidade) {
    mapaPoltronas.replaceChildren();

    const colunas = [1, 2, 4, 5];
    let fundo = null;

    for (let numero = 1; numero <= quantidade; numero++) {
        const poltrona = document.createElement("li");
        poltrona.className = "poltrona";
        poltrona.textContent = String(numero).padStart(2, "0");

        if (quantidade === 45 && numero === 41) {
            const fileira = document.createElement("li");
            fileira.className = "fileira_fundo";

            fundo = document.createElement("ol");
            fundo.className = "poltronas_fundo";
            fundo.start = 41;

            fileira.append(fundo);
            mapaPoltronas.append(fileira);
        }

        if (fundo) {
            fundo.append(poltrona);
        } else {
            poltrona.style.gridColumn = colunas[(numero - 1) % 4];
            mapaPoltronas.append(poltrona);
        }
    }
}

function removerViagensEncerradas() {
  const agora = Date.now();

  const restantes = viagens.filter((viagem) => {
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
