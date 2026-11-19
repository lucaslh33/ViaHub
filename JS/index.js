const botaoAbrir = document.getElementById("abrir_modal");
const modalViagem = document.getElementById("modal_viagem");
const listaViagens = document.getElementById("lista_viagens");
const formViagem = document.getElementById("form_viagem");
const tituloModalViagem = document.getElementById("titulo_viagem");
const botaoSalvarViagem = document.getElementById("salvar_viagem");
const botaoEditarViagem = document.getElementById("editar_viagem");
formViagem.addEventListener("submit", cadastrarViagem);
const embarqueDetalhes = document.getElementById("embarque_detalhes");
const painelDetalhes = document.getElementById("painel_detalhes");
const painelLista = document.getElementById("painel_lista");
const botaoVoltar = document.getElementById("voltar_viagens");
const botaoCancelarViagem = document.getElementById("cancelar_viagem");
let viagemAberta = null;
const tituloDetalhes = document.getElementById("titulo_detalhes");
const dataDetalhes = document.getElementById("data_detalhes");
const saidaDetalhes = document.getElementById("saida_detalhes");
const precoDetalhes = document.getElementById("preco_detalhes");
const barraOcupacaoDetalhes = document.getElementById("barra_ocupacao");
const buscaPassageiro = document.getElementById("buscar_passageiro");
const filtrosPassageiros = document.getElementById("filtros_passageiros");
const listaPassageiros = document.getElementById("lista_passageiros");
const passageirosVazio = document.getElementById("passageiros_vazio");
const botaoAdicionarParada = document.getElementById("adicionar_parada");
const paradasExtras = document.getElementById("paradas_extras");
const mapaPoltronas = document.getElementById("mapa_poltronas");
const modalReserva = document.getElementById("modal_reserva");
const tituloReserva = document.getElementById("titulo_reserva");
const formReserva = document.getElementById("form_reserva");

let poltronaSelecionada = null;
let viagemEmEdicao = null;

let viagens = armazenamentoViagens.carregar();

botaoAbrir.addEventListener("click", () => abrirFormularioViagem());
botaoEditarViagem.addEventListener("click", () => abrirFormularioViagem(viagemAberta));
document.getElementById("fechar_modal_viagem").addEventListener("click", () => {
  modalViagem.close();
});

function abrirFormularioViagem(viagem = null) {
  viagemEmEdicao = viagem;
  formViagem.reset();
  paradasExtras.replaceChildren();
  tituloModalViagem.textContent = viagem ? "Editar viagem" : "Nova viagem";
  botaoSalvarViagem.textContent = viagem ? "Salvar alterações" : "Continuar";

  if (viagem) {
    const campos = formViagem.elements;
    campos.destino.value = viagem.destino;
    campos.embarque.value = viagem.embarque;
    campos.data_viagem.value = viagem.saida;
    campos.termino_viagem.value = viagem.termino ?? "";
    campos.qtde_poltrona.value = viagem.vagas;
    campos.preco_viagem.value = viagem.preco ?? "";
    const [primeiraParada = "", ...outrasParadas] = viagem.paradas ?? [];
    document.getElementById("parada").value = primeiraParada;
    outrasParadas.forEach(adicionarCampoParada);
  }

  modalViagem.showModal();
}

function adicionarCampoParada(valor = "") {
  const campo = document.createElement("label");
  campo.className = "campo";
  campo.textContent = `Parada ${paradasExtras.children.length + 2}`;

  const input = document.createElement("input");
  input.type = "text";
  input.name = "parada";
  input.value = valor;

  campo.append(input);
  paradasExtras.append(campo);
  return input;
}

