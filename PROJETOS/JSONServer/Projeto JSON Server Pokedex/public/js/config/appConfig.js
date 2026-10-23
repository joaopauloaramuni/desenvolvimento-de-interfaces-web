/**
 * Configurações gerais da Pokédex.
 */

/**
 * Endereço do json-server.
 * Quando a página é aberta pelo próprio json-server (npm start -> http://localhost:3000),
 * a API está na mesma origem. Aberta por outro servidor (Live Server, por exemplo),
 * a página fala com o json-server em http://localhost:3000 (o json-server libera CORS).
 */
const PORTA_JSON_SERVER = "3000";
const MESMA_ORIGEM = window.location.protocol.startsWith("http") && window.location.port === PORTA_JSON_SERVER;

export const API_URL = MESMA_ORIGEM ? window.location.origin : `http://localhost:${PORTA_JSON_SERVER}`;

/** Tempo máximo de espera por uma resposta do json-server (ms). */
export const API_TIMEOUT = 6000;

/** Cópia local do pokedex-data.json, usada se o json-server não responder. */
export const DADOS_LOCAIS_URL = "./data/pokedex-data.json";

/** Quantidade de Pokémon da primeira geração (Kanto), a mesma do pokedex-data.json. */
export const TOTAL_POKEMON = 151;

/** Maior valor possível de um atributo base. As barras usam essa escala. */
export const STAT_MAX = 255;

/**
 * Imagens da PokéAPI (repositório público PokeAPI/sprites no GitHub).
 * São as mesmas URLs que a API devolve em sprites.front_default e
 * sprites.other["official-artwork"].front_default, montadas direto pelo ID
 * para não precisar de uma requisição por Pokémon.
 */
const SPRITES_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export const spriteUrl = (id) => `${SPRITES_BASE}/${id}.png`;
export const artworkUrl = (id) => `${SPRITES_BASE}/other/official-artwork/${id}.png`;

/** Imagem reserva quando a PokéAPI não responde. */
export const SEM_IMAGEM = "./img/sem-imagem.svg";

/**
 * Imagens dos treinadores (Pokémon Showdown):
 * https://play.pokemonshowdown.com/sprites/trainers/{nome}.png
 * Cada treinador tem uma lista: se o primeiro sprite não carregar, o próximo é
 * tentado e, no fim, aparecem as iniciais.
 */
const TRAINER_SPRITES_BASE = "https://play.pokemonshowdown.com/sprites/trainers";

export const trainerSpriteUrl = (nome) => `${TRAINER_SPRITES_BASE}/${nome}.png`;

/** Nome do treinador no JSON -> arquivos do Showdown, em ordem de preferência. */
export const TRAINER_SPRITES = {
  ash: ["ash", "ash-capbackward", "red"],
  brock: ["brock", "brock-gen3", "brock-gen1"],
  misty: ["misty", "misty-gen3", "misty-gen1"],
  "lt. surge": ["ltsurge", "ltsurge-gen3", "ltsurge-gen1"],
  erika: ["erika", "erika-gen3", "erika-gen1"],
  koga: ["koga", "koga-gen3", "koga-gen1"],
  sabrina: ["sabrina", "sabrina-gen3", "sabrina-gen1"],
  blaine: ["blaine", "blaine-gen3", "blaine-gen1"],
  giovanni: ["giovanni", "giovanni-gen3", "giovanni-gen1"],
  // O Gary é o "Blue" dos jogos (e do Showdown).
  gary: ["blue", "blue-gen3", "blue-gen1"],
  "team rocket": ["teamrocket", "rocketgrunt", "rocketgrunt-gen3"],
  lance: ["lance", "lance-gen3", "lance-gen1"],
};

/** URLs candidatas para a imagem de um treinador (pode ser lista vazia). */
export function trainerSpriteUrls(nomeTreinador) {
  const chave = String(nomeTreinador).trim().toLowerCase();
  const nomes = TRAINER_SPRITES[chave] ?? [chave.replace(/[^a-z0-9]/g, "")];
  return nomes.filter(Boolean).map(trainerSpriteUrl);
}

/** Chaves do localStorage. */
export const STORAGE_KEYS = {
  ownerToken: "pokedex:owner-token",
  theme: "pokedex:theme",
};
