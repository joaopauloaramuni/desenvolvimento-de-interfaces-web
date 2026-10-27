import { SORT_OPTIONS } from "../services/pokedexService.js";
import { icon } from "./icon.js";

function rotuloDirecao(crescente) {
  return crescente ? "Ordem crescente. Inverter para decrescente" : "Ordem decrescente. Inverter para crescente";
}

/** Ordenação por número, nome, atributo ou total, crescente ou decrescente (form-select do Bootstrap). */
export function sortControl(ordem) {
  const crescente = ordem.direcao === "asc";

  return `<div class="sort-control">
    <label for="ordenar" class="sort-control__label">Ordenar por</label>
    <div class="sort-control__row">
      <select id="ordenar" class="form-select sort-control__select">
        ${SORT_OPTIONS.map(
          (o) => `<option value="${o.value}" ${o.value === ordem.campo ? "selected" : ""}>${o.label}</option>`,
        ).join("")}
      </select>
      <button type="button" class="sort-control__direction" data-action="sort-direction"
        aria-label="${rotuloDirecao(crescente)}" title="${crescente ? "Crescente" : "Decrescente"}">
        ${icon(crescente ? "arrowUp" : "arrowDown", { size: 18 })}
      </button>
    </div>
  </div>`;
}

/** Atualiza o select e a seta sem remontar o controle. */
export function atualizarSortControl(raiz, ordem) {
  const crescente = ordem.direcao === "asc";
  const select = raiz.querySelector("#ordenar");
  const botao = raiz.querySelector('[data-action="sort-direction"]');
  if (!select || !botao) return;
  select.value = ordem.campo;
  botao.setAttribute("aria-label", rotuloDirecao(crescente));
  botao.title = crescente ? "Crescente" : "Decrescente";
  botao.innerHTML = icon(crescente ? "arrowUp" : "arrowDown", { size: 18 });
}
