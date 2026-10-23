/**
 * Pokédex (HTML + CSS + Bootstrap + json-server).
 *
 * Este arquivo faz o papel do App.jsx do projeto em React: guarda o estado da tela
 * (aba, pesquisa, tipo, ordem, Pokémon aberto, favoritos, capa e tema), escuta os
 * eventos e redesenha só a parte da tela que mudou.
 *
 * Os componentes (js/components) são funções que recebem dados e devolvem HTML.
 */
import { API_URL, STORAGE_KEYS } from "./config/appConfig.js";
import { emptyState } from "./components/emptyState.js";
import { atualizarEstrelas } from "./components/favoriteButton.js";
import { icon } from "./components/icon.js";
import { montarCapa } from "./components/pokedexCover.js";
import { pokemonDetails } from "./components/pokemonDetails.js";
import { pokemonList } from "./components/pokemonCard.js";
import { ativarImagensReserva } from "./components/pokemonImage.js";
import { screenTabs } from "./components/screenTabs.js";
import { searchBar } from "./components/searchBar.js";
import { atualizarSortControl, sortControl } from "./components/sortControl.js";
import { statusBar } from "./components/statusBar.js";
import { trainerList } from "./components/trainerList.js";
import { typeFilter } from "./components/typeFilter.js";
import { carregarDados } from "./repository/pokedexRepository.js";
import * as favoriteService from "./services/favoriteService.js";
import {
  countByType,
  filterPokemon,
  getAllPokemon,
  getAvailableTypes,
  getPokemonById,
  getTrainers,
  getTrainersOf,
  inicializar,
  SORT_OPTIONS,
  sortPokemon,
} from "./services/pokedexService.js";
import { esc, trocarHtml } from "./utils/dom.js";
import { gravarStorage } from "./utils/storage.js";
import { plural } from "./utils/text.js";

// =====================================================================
// Elementos fixos do index.html
// =====================================================================
const $ = (seletor) => document.querySelector(seletor);

const el = {
  raiz: $("#app"),
  tela: $(".device__screen"),
  viewport: $(".screen-viewport"),
  conteudo: $("#conteudo"),
  status: $("#status"),
  led: $(".led"),
  ledCaixa: $(".device__led"),
  sensor: $(".device__sensor"),
  botaoTema: $('[data-action="theme"]'),
  toasts: $("#toasts"),
};

const LED_TEXTO = {
  off: "Favoritos desligados (json-server fora do ar)",
  loading: "Carregando favoritos",
  saving: "Salvando favorito",
  ok: "Favoritos sincronizados",
  error: "Erro ao falar com o json-server",
};

// =====================================================================
// Estado
// =====================================================================
let TODOS = [];
let TODOS_IDS = [];
let TIPOS = [];
let TREINADORES = [];

const estado = {
  pronto: false,
  aba: "pokedex", // "pokedex" | "favoritos" | "treinadores"
  busca: "",
  tipo: null,
  ordem: { campo: "id", direcao: "asc" },
  selecao: null, // { ids, indice } ou null
  treinadorDestaque: null,
  capa: "fechada", // "fechada" | "abrindo" | "fechando" | null (Pokédex ligada)
  bootKey: 0,
  tema: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  favoritos: {
    ids: new Set(),
    salvando: new Set(), // estrelas aguardando o json-server
    carregando: false,
    erro: null,
    habilitado: false,
  },
};

/** Quem abriu os detalhes: o foco volta para ele ao fechar. */
let quemAbriu = null;

// =====================================================================
// Estado derivado (como o useMemo do React: calculado, não guardado)
// =====================================================================
function listaBase() {
  return estado.aba === "favoritos" ? TODOS.filter((p) => estado.favoritos.ids.has(p.id)) : TODOS;
}

function resultado() {
  return sortPokemon(filterPokemon(listaBase(), { busca: estado.busca, tipo: estado.tipo }), estado.ordem);
}

function filtrando() {
  return estado.busca.trim() !== "" || estado.tipo !== null;
}

