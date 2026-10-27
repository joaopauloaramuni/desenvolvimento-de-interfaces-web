import { DADOS_LOCAIS_URL } from "../config/appConfig.js";
import { api } from "./api.js";

/**
 * Dados da Pokédex (tipos, Pokémon e treinadores).
 *
 * Eles ficam no db.json e são servidos pelo json-server:
 *   GET /types     -> [{ id, name }, ...]
 *   GET /pokemon   -> [{ id, name, stats, types }, ...]
 *   GET /trainers  -> [{ id, name, badges, pokemonIds }, ...]
 *
 * Se o json-server não responder (página aberta por outro servidor, como o Live Server),
 * a Pokédex usa a cópia local public/data/pokedex-data.json e continua funcionando.
 * Devolve também a origem dos dados ("api" ou "local").
 */
export async function carregarDados() {
  try {
    const [types, pokemon, trainers] = await Promise.all([api("/types"), api("/pokemon"), api("/trainers")]);
    return { types, pokemon, trainers, origem: "api" };
  } catch (erroApi) {
    try {
      const resposta = await fetch(DADOS_LOCAIS_URL);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      const dados = await resposta.json();
      return { ...dados, origem: "local", erroApi };
    } catch {
      // Sem json-server e sem a cópia local: não há o que mostrar.
      throw erroApi;
    }
  }
}
