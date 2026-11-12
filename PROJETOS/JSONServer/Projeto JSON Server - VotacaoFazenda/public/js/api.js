// =========================================================
// api.js  ->  comunicação com o JSON Server (fetch)
// O JSON Server lê o arquivo db.json e cria a API REST:
//   GET    /participantes            lista todos
//   GET    /participantes?naRoca=true  lista só quem está na roça
//   GET    /votos                    lista todos os votos
//   POST   /votos                    registra um voto
//   DELETE /votos/:id                apaga um voto
// =========================================================

const API_URL = 'http://localhost:3000';

// GET /participantes
async function listarParticipantes() {
  const resposta = await fetch(`${API_URL}/participantes`);
  if (!resposta.ok) throw new Error('Erro ao buscar participantes');
  return resposta.json();
}

// GET /participantes?naRoca=true  (apenas esses podem receber votos)
async function listarNaRoca() {
  const resposta = await fetch(`${API_URL}/participantes?naRoca=true`);
  if (!resposta.ok) throw new Error('Erro ao buscar participantes da roça');
  return resposta.json();
}

// GET /participantes?naRoca=false
async function listarForaDaRoca() {
  const resposta = await fetch(`${API_URL}/participantes?naRoca=false`);
  if (!resposta.ok) throw new Error('Erro ao buscar participantes');
  return resposta.json();
}

// GET /votos
async function listarVotos() {
  const resposta = await fetch(`${API_URL}/votos`);
  if (!resposta.ok) throw new Error('Erro ao buscar votos');
  return resposta.json();
}

// POST /votos  ->  cada voto vira um registro { id, participanteId, data }
async function registrarVoto(participanteId) {
  const resposta = await fetch(`${API_URL}/votos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participanteId, data: new Date().toISOString() }),
  });
  if (!resposta.ok) throw new Error('Erro ao registrar voto');
  return resposta.json();
}

// DELETE /votos/:id para cada voto (o JSON Server não tem "apagar tudo")
async function zerarVotos() {
  const votos = await listarVotos();
  for (const voto of votos) {
    await fetch(`${API_URL}/votos/${voto.id}`, { method: 'DELETE' });
  }
}

// Junta participantes da roça + votos: devolve cada um com "votos" e "percentual",
// ordenado do mais votado para o menos votado.
function calcularResultado(participantesRoca, votos) {
  const total = votos.length;
  return participantesRoca
    .map((p) => {
      const qtd = votos.filter((v) => v.participanteId === p.id).length;
      return { ...p, votos: qtd, percentual: total === 0 ? 0 : (qtd / total) * 100 };
    })
    .sort((a, b) => b.votos - a.votos);
}

// Mensagem padrão quando o JSON Server não está rodando
function mostrarErroServidor(elemento) {
  elemento.innerHTML = `
    <div class="alert alert-danger" role="alert">
      Não foi possível conectar ao JSON Server. Rode <code>npm start</code> na pasta do projeto.
    </div>`;
}