/** Sem favoritos (ou sem json-server), os filtros não têm o que filtrar. */
function mostrarFiltros() {
  return estado.aba === "pokedex" || listaBase().length > 0;
}

function statusFavoritos() {
  const f = estado.favoritos;
  if (!f.habilitado) return "off";
  if (f.erro) return "error";
  if (f.carregando) return "loading";
  if (f.salvando.size > 0) return "saving";
  return "ok";
}

function abas() {
  return [
    { id: "pokedex", label: "Pokédex", count: TODOS.length, fixo: true },
    { id: "favoritos", label: "Favoritos", count: estado.favoritos.ids.size },
    { id: "treinadores", label: "Treinadores", count: TREINADORES.length, fixo: true },
  ];
}

// =====================================================================
// Desenho da tela
// =====================================================================

/** Conteúdo da aba inteira: abas, ferramentas (pesquisa, ordem, tipos) e lista. */
function renderConteudo() {
  const aba = estado.aba;
  let painel;

  if (aba === "treinadores") {
    painel = `
      <p class="result-count">${TREINADORES.length} treinadores</p>
      ${trainerList(TREINADORES, estado.treinadorDestaque)}`;
  } else {
    const ferramentas = mostrarFiltros()
      ? `<div class="toolbar row g-2 g-md-3 align-items-start" data-toolbar>
          <div class="col-12 col-md">${searchBar(estado.busca)}</div>
          <div class="col-12 col-md-5 col-lg-4 col-xl-3">${sortControl(estado.ordem)}</div>
          <div class="col-12" data-type-filter>${htmlFiltroTipo()}</div>
        </div>
        <p class="result-count" aria-live="polite" data-count></p>`
      : "";
    painel = `${ferramentas}<div data-lista></div>`;
  }

  trocarHtml(
    el.conteudo,
    `${screenTabs({ abas: abas(), ativa: aba })}
    <div id="painel-${aba}" role="tabpanel" aria-labelledby="aba-${aba}">${painel}</div>`,
  );

  if (aba !== "treinadores") atualizarLista();
}

function htmlFiltroTipo() {
  const base = listaBase();
  return typeFilter({ tipos: TIPOS, contagem: countByType(base), total: base.length, selecionado: estado.tipo });
}

/**
 * Atualização parcial (a cada tecla, filtro, ordem ou favorito):
 * o campo de pesquisa NÃO é recriado, para não perder o foco nem o cursor.
 */
function atualizar() {
  atualizarContadoresAbas();
  if (estado.aba === "treinadores") return;

  // Os filtros apareceram ou sumiram (ex.: primeiro favorito)? Redesenha a aba toda.
  const temFerramentas = Boolean(el.conteudo.querySelector("[data-toolbar]"));
  if (temFerramentas !== mostrarFiltros()) {
    renderConteudo();
    return;
  }

  if (temFerramentas) {
    const campo = el.conteudo.querySelector("#pesquisa");
    if (campo.value !== estado.busca) campo.value = estado.busca;
    el.conteudo.querySelector('[data-action="clear-search"]').hidden = !estado.busca;
    atualizarSortControl(el.conteudo, estado.ordem);
    trocarHtml(el.conteudo.querySelector("[data-type-filter]"), htmlFiltroTipo());
  }

  atualizarLista();
}

function atualizarContadoresAbas() {
  for (const aba of abas()) {
    const contador = el.conteudo.querySelector(`[data-tab-count="${aba.id}"]`);
    if (contador) contador.textContent = aba.count;
  }
}

