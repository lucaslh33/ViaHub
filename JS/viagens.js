const regrasViagem = (() => {
  function validarDatas(viagem, agora = Date.now()) {
    const saida = Date.parse(viagem.saida);
    const termino = Date.parse(viagem.termino);

    if (!Number.isFinite(saida) || !Number.isFinite(termino)) {
      return "Informe datas válidas de saída e término.";
    }
    if (termino <= saida) {
      return "O término da viagem deve ser depois da saída.";
    }
    if (termino <= agora) {
      return "O término da viagem deve estar no futuro.";
    }
    return null;
  }

  function reservasAtivas(viagem) {
    return (viagem.reservas ?? []).filter((reserva) => !reserva.canceladaEm);
  }

  function comportaReservas(viagem, vagas) {
    return reservasAtivas(viagem).every((reserva) => reserva.poltrona <= vagas);
  }

  function ocupacao(viagem) {
    const ativas = reservasAtivas(viagem);
    const confirmadas = ativas.filter((reserva) => reserva.pagamentoConfirmadoEm).length;

    return {
      ativas,
      disponiveis: viagem.vagas - ativas.length,
      pendentes: ativas.length - confirmadas,
      confirmadas,
      percentual: Math.round((ativas.length / viagem.vagas) * 100),
    };
  }

  function reservarPoltrona(viagem, poltrona, dados) {
    const nome = dados.nome.trim();
    const telefone = dados.telefone.trim();

    if (!nome || !telefone) {
      return "Preencha o nome e o WhatsApp.";
    }
    if (!Number.isInteger(poltrona) || poltrona < 1 || poltrona > viagem.vagas) {
      return "Selecione uma poltrona válida.";
    }
    if (reservasAtivas(viagem).some((reserva) => reserva.poltrona === poltrona)) {
      return "Essa poltrona já está ocupada.";
    }

    viagem.reservas ??= [];
    viagem.reservas.push({ poltrona, nome, telefone });
    return null;
  }

  function confirmarPagamento(reserva) {
    if (reserva.canceladaEm || reserva.pagamentoConfirmadoEm) return false;

    reserva.pagamentoConfirmadoEm = new Date().toISOString();
    return true;
  }

  function cancelarReserva(reserva) {
    if (reserva.canceladaEm) return false;

    reserva.canceladaEm = new Date().toISOString();
    return true;
  }

  function viagensNaoEncerradas(viagens, agora = Date.now()) {
    return viagens.filter((viagem) => {
      const termino = Date.parse(viagem.termino);
      return !Number.isFinite(termino) || termino > agora;
    });
  }

  return {
    validarDatas,
    reservasAtivas,
    comportaReservas,
    ocupacao,
    reservarPoltrona,
    confirmarPagamento,
    cancelarReserva,
    viagensNaoEncerradas,
  };
})();