botaoAdicionarParada.addEventListener("click", () => {
  adicionarCampoParada().focus();
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

  const erroDatas = regrasViagem.validarDatas(viagem);
  if (erroDatas) {
    alert(erroDatas);
    return;
  }

  if (viagemEmEdicao) {
    if (!viagens.includes(viagemEmEdicao)) {
      alert("Essa viagem já foi encerrada.");
      modalViagem.close();
      voltarParaViagens();
      return;
    }

    if (!regrasViagem.comportaReservas(viagemEmEdicao, viagem.vagas)) {
      alert("A quantidade de poltronas precisa incluir todas as poltronas reservadas.");
      return;
    }

    Object.assign(viagemEmEdicao, viagem);
    mostrarPainelDaViagem();
  } else {
    viagens.push(viagem);
  }

  armazenamentoViagens.salvar(viagens);
  mostrarViagens();
  modalViagem.close();
}

function mostrarViagens() {
  const disponiveis = viagens
    .filter((viagem) => viagem.status === "agendada" && viagem.vagas > 0)
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
  const temSaidaFutura = (viagem) => Date.parse(viagem.saida) > agora;

  const futuras = disponiveis.filter(temSaidaFutura);
  const outras = disponiveis.filter((viagem) => !temSaidaFutura(viagem));

  const proximaViagem = futuras[0];
  const ordemDosCards = [...futuras, ...outras];

  for (const viagem of ordemDosCards) {
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
      preco.textContent = formatarPreco(viagem.preco);
      cabecalho.append(preco);
    }

    const { data, hora } = formatarDataSaida(viagem.saida);

    const dataCard = document.createElement("p");
    dataCard.textContent = data;

    const horaCard = document.createElement("p");
    horaCard.textContent = `Saída às ${hora}`;

    const reservadas = regrasViagem.reservasAtivas(viagem).length;
    const vagasCard = document.createElement("div");
    vagasCard.className = "card_ocupacao";

    const textoOcupacao = document.createElement("span");
    textoOcupacao.textContent = `Poltronas reservadas: ${reservadas} de ${viagem.vagas}`;

    const barraOcupacao = document.createElement("meter");
    barraOcupacao.max = viagem.vagas;
    barraOcupacao.value = reservadas;
    barraOcupacao.setAttribute("aria-label", "Ocupação das poltronas");

    vagasCard.append(textoOcupacao, barraOcupacao);

    const detalhesViagem = document.createElement("button");
    detalhesViagem.type = "button";
    detalhesViagem.textContent = "Abrir painel";
    detalhesViagem.className = "card_acao";

    detalhesViagem.addEventListener("click", () => {
      viagemAberta = viagem;
      buscaPassageiro.value = "";
      selecionarFiltro("ativas");
      mostrarPainelDaViagem();
      painelLista.hidden = true;
      painelDetalhes.hidden = false;
      botaoVoltar.focus();
    });

    const rodape = document.createElement("div");
    rodape.className = "card_rodape";
    rodape.append(detalhesViagem);

    if (viagem === proximaViagem) {
      const selo = document.createElement("p");
      selo.className = "selo_saida";
      selo.textContent = "Próxima saída";
      rodape.append(selo);
    }

    card.append(cabecalho, dataCard, horaCard, vagasCard, rodape);
    listaViagens.append(card);
  }
}

function voltarParaViagens() {
  mostrarViagens();
  painelDetalhes.hidden = true;
  painelLista.hidden = false;
  viagemAberta = null;
}

botaoVoltar.addEventListener("click", voltarParaViagens);

botaoCancelarViagem.addEventListener("click", () => {
  if (!viagemAberta) return;

  const { destino, saida } = viagemAberta;
  const { data, hora } = formatarDataSaida(saida);
  const confirmou = confirm(`Cancelar a viagem para ${destino} de ${data} às ${hora}?`);

  if (!confirmou) return;

  viagens = viagens.filter((viagem) => viagem !== viagemAberta);
  armazenamentoViagens.salvar(viagens);

  voltarParaViagens();
});

