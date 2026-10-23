import { esc } from "../utils/dom.js";
import { icon } from "./icon.js";

const MENSAGENS = {
  off: "Favoritos desativados. Inicie o json-server com npm start.",
  loading: "Carregando favoritos do json-server...",
  saving: "Salvando favorito no json-server...",
  ok: "Favoritos salvos no json-server",
};

/** Barra de status no rodapé da tela: situação dos favoritos e quantos existem. */
export function statusBar({ status, erro, totalFavoritos }) {
  const mensagem = status === "error" || (status === "off" && erro) ? erro : MENSAGENS[status];

  return `<div class="status-bar" data-status="${status}">
    <span class="status-bar__dot" aria-hidden="true"></span>
    <p class="status-bar__message" role="status" aria-live="polite">${esc(mensagem)}</p>
    <span class="status-bar__count" title="Favoritos">
      ${icon("star", { filled: true, size: 14 })}
      <span class="visually-hidden">Favoritos: </span>${totalFavoritos}
    </span>
  </div>`;
}
