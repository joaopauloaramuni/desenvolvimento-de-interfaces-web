import { htmlParaElemento } from "../utils/dom.js";

/**
 * Capa da Pokédex: o aparelho "de verdade", fechado e aberto
 * (img/pokedex-fechada.webp e img/pokedex-aberta.webp).
 *
 * - Ao carregar a página, a Pokédex aparece fechada. Um clique (ou Enter) abre a tampa,
 *   a tela mostra "INICIANDO..." e o aparelho com a Pokédex liga.
 * - O botão "Fechar" do aparelho traz a capa de volta: a tampa fecha por cima da
 *   Pokédex aberta. A lista, os filtros e o Pokémon aberto continuam como estavam.
 *
 * A tampa é a própria imagem fechada recortada (clip-path) no retângulo da tampa e
 * girada na dobradiça da direita (posições em porcentagem no CSS).
 *
 * fase: "fechada" -> "abrindo" -> "iniciando" -> onLigar()
 *       "fechando" -> "fechada"
 */
const DURACAO = { abrir: 750, iniciar: 1100, fechar: 650 };

const LEGENDA = {
  fechada: "Toque na Pokédex para abrir",
  abrindo: "Abrindo...",
  iniciando: "Iniciando a Pokédex...",
  fechando: "Fechando...",
};

function semMovimento() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * Cria a capa, coloca no <body> e controla as fases.
 * onAbrindo: a tampa começou a abrir (o aparelho volta a aparecer por baixo).
 * onLigar: a capa terminou e saiu da tela.
 */
export function montarCapa({ inicio = "fechada", onAbrindo, onLigar }) {
  const capa = htmlParaElemento(`
    <div class="cover" data-fase="${inicio}">
      <button type="button" class="cover__device" aria-label="Abrir a Pokédex">
        <img class="cover__img" src="./img/pokedex-aberta.webp" alt="" width="1092" height="1372" draggable="false" />
        <span class="cover__lens" aria-hidden="true"></span>
        <span class="cover__led" aria-hidden="true"></span>
        <span class="cover__scan" aria-hidden="true"></span>
        <img class="cover__lid" src="./img/pokedex-fechada.webp" alt="" width="1092" height="1372" draggable="false" />
      </button>
      <p class="cover__hint" role="status" aria-live="polite"></p>
    </div>`);

  const botao = capa.querySelector(".cover__device");
  const legenda = capa.querySelector(".cover__hint");
  let timer;

  function irPara(fase) {
    capa.dataset.fase = fase;
    botao.disabled = fase !== "fechada";
    legenda.innerHTML =
      LEGENDA[fase] + (fase === "fechada" ? '<span class="cover__key"> (ou aperte Enter)</span>' : "");

    const fator = semMovimento() ? 0.05 : 1;
    clearTimeout(timer);
    if (fase === "abrindo") timer = setTimeout(() => irPara("iniciando"), DURACAO.abrir * fator);
    if (fase === "iniciando") {
      timer = setTimeout(() => {
        capa.remove();
        onLigar?.();
      }, DURACAO.iniciar * fator);
    }
    if (fase === "fechando") timer = setTimeout(() => irPara("fechada"), DURACAO.fechar * fator);
    if (fase === "fechada") botao.focus({ preventScroll: true });
  }

  botao.addEventListener("click", () => {
    if (capa.dataset.fase !== "fechada") return;
    irPara("abrindo");
    onAbrindo?.();
  });

  document.body.append(capa);
  irPara(inicio);
  return capa;
}
