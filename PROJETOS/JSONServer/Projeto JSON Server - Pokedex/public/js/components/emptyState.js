import { esc } from "../utils/dom.js";
import { icon } from "./icon.js";

/**
 * Tela vazia: diz o que aconteceu e oferece o próximo passo.
 * textoHtml já vem pronto (pode ter <code>); acao = { label, action }.
 * carregando: mostra o spinner do Bootstrap no lugar do ícone.
 */
export function emptyState({ titulo, textoHtml, acao, icone = "signal", carregando = false }) {
  const glifo = carregando
    ? `<span class="spinner-border" role="presentation"></span>`
    : icon(icone, { size: 40 });

  return `<div class="empty-state" role="status">
    <span class="empty-state__glyph" aria-hidden="true">${glifo}</span>
    <h2 class="empty-state__title">${esc(titulo)}</h2>
    ${textoHtml ? `<p class="empty-state__text">${textoHtml}</p>` : ""}
    ${
      acao
        ? `<button type="button" class="screen-button screen-button--primary" data-action="${acao.action}" data-focus-key="empty-action">${esc(acao.label)}</button>`
        : ""
    }
  </div>`;
}
