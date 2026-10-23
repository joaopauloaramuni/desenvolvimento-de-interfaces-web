import { esc } from "../utils/dom.js";

export function iniciais(nome) {
  return nome
    .replace(/[^A-Za-zÀ-ÿ ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((parte) => parte[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Imagem do treinador (sprite do Pokémon Showdown) dentro de uma "janelinha".
 * Tenta cada URL de treinador.sprites em ordem; se nenhuma carregar
 * (sem internet, arquivo inexistente), mostra as iniciais.
 * size: "lg" no card do treinador, "sm" nos botões dos detalhes.
 */
export function trainerAvatar(treinador, size = "lg") {
  const urls = treinador.sprites ?? [];
  const conteudo = urls.length
    ? `<img class="trainer-avatar__img is-pixelated" src="${esc(urls[0])}" alt="" width="80" height="80" loading="lazy" decoding="async" draggable="false" data-reserva="trainer" data-indice="0" data-sprites="${esc(JSON.stringify(urls))}" data-iniciais="${esc(iniciais(treinador.name))}" />`
    : `<span class="trainer-avatar__monogram">${esc(iniciais(treinador.name))}</span>`;
  return `<span class="trainer-avatar trainer-avatar--${size}" aria-hidden="true">${conteudo}</span>`;
}