function atualizarLista() {
  const lista = resultado();
  const base = listaBase();
  const n = lista.length;

  const contagem = el.conteudo.querySelector("[data-count]");
  if (contagem) {
    if (estado.aba === "favoritos") {
      contagem.textContent = filtrando()
        ? `${n} de ${base.length} ${plural(base.length, "favorito", "favoritos")}`
        : `${n} ${plural(n, "favorito", "favoritos")}`;
    } else {
      contagem.textContent = filtrando() ? `${n} de ${TODOS.length} Pokémon` : `${n} Pokémon`;
    }
  }

  trocarHtml(
    el.conteudo.querySelector("[data-lista]"),
    pokemonList({
      pokemons: lista,
      favoriteIds: estado.favoritos.ids,
      salvando: estado.favoritos.salvando,
      favoritesEnabled: estado.favoritos.habilitado,
      vazio: htmlEstadoVazio(),
    }),
  );
}

function htmlEstadoVazio() {
  const f = estado.favoritos;
  const aba = estado.aba;

  if (aba === "favoritos" && !f.habilitado) {
    return emptyState({
      icone: "star",
      titulo: "Favoritos desativados",
      textoHtml: `O json-server não respondeu em <code>${esc(API_URL)}</code>. Rode <code>npm install</code> e <code>npm start</code> na pasta do projeto e abra <code>http://localhost:3000</code>. O passo a passo está no README.`,
    });
  }
  if (aba === "favoritos" && f.carregando) {
    return emptyState({ icone: "star", titulo: "Carregando favoritos...", carregando: true });
  }
  if (aba === "favoritos" && listaBase().length === 0) {
    return emptyState({
      icone: "star",
      titulo: "Você ainda não tem favoritos",
      textoHtml: "Toque na estrela de um Pokémon para guardá-lo aqui. Os favoritos ficam salvos no json-server (db.json).",
      acao: { label: "Ver a Pokédex", action: "go-pokedex" },
    });
  }

  const busca = estado.busca.trim();
  const nomeTipo = TIPOS.find((t) => t.name === estado.tipo)?.label;
  let texto = "Confira a grafia ou pesquise pelo número, de 1 a 151.";
  if (!busca && nomeTipo && aba === "favoritos") {
    texto = `Nenhum dos seus favoritos é do tipo ${nomeTipo}.`;
  }

  return emptyState({
    titulo: busca ? `Nenhum Pokémon encontrado para “${busca}”` : "Nenhum Pokémon encontrado",
    textoHtml: esc(busca && nomeTipo ? `Nada com esse nome ou número no tipo ${nomeTipo}. ${texto}` : texto),
    acao: { label: "Limpar pesquisa e filtro", action: "clear-filters" },
  });
}

/** LED do aparelho e barra de status. */
function renderStatus() {
  const status = statusFavoritos();
  el.led.dataset.status = status;
  el.ledCaixa.title = LED_TEXTO[status];
  el.status.innerHTML = statusBar({
    status,
    erro: estado.favoritos.erro,
    totalFavoritos: estado.favoritos.ids.size,
  });
}

// =====================================================================
// Detalhes
// =====================================================================
let observadorDetalhes = null;
let idDetalhesAtual = null;

