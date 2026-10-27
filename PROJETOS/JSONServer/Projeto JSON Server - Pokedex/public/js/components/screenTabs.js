import { esc } from "../utils/dom.js";

/**
 * Abas da tela: Pokédex, Favoritos e Treinadores.
 * Segue o padrão de abas acessíveis: setas esquerda/direita trocam de aba (tratado no main.js).
 */
export function screenTabs({ abas, ativa }) {
  return `<div class="screen-tabs" role="tablist" aria-label="Seções da Pokédex">
    ${abas
      .map((aba) => {
        const selecionada = aba.id === ativa;
        return `<button id="aba-${aba.id}" type="button" role="tab" class="screen-tabs__tab"
          data-action="tab" data-tab="${aba.id}" data-focus-key="tab-${aba.id}"
          aria-selected="${selecionada}" aria-controls="painel-${aba.id}" tabindex="${selecionada ? 0 : -1}">
          ${esc(aba.label)}
          <span class="screen-tabs__count" ${aba.fixo ? "data-fixo" : ""} data-tab-count="${aba.id}">${aba.count}</span>
        </button>`;
      })
      .join("")}
  </div>`;
}
