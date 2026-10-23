import { STATS } from "../model/pokemon.js";
import { getBestStat, getSameTypePokemon } from "../services/pokedexService.js";
import { esc, styleVars } from "../utils/dom.js";
import { classicPokedex } from "./classicPokedex.js";
import { favoriteButton } from "./favoriteButton.js";
import { icon } from "./icon.js";
import { pokemonImage } from "./pokemonImage.js";
import { statBar } from "./statBar.js";
import { trainerAvatar } from "./trainerAvatar.js";
import { typeBadge } from "./typeBadge.js";

/**
 * Conteúdo dos detalhes de um Pokémon, abertos por cima da lista, dentro da tela do aparelho.
 * O <section class="details"> é criado uma vez (main.js) e só o conteúdo dele muda
 * ao ir para o anterior/próximo, como no React (a entrada anima só ao abrir).
 * Teclado (main.js): Esc fecha, setas esquerda/direita vão para o anterior/próximo.
 */
export function pokemonDetails({
  pokemon,
  treinadores,
  anterior,
  proximo,
  posicao,
  total,
  isFavorite,
  isSaving,
  favoritesEnabled,
}) {
  const cor = pokemon.types[0].color;
  const tipoPrincipal = pokemon.types[0];
  const melhor = getBestStat(pokemon);
  const mesmoTipo = getSameTypePokemon(pokemon);
  const mostrados = mesmoTipo.slice(0, 8);

  const passo = (p, vazio) =>
    p ? `<span class="details__step-number">${p.number}</span> ${esc(p.name)}` : vazio;

  const treinadoresHtml = treinadores.length
    ? `<ul class="details__trainers">
        ${treinadores
          .map(
            (t) => `<li>
              <button type="button" class="details__trainer" data-action="view-trainer" data-id="${t.id}">
                ${trainerAvatar(t, "sm")}
                ${esc(t.name)}
              </button>
            </li>`,
          )
          .join("")}
      </ul>`
    : `<p class="details__muted">Nenhum treinador do arquivo tem este Pokémon.</p>`;

  const relacionadosHtml = mostrados.length
    ? `<h3 class="details__heading">Outros do tipo ${esc(tipoPrincipal.label)}</h3>
      <ul class="details__related">
        ${mostrados
          .map(
            (outro) => `<li>
              <button type="button" class="details__related-item"${styleVars({ "--type-color": outro.types[0].color })}
                data-action="open-related" data-id="${outro.id}">
                ${pokemonImage({ src: outro.sprite, pixelated: true, size: 64 })}
                <span class="details__related-name">${esc(outro.name)}</span>
                <span class="details__related-number">${outro.number}</span>
              </button>
            </li>`,
          )
          .join("")}
      </ul>
      <button type="button" class="screen-button details__related-all" data-action="filter-type" data-type="${esc(tipoPrincipal.name)}">
        Ver os ${mesmoTipo.length + 1} do tipo ${esc(tipoPrincipal.label)} na Pokédex
      </button>`
    : "";

  return `
    <div class="details__bar">
      <button type="button" class="screen-button" data-action="details-close" data-focus-key="details-close">
        ${icon("chevronLeft", { size: 18 })}
        Voltar
      </button>
      <span class="details__position">${posicao} de ${total}</span>
      ${favoriteButton({ pokemon, isFavorite, isSaving, enabled: favoritesEnabled, focusKey: "details-fav" })}
    </div>

    <div class="details__body">
      <div class="details__layout">
        <figure class="details__visual">
          <span class="details__watermark" aria-hidden="true">${pokemon.number}</span>
          ${pokemonImage({ src: pokemon.artwork, alt: `Arte de ${pokemon.name}`, className: "details__art", eager: true, size: 475 })}
        </figure>

        ${classicPokedex(pokemon)}

        <div class="details__info">
          <p class="details__number">${pokemon.number}</p>
          <h2 id="detalhes-titulo" class="details__name">${esc(pokemon.name)}</h2>
          <div class="details__types">${pokemon.types.map((t) => typeBadge(t)).join("")}</div>

          <h3 class="details__heading">Atributos base</h3>
          <div class="details__stats">
            ${STATS.map((s) => statBar({ label: s.label, value: pokemon.stats[s.key], color: cor })).join("")}
          </div>
          <p class="details__total"><span>Total</span><strong>${pokemon.total}</strong></p>
          <p class="details__highlight">
            <span class="details__highlight-label">Ponto forte</span>
            ${esc(melhor.label)} ${melhor.valor}:
            ${melhor.posicao === 1 ? "o maior valor" : `${melhor.posicao}º maior valor`} entre os 151 Pokémon.
          </p>
        </div>

        <div class="details__extra">
          <h3 class="details__heading details__heading--first">Treinadores</h3>
          ${treinadoresHtml}
          ${relacionadosHtml}
        </div>
      </div>
    </div>

    <nav class="details__nav" aria-label="Navegar entre Pokémon">
      <button type="button" class="details__step" data-action="details-prev" data-focus-key="details-prev" ${anterior ? "" : "disabled"}>
        ${icon("chevronLeft", { size: 18 })}
        <span class="details__step-text">${passo(anterior, "Início da lista")}</span>
      </button>
      <button type="button" class="details__step details__step--next" data-action="details-next" data-focus-key="details-next" ${proximo ? "" : "disabled"}>
        <span class="details__step-text">${passo(proximo, "Fim da lista")}</span>
        ${icon("chevronRight", { size: 18 })}
      </button>
    </nav>`;
}