function renderDetalhes() {
  let secao = el.viewport.querySelector(".details");

  // Fechar
  if (!estado.selecao) {
    observadorDetalhes?.disconnect();
    idDetalhesAtual = null;
    if (secao) secao.remove();
    el.conteudo.inert = false;
    if (quemAbriu) {
      const { elemento, chave } = quemAbriu;
      quemAbriu = null;
      const alvo = elemento.isConnected
        ? elemento
        : chave && document.querySelector(`[data-focus-key="${CSS.escape(chave)}"]`);
      alvo?.focus({ preventScroll: true });
    }
    return;
  }

  const { ids, indice } = estado.selecao;
  const pokemon = getPokemonById(ids[indice]);
  const anterior = indice > 0 ? getPokemonById(ids[indice - 1]) : null;
  const proximo = indice < ids.length - 1 ? getPokemonById(ids[indice + 1]) : null;
  const f = estado.favoritos;

  // Abrir: a seção é criada uma vez; a animação de entrada toca só agora
  const abrindo = !secao;
  if (abrindo) {
    secao = document.createElement("section");
    secao.className = "details";
    secao.setAttribute("role", "dialog");
    secao.setAttribute("aria-modal", "true");
    secao.setAttribute("aria-labelledby", "detalhes-titulo");
    el.viewport.append(secao);
    el.conteudo.inert = true;
  }

  secao.style.setProperty("--type-color", pokemon.types[0].color);
  trocarHtml(
    secao,
    pokemonDetails({
      pokemon,
      treinadores: getTrainersOf(pokemon.id),
      anterior,
      proximo,
      posicao: indice + 1,
      total: ids.length,
      isFavorite: f.ids.has(pokemon.id),
      isSaving: f.salvando.has(pokemon.id),
      favoritesEnabled: f.habilitado,
    }),
  );

  // Ao abrir, o foco vai para "Voltar" (quem usa teclado sabe onde está).
  if (abrindo) secao.querySelector('[data-action="details-close"]').focus();

  // Se o botão que tinha o foco ficou desativado (fim da lista), o foco vai para o outro.
  if (document.activeElement === document.body || !secao.contains(document.activeElement)) {
    if (!abrindo) secao.querySelector(".details__step:not(:disabled)")?.focus({ preventScroll: true });
  }

  const corpo = secao.querySelector(".details__body");
  if (idDetalhesAtual !== pokemon.id) corpo.scrollTop = 0;
  idDetalhesAtual = pokemon.id;
  observarRolagem(corpo);
}

/**
 * A área dos detalhes só rola quando o conteúdo não cabe de verdade (celular, janela pequena).
 * Se cabe (folga de 4 px), a rolagem fica desligada: sem isso, 1 px a mais já deixa
 * o trackpad "balançar" a área para cima e para baixo (efeito elástico).
 */
function observarRolagem(corpo) {
  observadorDetalhes?.disconnect();
  const medir = () => corpo.toggleAttribute("data-rola", corpo.scrollHeight - corpo.clientHeight > 4);
  medir();
  observadorDetalhes = new ResizeObserver(medir);
  observadorDetalhes.observe(corpo);
  if (corpo.firstElementChild) observadorDetalhes.observe(corpo.firstElementChild);
}

function abrirDetalhes(id, ids = TODOS_IDS, indice) {
  if (!quemAbriu) {
    const ativo = document.activeElement;
    quemAbriu = ativo && ativo !== document.body ? { elemento: ativo, chave: ativo.dataset.focusKey } : null;
  }
  const posicao = indice ?? ids.indexOf(id);
  estado.selecao = { ids, indice: posicao >= 0 ? posicao : 0 };
  renderDetalhes();
}

function fecharDetalhes() {
  estado.selecao = null;
  renderDetalhes();
}

function irPara(delta) {
  const s = estado.selecao;
  if (!s) return;
  const indice = s.indice + delta;
  if (indice >= 0 && indice < s.ids.length) {
    estado.selecao = { ...s, indice };
    renderDetalhes();
  }
}

/** "Outros do tipo": abre o Pokémon na ordem da Pokédex inteira. */
function abrirRelacionado(id) {
  estado.selecao = { ids: TODOS_IDS, indice: TODOS_IDS.indexOf(id) };
  renderDetalhes();
}

/** "Ver os N do tipo X na Pokédex": fecha os detalhes e aplica o filtro. */
function filtrarTipo(nomeTipo) {
  quemAbriu = null;
  estado.selecao = null;
  renderDetalhes();
  estado.aba = "pokedex";
  estado.busca = "";
  estado.tipo = nomeTipo;
  renderConteudo();
  el.conteudo.scrollTo({ top: 0 });
}

function verTreinador(treinadorId) {
  quemAbriu = null;
  estado.selecao = null;
  renderDetalhes();
  estado.aba = "treinadores";
  estado.treinadorDestaque = treinadorId;
  renderConteudo();
  const card = document.getElementById(`treinador-${treinadorId}`);
  card?.scrollIntoView({ block: "center", behavior: "smooth" });
  card?.focus({ preventScroll: true });
}