function formatarDataSaida(valor) {
  const saida = new Date(valor);

  return {
    data: saida.toLocaleDateString("pt-BR", { dateStyle: "long" }),
    hora: saida.toLocaleTimeString("pt-BR", { timeStyle: "short" }),
  };
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarNumeroPoltrona(numero) {
  return String(numero).padStart(2, "0");
}

function mostrarPainelDaViagem() {
  const { destino, saida, embarque, preco, vagas } = viagemAberta;
  const { data, hora } = formatarDataSaida(saida);

  tituloDetalhes.textContent = destino;
  dataDetalhes.textContent = data;
  saidaDetalhes.textContent = `Saída às ${hora}`;
  precoDetalhes.hidden = !Number.isFinite(preco);
  if (!precoDetalhes.hidden) precoDetalhes.textContent = `${formatarPreco(preco)} por passageiro`;
  embarqueDetalhes.textContent = `Embarque: ${embarque}`;

  const { ativas, disponiveis, pendentes, confirmadas, percentual } = regrasViagem.ocupacao(viagemAberta);

  document.getElementById("total_reservas").textContent = ativas.length;
  document.getElementById("total_disponiveis").textContent = disponiveis;
  document.getElementById("total_pendentes").textContent = pendentes;
  document.getElementById("total_confirmados").textContent = confirmadas;
  document.getElementById("total_lugares").textContent = vagas === 1 ? "1 lugar" : `${vagas} lugares`;
  document.getElementById("total_passageiros").textContent = ativas.length === 1 ? "1 ativo" : `${ativas.length} ativos`;
  document.getElementById("ocupacao_detalhes").textContent = `${ativas.length} de ${vagas} ${vagas === 1 ? "vaga ocupada" : "vagas ocupadas"}`;
  document.getElementById("percentual_ocupacao").textContent = `${percentual}% do ônibus`;
  barraOcupacaoDetalhes.max = vagas;
  barraOcupacaoDetalhes.value = ativas.length;

  mostrarPoltronas(vagas, ativas);
  mostrarPassageiros();
}

function selecionarFiltro(filtro) {
  for (const botao of filtrosPassageiros.querySelectorAll("button")) {
    botao.setAttribute("aria-pressed", String(botao.dataset.filtro === filtro));
  }
}

filtrosPassageiros.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-filtro]");
  if (botao) {
    selecionarFiltro(botao.dataset.filtro);
    mostrarPassageiros();
  }
});

buscaPassageiro.addEventListener("input", mostrarPassageiros);

function normalizarBusca(texto) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR");
}

function mostrarPassageiros() {
  const busca = normalizarBusca(buscaPassageiro.value.trim());
  const filtro = filtrosPassageiros.querySelector('[aria-pressed="true"]').dataset.filtro;
  const reservas = viagemAberta.reservas ?? [];
  const filtradas = reservas.filter((reserva) => {
    if (filtro === "canceladas" ? !reserva.canceladaEm : reserva.canceladaEm) return false;
    if (filtro === "pendentes" && reserva.pagamentoConfirmadoEm) return false;
    if (filtro === "confirmados" && !reserva.pagamentoConfirmadoEm) return false;

    return normalizarBusca(reserva.nome).includes(busca) ||
      formatarNumeroPoltrona(reserva.poltrona).includes(busca);
  }).sort((a, b) => a.poltrona - b.poltrona);

  listaPassageiros.replaceChildren();
  passageirosVazio.hidden = filtradas.length > 0;
  passageirosVazio.textContent = reservas.length === 0 && !busca && filtro === "ativas"
    ? "Selecione uma poltrona livre no mapa para cadastrar o primeiro passageiro."
    : "Nenhuma reserva encontrada.";

  for (const reserva of filtradas) {
    const item = document.createElement("li");
    item.className = "passageiro";

    const numero = document.createElement("span");
    numero.className = "numero_passageiro";
    numero.textContent = formatarNumeroPoltrona(reserva.poltrona);
    numero.setAttribute("aria-label", `Poltrona ${reserva.poltrona}`);

    const dados = document.createElement("div");
    dados.className = "dados_passageiro";
    const nome = document.createElement("strong");
    nome.textContent = reserva.nome;
    const telefone = document.createElement("span");
    telefone.textContent = reserva.telefone;
    dados.append(nome, telefone);

    const acoes = document.createElement("div");
    acoes.className = "acoes_passageiro";
    const situacao = document.createElement("span");
    situacao.className = "selo_detalhes";
    if (reserva.canceladaEm) {
      situacao.textContent = "Cancelada";
    } else if (reserva.pagamentoConfirmadoEm) {
      situacao.classList.add("pagamento_confirmado");
      situacao.textContent = "Confirmado";
    } else {
      situacao.classList.add("pagamento_pendente");
      situacao.textContent = "Pendente";
      acoes.append(criarAcaoReserva("Confirmar pagamento", () => {
        atualizarReserva(reserva, regrasViagem.confirmarPagamento);
      }));
    }
    acoes.prepend(situacao);

    if (!reserva.canceladaEm) {
      const cancelar = criarAcaoReserva("×", () => {
        if (confirm(`Cancelar a reserva de ${reserva.nome} na poltrona ${reserva.poltrona}?`)) {
          atualizarReserva(reserva, regrasViagem.cancelarReserva);
        }
      });
      cancelar.setAttribute("aria-label", `Cancelar reserva de ${reserva.nome}`);
      acoes.append(cancelar);
    }

    item.append(numero, dados, acoes);
    listaPassageiros.append(item);
  }
}

