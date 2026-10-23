import { api } from "./api.js";

/**
 * Favoritos no json-server (coleção "favorites" do db.json).
 *
 * Cada favorito é um documento:
 *   { "id": "<owner_token>-25", "ownerToken": "<owner_token>", "pokemonId": 25, "createdAt": "2026-10-23T12:00:00.000Z" }
 *
 * O id é montado com o owner_token + o ID do Pokémon, então o mesmo navegador
 * nunca grava o mesmo Pokémon duas vezes (o json-server recusa ids repetidos).
 *
 *   GET    /favorites?ownerToken=<uuid>   -> favoritos deste navegador
 *   GET    /favorites/<id>                -> 200 (é favorito) ou 404 (não é)
 *   POST   /favorites                     -> adiciona
 *   DELETE /favorites/<id>                -> remove
 */

const idDoFavorito = (ownerToken, pokemonId) => `${ownerToken}-${pokemonId}`;

/** IDs dos Pokémon favoritos de um owner_token, numa única requisição. */
export async function findAllByOwnerToken(ownerToken) {
  const linhas = await api(`/favorites?ownerToken=${encodeURIComponent(ownerToken)}`);
  return (linhas ?? []).map((linha) => Number(linha.pokemonId));
}

/** O favorito existe no json-server? */
async function existe(id) {
  try {
    await api(`/favorites/${encodeURIComponent(id)}`);
    return true;
  } catch (e) {
    if (e.status === 404) return false;
    throw e;
  }
}

/**
 * Se o Pokémon já é favorito, apaga e devolve false; senão, grava e devolve true.
 * Quem decide é o que está no db.json (e não a tela): assim duas abas abertas
 * nunca deixam os favoritos fora de sincronia.
 */
export async function toggleByOwnerToken(ownerToken, pokemonId) {
  const id = idDoFavorito(ownerToken, pokemonId);

  if (await existe(id)) {
    await api(`/favorites/${encodeURIComponent(id)}`, { method: "DELETE" });
    return false;
  }

  await api("/favorites", {
    method: "POST",
    body: { id, ownerToken, pokemonId, createdAt: new Date().toISOString() },
  });
  return true;
}
