/**
 * Pequenos utilitários para montar HTML com template strings (sem React).
 */

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapa texto para usar dentro do HTML (evita que um nome vire código). */
export function esc(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Junta classes, ignorando as vazias: cx("a", false && "b", "c") -> "a c" */
export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/** Monta um atributo style com variáveis CSS: styleVars({ "--type-color": "#f00" }) */
export function styleVars(vars) {
  const css = Object.entries(vars)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
  return css ? ` style="${esc(css)}"` : "";
}

/** Transforma um texto HTML em elemento (o primeiro do texto). */
export function htmlParaElemento(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

/**
 * Troca o conteúdo de um elemento e devolve o foco para o "mesmo" botão,
 * se ele existir no HTML novo (procurado pelo atributo data-focus-key).
 * Sem isso, quem usa teclado perderia o lugar a cada atualização da tela.
 */
export function trocarHtml(elemento, html) {
  const ativo = document.activeElement;
  const chave = ativo && elemento.contains(ativo) ? ativo.dataset.focusKey : null;
  elemento.innerHTML = html;
  if (chave) {
    elemento.querySelector(`[data-focus-key="${CSS.escape(chave)}"]`)?.focus({ preventScroll: true });
  }
}
