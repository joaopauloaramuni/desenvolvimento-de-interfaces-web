import { SEM_IMAGEM } from "../config/appConfig.js";
import { cx, esc } from "../utils/dom.js";

/**
 * Imagem do Pokémon (PokéAPI). Se a imagem não carregar (sem internet, URL fora do ar),
 * troca pela imagem local sem-imagem.svg: a Pokédex continua funcionando só com o JSON.
 * A troca é feita por ativarImagensReserva(), que escuta os erros de <img> da página toda.
 */
export function pokemonImage({ src, alt = "", className = "", pixelated = false, eager = false, size }) {
  const tamanho = size ? ` width="${size}" height="${size}"` : "";
  return `<img class="${cx(className, pixelated && "is-pixelated")}" src="${esc(src)}" alt="${esc(alt)}"${tamanho} loading="${eager ? "eager" : "lazy"}" decoding="async" draggable="false" data-reserva="pokemon" />`;
}

/** Plano B das imagens: Pokémon -> sem-imagem.svg; treinador -> próximo sprite ou iniciais. */
export function ativarImagensReserva() {
  // O evento "error" de <img> não sobe pela árvore, então é capturado na descida (true).
  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;

      if (img.dataset.reserva === "pokemon") {
        delete img.dataset.reserva; // só uma troca: se a reserva falhar, não entra em laço
        img.classList.remove("is-pixelated");
        img.src = SEM_IMAGEM;
        return;
      }

      if (img.dataset.reserva === "trainer") {
        const urls = JSON.parse(img.dataset.sprites || "[]");
        const proxima = Number(img.dataset.indice || 0) + 1;
        if (proxima < urls.length) {
          img.dataset.indice = String(proxima);
          img.src = urls[proxima];
        } else {
          const monograma = document.createElement("span");
          monograma.className = "trainer-avatar__monogram";
          monograma.textContent = img.dataset.iniciais || "?";
          img.replaceWith(monograma);
        }
      }
    },
    true,
  );
}
