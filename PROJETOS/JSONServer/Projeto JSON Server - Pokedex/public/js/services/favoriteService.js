import { TOTAL_POKEMON } from "../config/appConfig.js";
import * as favoriteRepository from "../repository/favoriteRepository.js";
import { getOwnerToken } from "../utils/storage.js";

/**
 * Regras dos favoritos. Os favoritos ficam no json-server (db.json, coleção "favorites"),
 * separados por navegador pelo owner_token.
 */

function validarId(pokemonId) {
  const id = Number(pokemonId);
  if (!Number.isInteger(id) || id < 1 || id > TOTAL_POKEMON) {
    throw new Error(`ID de Pokémon inválido: ${pokemonId}.`);
  }
  return id;
}

/** Todos os favoritos deste navegador numa única consulta, como Set de IDs. */
export async function getFavoriteIds() {
  return new Set(await favoriteRepository.findAllByOwnerToken(getOwnerToken()));
}

/**
 * Se o Pokémon já é favorito, remove; senão, adiciona.
 * Devolve o novo estado (true = agora é favorito).
 */
export async function toggle(pokemonId) {
  return favoriteRepository.toggleByOwnerToken(getOwnerToken(), validarId(pokemonId));
}
