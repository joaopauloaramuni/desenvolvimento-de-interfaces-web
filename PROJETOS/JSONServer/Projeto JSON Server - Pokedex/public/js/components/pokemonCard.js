import { STATS } from "../model/pokemon.js";
import { esc, styleVars } from "../utils/dom.js";
import { favoriteButton } from "./favoriteButton.js";
import { pokemonImage } from "./pokemonImage.js";
import { statBar } from "./statBar.js";
import { typeBadge } from "./typeBadge.js";

/**
 * Um Pokémon na lista: número, nome, tipos e os seis atributos.
 * O card inteiro abre os detalhes; a estrela fica fora do botão (botão dentro de botão não é permitido).
 * <li class="col">: cada card é uma coluna do grid do Bootstrap (row-cols-*).
 */
export function pokemonCard({ pokemon, isFavorite, isSaving, favoritesEnabled }) {
  const cor = pokemon.types[0].color;

  return `<li class="col">
    <div class="pokemon-card h-100"${styleVars({ "--type-color": cor })}>
      <button type="button" class="pokemon-card__open" data-action="open-pokemon" data-id="${pokemon.id}" data-focus-key="card-${pokemon.id}">
        <span class="pokemon-card__window">
          ${pokemonImage({ src: pokemon.sprite, pixelated: true, size: 96 })}
        </span>
        <span class="pokemon-card__info">
          <span class="pokemon-card__number">${pokemon.number}</span>
          <span class="pokemon-card__name">${esc(pokemon.name)}</span>
          <span class="pokemon-card__types">${pokemon.types.map((t) => typeBadge(t, "sm")).join("")}</span>
        </span>
        <span class="pokemon-card__stats">
          ${STATS.map((stat) =>
            statBar({
              variant: "compact",
              label: stat.label,
              shortLabel: stat.short,
              value: pokemon.stats[stat.key],
              color: cor,
            }),
          ).join("")}
        </span>
      </button>
      ${favoriteButton({
        pokemon,
        isFavorite,
        isSaving,
        enabled: favoritesEnabled,
        className: "pokemon-card__favorite",
        focusKey: `fav-${pokemon.id}`,
      })}
    </div>
  </li>`;
}

/**
 * Lista de Pokémon. Sem itens, mostra o estado vazio recebido.
 * Grid do Bootstrap: 1 coluna no celular, 2 no tablet, 3 no notebook e 4 em telas grandes.
 */
export function pokemonList({ pokemons, favoriteIds, salvando, favoritesEnabled, vazio }) {
  if (pokemons.length === 0) return vazio;

  return `<ul class="pokemon-list row row-cols-1 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-3 list-unstyled">
    ${pokemons
      .map((pokemon) =>
        pokemonCard({
          pokemon,
          isFavorite: favoriteIds.has(pokemon.id),
          isSaving: salvando.has(pokemon.id),
          favoritesEnabled,
        }),
      )
      .join("")}
  </ul>`;
}
