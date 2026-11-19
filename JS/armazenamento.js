const armazenamentoViagens = {
  carregar() {
    return JSON.parse(localStorage.getItem("viahub_viagens") ?? "[]");
  },

  salvar(viagens) {
    localStorage.setItem("viahub_viagens", JSON.stringify(viagens));
  },
};