function sortear() {
  const atualId = estado.selecao ? estado.selecao.ids[estado.selecao.indice] : null;
  let sorteado;
  do {
    sorteado = TODOS[Math.floor(Math.random() * TODOS.length)];
  } while (sorteado.id === atualId && TODOS.length > 1);

  // O sensor faz uma varredura: um <span> novo faz a animação tocar de novo.
  el.sensor.innerHTML = '<span class="device__sweep"></span>';
  abrirDetalhes(sorteado.id, TODOS_IDS);
}

// =====================================================================
// Abas e filtros
// =====================================================================
function trocarAba(nova) {
  estado.aba = nova;
  estado.treinadorDestaque = null;
  renderConteudo();
  el.conteudo.scrollTo({ top: 0 });
}

function alternarTipo(nome) {
  estado.tipo = estado.tipo === nome ? null : nome;
  atualizar();
}

/** Trocar o campo usa a direção mais natural dele (números/nome: crescente; atributos: decrescente). */
function ordenarPor(campo) {
  const opcao = SORT_OPTIONS.find((o) => o.value === campo);
  estado.ordem = { campo, direcao: opcao?.direcaoPadrao ?? "asc" };
  atualizar();
}

function inverterDirecao() {
  estado.ordem = { ...estado.ordem, direcao: estado.ordem.direcao === "asc" ? "desc" : "asc" };
  atualizar();
}

function limparFiltros() {
  estado.busca = "";
  estado.tipo = null;
  atualizar();
}

// =====================================================================
// Favoritos (json-server)
// =====================================================================
async function carregarFavoritos() {
  const f = estado.favoritos;
  f.carregando = true;
  renderStatus();
  try {
    f.ids = await favoriteService.getFavoriteIds();
    f.erro = null;
  } catch (e) {
    f.erro = `Não foi possível carregar os favoritos. ${e.message}`;
  } finally {
    f.carregando = false;
  }
}

async function alternarFavorito(pokemonId) {
  const f = estado.favoritos;
  if (!f.habilitado || f.salvando.has(pokemonId)) return;
  const pokemon = getPokemonById(pokemonId);

  f.salvando.add(pokemonId);
  atualizarEstrelas(document, pokemonId, { isFavorite: f.ids.has(pokemonId), isSaving: true, enabled: true });
  renderStatus();

  let agoraEFavorito = f.ids.has(pokemonId);
  try {
    agoraEFavorito = await favoriteService.toggle(pokemonId);
    if (agoraEFavorito) f.ids.add(pokemonId);
    else f.ids.delete(pokemonId);
    f.erro = null;
    mostrarToast(
      agoraEFavorito
        ? `${pokemon.name} foi adicionado aos favoritos.`
        : `${pokemon.name} foi removido dos favoritos.`,
      agoraEFavorito ? "add" : "remove",
    );
  } catch (e) {
    f.erro = `Não foi possível salvar o favorito. ${e.message}`;
    mostrarToast(f.erro, "error");
  } finally {
    f.salvando.delete(pokemonId);
  }

  // Na aba Favoritos a própria lista muda; nas outras, só o contador da aba.
  if (estado.aba === "favoritos") atualizar();
  else atualizarContadoresAbas();

  atualizarEstrelas(document, pokemonId, {
    isFavorite: f.ids.has(pokemonId),
    isSaving: false,
    enabled: true,
    pop: agoraEFavorito,
  });
  renderStatus();
}

