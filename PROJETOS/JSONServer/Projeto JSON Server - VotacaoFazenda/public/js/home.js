// Home: mostra quem está na roça (GET /participantes?naRoca=true)
const listaRoca = document.getElementById('lista-roca');

async function carregarHome() {
  try {
    const naRoca = await listarNaRoca();
    listaRoca.innerHTML = naRoca
      .map((p) => `
        <span class="roca-pill d-inline-flex align-items-center gap-2 rounded-pill p-1 pe-3">
          <img src="${p.foto}" alt="${p.nome}" class="rounded-pill">
          ${p.nome}
        </span>`)
      .join('');
  } catch (erro) {
    mostrarErroServidor(listaRoca);
  }
}

carregarHome();
