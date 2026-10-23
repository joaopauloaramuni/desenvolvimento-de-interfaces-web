/**
 * npm run reset: apaga todos os favoritos do db.json (os Pokémon, tipos e treinadores ficam).
 * Pare o json-server antes de rodar.
 */
const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "..", "db.json");
const db = JSON.parse(fs.readFileSync(arquivo, "utf8"));
const antes = (db.favorites ?? []).length;
db.favorites = [];
fs.writeFileSync(arquivo, JSON.stringify(db, null, 2) + "\n");
console.log(`Favoritos apagados: ${antes}. O db.json voltou ao estado inicial.`);
