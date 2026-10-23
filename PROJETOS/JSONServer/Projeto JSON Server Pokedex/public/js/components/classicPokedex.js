import { esc, styleVars } from "../utils/dom.js";
import { pokemonImage } from "./pokemonImage.js";

/**
 * A Pokédex clássica (img/pokedex-classica.webp) com o sprite do Pokémon escolhido
 * aparecendo na telinha dela. O painel direito mostra número e nome no visor preto
 * e os tipos nos dois retângulos de baixo.
 *
 * As posições foram medidas na imagem original (684 x 523 px) e estão em
 * porcentagem no CSS: tela x 105-269 / y 202-318, visor x 406-615 / y 169-228,
 * retângulos x 405-493 e 520-619 / y 407-438.
 */
export function classicPokedex(pokemon) {
  const slots = [0, 1]
    .map((i) => {
      const tipo = pokemon.types[i];
      return `<span class="classic-pokedex__slot classic-pokedex__slot--${i + 1}"${tipo ? styleVars({ "--slot-color": tipo.color }) : ""} aria-hidden="true">${tipo ? esc(tipo.label) : "---"}</span>`;
    })
    .join("");

  return `<figure class="classic-pokedex"${styleVars({ "--type-color": pokemon.types[0].color })}>
    <div class="classic-pokedex__device">
      <img class="classic-pokedex__image" src="./img/pokedex-classica.webp" alt="" width="684" height="523" draggable="false" />
      <div class="classic-pokedex__screen">
        ${pokemonImage({
          src: pokemon.sprite,
          alt: `${pokemon.name} na tela da Pokédex clássica`,
          className: "classic-pokedex__sprite",
          pixelated: true,
          eager: true,
          size: 96,
        })}
      </div>
      <div class="classic-pokedex__display" aria-hidden="true">
        <span class="classic-pokedex__display-number">${pokemon.number}</span>
        <span class="classic-pokedex__display-name">${esc(pokemon.name)}</span>
      </div>
      ${slots}
    </div>
    <figcaption class="classic-pokedex__caption">Pokédex clássica</figcaption>
  </figure>`;
}
