import { esc, styleVars } from "../utils/dom.js";

/**
 * Filtro por tipo: um botão por tipo presente no pokedex-data.json.
 * Clicar no tipo selecionado (ou em "Todos") tira o filtro.
 */
export function typeFilter({ tipos, contagem, total, selecionado }) {
  return `<fieldset class="type-filter">
    <legend class="type-filter__legend">Tipo</legend>
    <div class="type-filter__chips">
      <button type="button" class="type-chip type-chip--all" data-action="type-all" data-focus-key="type-all"
        aria-pressed="${selecionado === null}">
        Todos <span class="type-chip__count">${total}</span>
      </button>
      ${tipos
        .map((tipo) => {
          const quantidade = contagem.get(tipo.name) ?? 0;
          return `<button type="button" class="type-chip" data-action="type" data-type="${esc(tipo.name)}"
            data-focus-key="type-${esc(tipo.name)}" aria-pressed="${selecionado === tipo.name}"
            ${quantidade === 0 ? "data-empty" : ""}${styleVars({ "--chip-color": tipo.color, "--chip-ink": tipo.ink })}>
            <span class="type-chip__dot" aria-hidden="true"></span>
            ${esc(tipo.label)}
            <span class="type-chip__count">${quantidade}</span>
          </button>`;
        })
        .join("")}
    </div>
  </fieldset>`;
}