function criarAcaoReserva(texto, acao) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  botao.addEventListener("click", acao);
  return botao;
}

function atualizarReserva(reserva, acao) {
  if (!viagens.includes(viagemAberta)) {
    voltarParaViagens();
    return;
  }

  if (!acao(reserva)) return;

  armazenamentoViagens.salvar(viagens);
  mostrarPainelDaViagem();
  buscaPassageiro.focus();
}

function mostrarPoltronas(quantidade, reservas) {
  mapaPoltronas.replaceChildren();

  const ocupadas = new Set(reservas.map((reserva) => reserva.poltrona));
  const colunas = [1, 2, 4, 5];
  let fundo = null;

  for (let numero = 1; numero <= quantidade; numero++) {
    const poltrona = document.createElement("li");
    const botao = document.createElement("button");
    const ocupada = ocupadas.has(numero);

    botao.type = "button";
    botao.className = "poltrona";
    botao.textContent = formatarNumeroPoltrona(numero);
    botao.disabled = ocupada;
    botao.setAttribute(
      "aria-label",
      `Poltrona ${numero}, ${ocupada ? "ocupada" : "livre"}`,
    );

    botao.addEventListener("click", () => {
      poltronaSelecionada = numero;
      tituloReserva.textContent = `Reservar poltrona ${numero}`;
      formReserva.reset();
      modalReserva.showModal();
    });

    poltrona.append(botao);

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

formReserva.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!viagens.includes(viagemAberta) || poltronaSelecionada === null) {
    alert("Abra uma viagem e selecione uma poltrona.");
    return;
  }

  const dados = new FormData(formReserva);
  const erroReserva = regrasViagem.reservarPoltrona(viagemAberta, poltronaSelecionada, {
    nome: dados.get("nome"),
    telefone: dados.get("telefone"),
  });

  if (erroReserva) {
    alert(erroReserva);
    return;
  }

  armazenamentoViagens.salvar(viagens);
  modalReserva.close();
  poltronaSelecionada = null;
  mostrarPainelDaViagem();
});

function removerViagensEncerradas() {
  const restantes = regrasViagem.viagensNaoEncerradas(viagens);

  if (restantes.length === viagens.length) return false;

  viagens = restantes;
  armazenamentoViagens.salvar(viagens);
  return true;
}

removerViagensEncerradas();
mostrarViagens();

setInterval(() => {
  if (removerViagensEncerradas()) mostrarViagens();
}, 3_000);
