// Votação: lista os participantes (GET) e registra votos (POST /votos)
const gradeRoca = document.getElementById('grade-roca');
const gradeDemais = document.getElementById('grade-demais');
const aviso = document.getElementById('aviso');

let votosNaSessao = 0;

// Card do Bootstrap para quem está na roça (com selo e botão de voto)
function cardRoca(p) {
  return `
    <div class="col">
      <article class="card card-participante card-roca shadow-lg h-100 p-2">
        <span class="selo-roca badge bg-danger fs-6 position-absolute shadow">Na roça</span>
        <img src="${p.foto}" alt="${p.nome}" class="card-img-top rounded">
        <div class="card-body text-center">
          <h3 class="card-title h4 mb-3">${p.nome}</h3>
          <button type="button" class="btn btn-danger w-100" data-id="${p.id}" data-nome="${p.nome}">
            Votar para eliminar
          </button>
        </div>
      </article>
    </div>`;
}

// Card simples para os demais peões (sem botão)
function cardDemais(p) {
  return `
    <div class="col">
      <article class="card card-participante card-fora h-100 p-1 border-0">
        <img src="${p.foto}" alt="${p.nome}" class="card-img-top rounded">
        <div class="card-body p-2 text-center">
          <h3 class="card-title small fw-bold mb-0" style="font-family: inherit">${p.nome}</h3>
        </div>
      </article>
    </div>`;
}

async function carregarParticipantes() {
  try {
    const [naRoca, foraDaRoca] = await Promise.all([listarNaRoca(), listarForaDaRoca()]);
    gradeRoca.innerHTML = naRoca.map(cardRoca).join('');
    gradeDemais.innerHTML = foraDaRoca.map(cardDemais).join('');
  } catch (erro) {
    mostrarErroServidor(gradeRoca);
  }
}

// Um único listener na grade (delegação de eventos) para todos os botões
gradeRoca.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('button[data-id]');
  if (!botao) return;

  botao.disabled = true;
  try {
    await registrarVoto(Number(botao.dataset.id));
    votosNaSessao++;
    aviso.className = 'alert alert-success d-flex flex-wrap justify-content-between gap-2';
    aviso.innerHTML = `
      <span>Voto registrado para eliminar <strong>${botao.dataset.nome}</strong>.
      Você já votou ${votosNaSessao} ${votosNaSessao === 1 ? 'vez' : 'vezes'}.</span>
      <a href="resultado.html" class="alert-link">Ver resultado</a>`;
  } catch (erro) {
    aviso.className = 'alert alert-danger';
    aviso.textContent = 'Não foi possível registrar o voto. O JSON Server está rodando?';
  } finally {
    botao.disabled = false;
  }
});

carregarParticipantes();