// =====================================================================
// Bootstrap: toasts e tooltips
// =====================================================================
function mostrarToast(mensagem, tipo = "add") {
  const bs = window.bootstrap;
  if (!bs) return;

  const icone = tipo === "error" ? icon("signal", { size: 18 }) : icon("star", { filled: tipo === "add", size: 18 });
  const toast = document.createElement("div");
  toast.className = `toast pokedex-toast pokedex-toast--${tipo} align-items-center border-0`;
  toast.setAttribute("role", tipo === "error" ? "alert" : "status");
  toast.setAttribute("aria-live", tipo === "error" ? "assertive" : "polite");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <span class="pokedex-toast__icon ms-3" aria-hidden="true">${icone}</span>
      <div class="toast-body ps-0">${esc(mensagem)}</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar aviso"></button>
    </div>`;

  // No máximo 3 avisos na tela ao mesmo tempo
  while (el.toasts.children.length >= 3) el.toasts.firstElementChild.remove();
  el.toasts.append(toast);
  toast.addEventListener("hidden.bs.toast", () => toast.remove());
  new bs.Toast(toast, { delay: tipo === "error" ? 6000 : 2600 }).show();
}

let tooltips = [];

function ativarTooltips() {
  const bs = window.bootstrap;
  // Só onde existe mouse: no celular, o toque deixaria o balão preso na tela.
  if (!bs || !window.matchMedia("(hover: hover)").matches) return;
  tooltips = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map(
    (alvo) => new bs.Tooltip(alvo, { trigger: "hover", placement: "bottom" }),
  );
}

function esconderTooltips() {
  tooltips.forEach((t) => t.hide());
}

// =====================================================================
// Capa e tema
// =====================================================================
function aplicarCapa() {
  el.raiz.inert = estado.capa !== null;
  if (estado.capa) el.raiz.dataset.capa = estado.capa;
  else delete el.raiz.dataset.capa;
}

function abrirCapa(inicio) {
  montarCapa({
    inicio,
    onAbrindo: () => {
      estado.capa = "abrindo";
      aplicarCapa();
    },
    onLigar: () => {
      estado.capa = null;
      estado.bootKey += 1;
      // Duas cópias da mesma animação: trocar o nome faz a tela "ligar" de novo.
      el.tela.dataset.boot = estado.bootKey % 2 ? "a" : "b";
      aplicarCapa();
    },
  });
}

function desligar() {
  esconderTooltips();
  estado.capa = "fechando";
  aplicarCapa();
  abrirCapa("fechando");
}

function alternarTema() {
  estado.tema = estado.tema === "dark" ? "light" : "dark";
  gravarStorage(STORAGE_KEYS.theme, estado.tema);
  aplicarTema();
}

function aplicarTema() {
  const raiz = document.documentElement;
  raiz.dataset.theme = estado.tema;
  raiz.dataset.bsTheme = estado.tema; // o Bootstrap (toasts, tooltips) acompanha o tema
  raiz.style.colorScheme = estado.tema;
  const noturno = estado.tema === "dark";
  el.botaoTema.setAttribute("aria-pressed", String(noturno));
  el.botaoTema.querySelector(".icon").outerHTML = icon(noturno ? "moon" : "sun");
}

// =====================================================================
// Eventos (delegação: um ouvinte só para a página toda)
// =====================================================================
const ACOES = {
  theme: () => alternarTema(),
  power: () => desligar(),
  random: () => sortear(),
  tab: (alvo) => trocarAba(alvo.dataset.tab),
  "type-all": () => {
    estado.tipo = null;
    atualizar();
  },
  type: (alvo) => alternarTipo(alvo.dataset.type),
  "sort-direction": () => inverterDirecao(),
  "clear-search": () => {
    estado.busca = "";
    atualizar();
    el.conteudo.querySelector("#pesquisa")?.focus();
  },
  "clear-filters": () => limparFiltros(),
  "go-pokedex": () => trocarAba("pokedex"),
  "open-pokemon": (alvo) =>
    abrirDetalhes(
      Number(alvo.dataset.id),
      resultado().map((p) => p.id),
    ),
  "open-team": (alvo) => {
    const treinador = TREINADORES.find((t) => t.id === Number(alvo.dataset.trainer));
    const indice = Number(alvo.dataset.index);
    abrirDetalhes(treinador.pokemonIds[indice], treinador.pokemonIds, indice);
  },
  "toggle-favorite": (alvo) => alternarFavorito(Number(alvo.dataset.id)),
  "details-close": () => fecharDetalhes(),
  "details-prev": () => irPara(-1),
  "details-next": () => irPara(1),
  "view-trainer": (alvo) => verTreinador(Number(alvo.dataset.id)),
  "open-related": (alvo) => abrirRelacionado(Number(alvo.dataset.id)),
  "filter-type": (alvo) => filtrarTipo(alvo.dataset.type),
  reload: () => window.location.reload(),
};

function ligarEventos() {
  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-action]");
    if (!alvo || alvo.disabled) return;
    const acao = ACOES[alvo.dataset.action];
    if (acao && estado.pronto) acao(alvo);
    else if (alvo.dataset.action === "reload") ACOES.reload();
  });

  // Pesquisa: a lista atualiza a cada tecla
  el.conteudo.addEventListener("input", (e) => {
    if (e.target.id !== "pesquisa") return;
    estado.busca = e.target.value;
    atualizar();
  });

  el.conteudo.addEventListener("change", (e) => {
    if (e.target.id === "ordenar") ordenarPor(e.target.value);
  });

  el.conteudo.addEventListener("keydown", (e) => {
    // Esc limpa a pesquisa
    if (e.target.id === "pesquisa" && e.key === "Escape" && estado.busca) {
      e.preventDefault();
      estado.busca = "";
      atualizar();
      return;
    }

    // Abas: setas, Home e End trocam de aba
    if (e.target.getAttribute("role") === "tab") {
      const lista = abas();
      const indice = lista.findIndex((a) => a.id === e.target.dataset.tab);
      const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (e.key === "Home" || e.key === "End" || delta) {
        e.preventDefault();
        let proximo = indice + (delta ?? 0);
        if (e.key === "Home") proximo = 0;
        if (e.key === "End") proximo = lista.length - 1;
        proximo = (proximo + lista.length) % lista.length;
        trocarAba(lista[proximo].id);
        document.getElementById(`aba-${lista[proximo].id}`)?.focus();
      }
    }
  });

  // Detalhes: Esc fecha, setas esquerda/direita navegam
  document.addEventListener("keydown", (e) => {
    if (!estado.selecao || estado.capa !== null) return;
    if (e.key === "Escape") {
      e.preventDefault();
      fecharDetalhes();
      return;
    }
    if (e.target.closest?.("input, select, textarea")) return;
    if (e.key === "ArrowLeft") irPara(-1);
    if (e.key === "ArrowRight") irPara(1);
  });
}

// =====================================================================
// Início
// =====================================================================
async function iniciar() {
  ativarImagensReserva();
  aplicarTema();
  ligarEventos();
  ativarTooltips();
  aplicarCapa();
  abrirCapa("fechada");

  el.conteudo.innerHTML = emptyState({ titulo: "Carregando a Pokédex...", carregando: true });
  renderStatus();

  let dados;
  try {
    dados = await carregarDados();
  } catch (e) {
    el.conteudo.innerHTML = emptyState({
      titulo: "Não foi possível carregar os Pokémon",
      textoHtml: `${esc(e.message)} Rode <code>npm start</code> e abra <code>http://localhost:3000</code>.`,
      acao: { label: "Tentar de novo", action: "reload" },
    });
    estado.favoritos.erro = "Sem dados: o json-server não respondeu.";
    renderStatus();
    return;
  }

  inicializar(dados);
  TODOS = getAllPokemon();
  TODOS_IDS = TODOS.map((p) => p.id);
  TIPOS = getAvailableTypes();
  TREINADORES = getTrainers();
  estado.pronto = true;

  if (dados.origem === "api") {
    estado.favoritos.habilitado = true;
    renderConteudo();
    await carregarFavoritos();
    renderStatus();
    atualizar();
  } else {
    // Dados da cópia local (sem json-server): a Pokédex funciona, as estrelas ficam desativadas.
    estado.favoritos.erro = `Favoritos desativados: o json-server não respondeu em ${API_URL}. Rode npm start.`;
    renderConteudo();
    renderStatus();
  }
}

iniciar();
