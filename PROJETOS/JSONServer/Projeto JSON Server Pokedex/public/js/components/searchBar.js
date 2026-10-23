import { esc } from "../utils/dom.js";
import { icon } from "./icon.js";

/**
 * Campo de pesquisa por nome ou número (form-control do Bootstrap com o visual da tela).
 * A lista atualiza a cada tecla. O campo é montado uma vez só por aba,
 * então o foco e o cursor não se perdem enquanto a pessoa digita.
 */
export function searchBar(value) {
  return `<div class="search-bar" role="search">
    <label for="pesquisa" class="visually-hidden">Pesquisar Pokémon por nome ou número</label>
    <div class="search-bar__field">
      ${icon("search", { className: "search-bar__icon" })}
      <input id="pesquisa" class="form-control search-bar__input" type="search" value="${esc(value)}"
        placeholder="Pesquisar Pokémon..." autocomplete="off" spellcheck="false" enterkeyhint="search"
        aria-describedby="pesquisa-dica" />
      <button type="button" class="search-bar__clear" data-action="clear-search" aria-label="Limpar pesquisa" ${value ? "" : "hidden"}>
        ${icon("close", { size: 18 })}
      </button>
    </div>
    <p id="pesquisa-dica" class="search-bar__hint">Nome ou número, como Bulba ou 25</p>
  </div>`;
}
