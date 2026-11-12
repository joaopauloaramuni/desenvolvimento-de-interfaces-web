// Resultado: GET /participantes?naRoca=true + GET /votos e monta o placar
const placar = document.getElementById('placar');
const totalEl = document.getElementById('total');
const totalLegenda = document.getElementById('total-legenda');
const botaoZerar = document.getElementById('botao-zerar');
const confirmarZerar = document.getElementById('confirmar-zerar');

function formatarPercentual(valor) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
}

function itemPlacar(p, indice) {
  const lider = indice === 0;
  return `
    <div class="card bg-papel border-0 ${lider ? 'placar-lider' : ''}">
      <div class="card-body d-flex align-items-center gap-3">
        <img src="${p.foto}" alt="${p.nome}" class="placar-foto rounded flex-shrink-0">
        <div class="flex-grow-1">
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span class="fonte-titulo fs-4">${p.nome}</span>
            ${lider ? '<span class="badge bg-danger">Sairia hoje</span>' : ''}
          </div>
          <div class="progress rounded-pill" role="progressbar" aria-label="Votos de ${p.nome}"
               aria-valuenow="${p.percentual.toFixed(1)}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar rounded-pill ${lider ? 'bg-danger' : 'bg-madeira'}"
                 style="width: ${p.percentual}%"></div>
          </div>
          <span class="d-block mt-1 fw-bold">
            ${formatarPercentual(p.percentual)} (${p.votos} ${p.votos === 1 ? 'voto' : 'votos'})
          </span>
        </div>
      </div>
    </div>`;
}

async function carregarResultado() {
  try {
    const [naRoca, votos] = await Promise.all([listarNaRoca(), listarVotos()]);
    const total = votos.length;

    totalEl.textContent = total.toLocaleString('pt-BR');
    totalLegenda.textContent = total === 1 ? 'voto computado' : 'votos computados';

    if (total === 0) {
      placar.innerHTML = `
        <div class="card bg-papel border-0 text-center p-4">
          <p class="fs-5">Nenhum voto ainda. Escolha quem sai da roça para ver a parcial.</p>
          <div><a href="votacao.html" class="btn btn-danger btn-lg">Ir para a votação</a></div>
        </div>`;
      botaoZerar.classList.add('d-none');
      return;
    }

    placar.innerHTML = calcularResultado(naRoca, votos).map(itemPlacar).join('');
    botaoZerar.classList.remove('d-none');
  } catch (erro) {
    mostrarErroServidor(placar);
  }
}

// Confirmação do modal: apaga os votos (DELETE /votos/:id) e recarrega o placar
confirmarZerar.addEventListener('click', async () => {
  confirmarZerar.disabled = true;
  await zerarVotos();
  bootstrap.Modal.getInstance(document.getElementById('modal-zerar')).hide();
  confirmarZerar.disabled = false;
  carregarResultado();
});

carregarResultado();
