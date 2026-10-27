import { esc, styleVars } from "../utils/dom.js";

/** Selo de um tipo, com a cor do tipo e o nome em pt-BR. */
export function typeBadge(type, size = "md") {
  return `<span class="type-badge type-badge--${size}"${styleVars({ "--type-color": type.color, "--type-ink": type.ink })} title="${esc(type.name)}">${esc(type.label)}</span>`;
}
