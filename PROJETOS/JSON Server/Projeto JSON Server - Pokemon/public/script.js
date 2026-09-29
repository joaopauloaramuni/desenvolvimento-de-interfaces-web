// API externa: Pokémon TCG (https://dev.pokemontcg.io/dashboard)
// A chave é opcional: sem ela funciona, mas com limite menor de requisições.
// Atenção: no front-end a chave fica visível para qualquer um (F12). Para aula, tudo bem.
const API_KEY = "a16b445b-6e30-49c0-bef7-7810830b21f1";
const POKEMON_API = "https://api.pokemontcg.io/v2/cards";

// API local: JSON Server (onde salvamos a coleção)
const COLECAO_URL = "/cartas";

const formBusca = document.getElementById("form-busca");
const inputBusca = document.getElementById("busca");
const statusEl = document.getElementById("status");
const resultados = document.getElementById("resultados");
const detalhes = document.getElementById("detalhes");
const colecao = document.getElementById("colecao");

// Monta os headers (só manda a chave se ela existir)
function headersPokemon() {
  return API_KEY ? { "X-Api-Key": API_KEY } : {};
}

// ---------- API DO POKÉMON ----------

// Busca uma carta pelo ID (igual ao get_card_data do Python)
async function buscarPorId(id) {
  const resposta = await fetch(`${POKEMON_API}/${id}`, { headers: headersPokemon() });
  if (!resposta.ok) return [];
  const json = await resposta.json();
  return [json.data];
}

// Busca cartas pelo nome (ex.: charizard)
async function buscarPorNome(nome) {
  const q = encodeURIComponent(`name:"${nome}*"`);
  const resposta = await fetch(`${POKEMON_API}?q=${q}&pageSize=12`, { headers: headersPokemon() });
  const json = await resposta.json();
  return json.data || [];
}

// Busca uma lista inicial de cartas (sem filtro), para a página já abrir com cartas
async function buscarIniciais() {
  const resposta = await fetch(`${POKEMON_API}?pageSize=20`, { headers: headersPokemon() });
  const json = await resposta.json();
  return json.data || [];
}

// Desenha as cartas na grade de resultados
function mostrarResultados(cartas) {
  resultados.innerHTML = "";
  cartas.forEach((carta) => {
    const div = document.createElement("div");
    div.className = "carta";
    div.innerHTML = `
      <img src="${carta.images.small}" alt="${carta.name}">
      <div>${carta.name}<br><small>${carta.set.name}</small></div>
      <button>Salvar</button>
    `;
    div.querySelector("img").addEventListener("click", () => mostrarDetalhes(carta));
    div.querySelector("button").addEventListener("click", () => salvarCarta(carta));
    resultados.appendChild(div);
  });
}

// Carrega a lista inicial assim que a página abre
async function carregarIniciais() {
  statusEl.textContent = "Carregando cartas...";
  try {
    const cartas = await buscarIniciais();
    mostrarResultados(cartas);
    statusEl.textContent = "Algumas cartas para começar. Clique numa carta para ver os detalhes.";
  } catch (erro) {
    statusEl.textContent = "Erro ao buscar na API do Pokémon.";
    console.error(erro);
  }
}

// Quando o formulário de busca é enviado
formBusca.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const termo = inputBusca.value.trim();

  statusEl.textContent = "Buscando...";
  resultados.innerHTML = "";
  detalhes.hidden = true;

  try {
    // Se tiver hífen e número (ex.: swsh4-25), tratamos como ID
    const pareceId = /^[a-z0-9]+-[a-z0-9]+$/i.test(termo) && /\d/.test(termo);
    const cartas = pareceId ? await buscarPorId(termo) : await buscarPorNome(termo);

    if (cartas.length === 0) {
      statusEl.textContent = "Nenhuma carta encontrada.";
      return;
    }

    mostrarResultados(cartas);
    statusEl.textContent = `${cartas.length} carta(s) encontrada(s). Clique numa carta para ver os detalhes.`;
  } catch (erro) {
    statusEl.textContent = "Erro ao buscar na API do Pokémon.";
    console.error(erro);
  }
});

// Mostra os detalhes (igual ao show_card do Python)
function mostrarDetalhes(carta) {
  let info = `
    <h2>${carta.name}</h2>
    <p><strong>${carta.supertype}</strong> (${carta.set.name})</p>
    <p>HP: ${carta.hp || "?"} | Tipo: ${(carta.types || []).join(", ")}</p>
    <p>Artista: ${carta.artist || "Desconhecido"} | Raridade: ${carta.rarity || "N/A"}</p>
  `;

  if (carta.flavorText) {
    info += `<p><em>${carta.flavorText}</em></p>`;
  }

  if (carta.attacks) {
    info += "<p><strong>Ataques:</strong></p><ul>";
    carta.attacks.forEach((atk) => {
      info += `<li>${atk.name} (${atk.damage || "-"}) | Custo: ${(atk.cost || []).join(", ")} ${atk.text ? "| " + atk.text : ""}</li>`;
    });
    info += "</ul>";
  }

  if (carta.abilities) {
    info += "<p><strong>Habilidades:</strong></p><ul>";
    carta.abilities.forEach((hab) => {
      info += `<li>${hab.name}: ${hab.text}</li>`;
    });
    info += "</ul>";
  }

  if (carta.weaknesses) {
    info += `<p>Fraquezas: ${carta.weaknesses.map((w) => `${w.type} ${w.value}`).join(", ")}</p>`;
  }

  if (carta.resistances) {
    info += `<p>Resistências: ${carta.resistances.map((r) => `${r.type} ${r.value}`).join(", ")}</p>`;
  }

  if (carta.retreatCost) {
    info += `<p>Custo de Retirada: ${carta.retreatCost.join(", ")}</p>`;
  }

  detalhes.innerHTML = `
    <img src="${carta.images.large}" alt="${carta.name}">
    <div class="info">${info}</div>
  `;
  detalhes.hidden = false;
  detalhes.scrollIntoView({ behavior: "smooth" });
}

// ---------- JSON SERVER (COLEÇÃO) ----------

// READ (GET) - lista a coleção salva
async function carregarColecao() {
  try {
    const resposta = await fetch(COLECAO_URL);
    const cartas = await resposta.json();

    colecao.innerHTML = cartas.length ? "" : "<p>Nenhuma carta salva ainda.</p>";
    cartas.forEach((carta) => {
      const div = document.createElement("div");
      div.className = "carta";
      div.innerHTML = `
        <img src="${carta.imagem}" alt="${carta.nome}">
        <div>${carta.nome}<br><small>${carta.colecao}</small></div>
        <button class="excluir">Remover</button>
      `;
      div.querySelector("button").addEventListener("click", () => removerCarta(carta.id));
      colecao.appendChild(div);
    });
  } catch (erro) {
    colecao.innerHTML = `<p class="erro">Não foi possível conectar ao JSON Server.</p>`;
    console.error(erro);
  }
}

// CREATE (POST) - salva só o que interessa da carta
async function salvarCarta(carta) {
  await fetch(COLECAO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cardId: carta.id,
      nome: carta.name,
      colecao: carta.set.name,
      imagem: carta.images.small,
    }),
  });
  alert(`Carta "${carta.name}" salva na coleção!`);
  carregarColecao();
}

// DELETE - remove da coleção
async function removerCarta(id) {
  await fetch(`${COLECAO_URL}/${id}`, { method: "DELETE" });
  carregarColecao();
}

// Ao abrir a página: mostra cartas da API e a coleção salva
carregarIniciais();
carregarColecao();
