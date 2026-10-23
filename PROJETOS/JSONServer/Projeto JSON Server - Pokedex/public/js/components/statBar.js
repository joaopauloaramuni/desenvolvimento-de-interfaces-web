import { STAT_MAX } from "../config/appConfig.js";
import { esc, styleVars } from "../utils/dom.js";

/**
 * Um atributo: nome, valor e barra.
 * variant="compact" (card): rótulo curto (Atq) com o nome completo para leitores de tela.
 * variant="full" (detalhes): rótulo completo e barra maior, que cresce ao abrir.
 */
export function statBar({ label, shortLabel, value, color, variant = "full", max = STAT_MAX }) {
  const porcentagem = Math.min(100, Math.round((value / max) * 100));
  const rotulo =
    variant === "compact"
      ? `<span aria-hidden="true">${esc(shortLabel)}</span><span class="visually-hidden">${esc(label)}</span>`
      : esc(label);

  return `<span class="stat stat--${variant}"${styleVars({ "--stat-pct": `${porcentagem}%`, "--stat-color": color })}>
    <span class="stat__label">${rotulo}</span>
    <span class="stat__value">${value}</span>
    <span class="stat__track" aria-hidden="true"><span class="stat__fill"></span></span>
  </span>`;
}
