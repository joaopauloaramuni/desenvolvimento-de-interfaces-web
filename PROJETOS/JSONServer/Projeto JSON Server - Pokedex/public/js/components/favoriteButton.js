import { cx, esc } from "../utils/dom.js";
import { icon } from "./icon.js";

function dica(enabled, isFavorite) {
  if (!enabled) return "Inicie o json-server (npm start) para usar os favoritos";
  return isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos";
}

/**
 * Estrela de favorito. Fica desativada sem json-server e enquanto ele responde.
 * data-fav-id: usado para atualizar só as estrelas daquele Pokémon (card e detalhes).
 */
export function favoriteButton({ pokemon, isFavorite, isSaving, enabled, className = "", focusKey }) {
  return `<button type="button" class="${cx("favorite-button", className)}"
    data-action="toggle-favorite" data-id="${pokemon.id}" data-fav-id="${pokemon.id}"
    ${focusKey ? `data-focus-key="${esc(focusKey)}"` : ""}
    aria-pressed="${isFavorite}" aria-label="Favorito: ${esc(pokemon.name)}"
    title="${esc(dica(enabled, isFavorite))}"
    ${!enabled || isSaving ? "disabled" : ""} ${isSaving ? "data-saving" : ""}>
    ${icon("star", { filled: isFavorite, size: 22 })}
  </button>`;
}

/** Atualiza na tela todas as estrelas de um Pokémon, sem redesenhar o card inteiro. */
export function atualizarEstrelas(raiz, pokemonId, { isFavorite, isSaving, enabled, pop = false }) {
  raiz.querySelectorAll(`[data-fav-id="${pokemonId}"]`).forEach((botao) => {
    botao.setAttribute("aria-pressed", String(isFavorite));
    botao.title = dica(enabled, isFavorite);
    botao.disabled = !enabled || isSaving;
    botao.toggleAttribute("data-saving", isSaving);
    const svg = botao.querySelector(".icon");
    svg.setAttribute("fill", isFavorite ? "currentColor" : "none");
    svg.classList.toggle("icon--filled", isFavorite);
    // A estrela "pula" só quando acabou de virar favorita (e não a cada redesenho da lista).
    if (pop && isFavorite) {
      botao.removeAttribute("data-pop");
      void botao.offsetWidth; // reinicia a animação
      botao.setAttribute("data-pop", "");
    }
  });
}
