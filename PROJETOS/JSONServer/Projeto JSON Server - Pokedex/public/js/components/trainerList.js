import { esc, styleVars } from "../utils/dom.js";
import { pokemonImage } from "./pokemonImage.js";
import { trainerAvatar } from "./trainerAvatar.js";

const SLOTS_DE_INSIGNIA = 8;

function textoInsignias(quantidade) {
  if (quantidade === 0) return "Nenhuma insígnia";
  return quantidade === 1 ? "1 insígnia" : `${quantidade} insígnias`;
}

/** Um treinador: imagem (Pokémon Showdown), nome, insígnias e o time. Cada Pokémon do time abre os detalhes. */
function trainerCard(treinador, destacado) {
  const slots = Math.max(SLOTS_DE_INSIGNIA, treinador.badges);
  const tituloId = `treinador-${treinador.id}-nome`;

  return `<li class="col">
    <article id="treinador-${treinador.id}" class="trainer-card${destacado ? " is-highlighted" : ""}" tabindex="-1" aria-labelledby="${tituloId}">
      <header class="trainer-card__head">
        ${trainerAvatar(treinador)}
        <div class="trainer-card__title">
          <h2 id="${tituloId}" class="trainer-card__name">${esc(treinador.name)}</h2>
          <p class="trainer-card__meta">${textoInsignias(treinador.badges)}, ${treinador.pokemon.length} Pokémon</p>
        </div>
      </header>

      <div class="trainer-card__badges" aria-hidden="true">
        ${Array.from({ length: slots }, (_, i) => `<span class="badge-pip${i < treinador.badges ? " is-on" : ""}"></span>`).join("")}
      </div>

      <ul class="trainer-card__team" aria-label="Time de ${esc(treinador.name)}">
        ${treinador.pokemon
          .map(
            // O mesmo Pokémon pode aparecer mais de uma vez no time: a posição vai junto.
            (pokemon, indice) => `<li>
              <button type="button" class="team-slot"${styleVars({ "--type-color": pokemon.types[0].color })}
                data-action="open-team" data-trainer="${treinador.id}" data-index="${indice}"
                data-focus-key="team-${treinador.id}-${indice}">
                <span class="team-slot__window">${pokemonImage({ src: pokemon.sprite, pixelated: true, size: 72 })}</span>
                <span class="team-slot__name">${esc(pokemon.name)}</span>
                <span class="team-slot__number">${pokemon.number}</span>
              </button>
            </li>`,
          )
          .join("")}
      </ul>
    </article>
  </li>`;
}

/**
 * Treinadores do pokedex-data.json, no grid do Bootstrap.
 * destaqueId: treinador escolhido nos detalhes de um Pokémon (a lista rola até ele).
 */
export function trainerList(treinadores, destaqueId) {
  return `<ul class="trainer-list row row-cols-1 row-cols-lg-2 row-cols-xxl-3 g-3 list-unstyled">
    ${treinadores.map((t) => trainerCard(t, t.id === destaqueId)).join("")}
  </ul>`;
}
