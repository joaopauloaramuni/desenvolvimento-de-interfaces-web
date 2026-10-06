# Cartas Pokémon — API externa + JSON Server

Projeto que junta **duas APIs** em uma página só:

- a **[Pokémon TCG API](https://pokemontcg.io/)**, uma API pública usada para buscar cartas do jogo de cartas Pokémon;
- o **[JSON Server](https://github.com/typicode/json-server)**, usado como API local para guardar a sua **coleção de cartas favoritas** no arquivo `db.json`.

Tudo feito com **HTML, CSS e JavaScript puro**, usando `fetch`.

## Funcionalidades

- Ao abrir a página, já aparecem 20 cartas para começar
- Buscar cartas **pelo nome** (ex.: `charizard`) — retorna até 12 resultados
- Buscar uma carta **pelo ID** (ex.: `swsh4-25`)
- Clicar numa carta para ver os **detalhes**: HP, tipo, artista, raridade, ataques, habilidades, fraquezas, resistências e custo de retirada
- **Salvar** cartas na sua coleção (grava no `db.json`)
- **Remover** cartas da coleção

## Estrutura do projeto

```
Projeto JSON Server - Pokemon/
├── db.json            # Coleção salva pelo JSON Server
└── public/
    ├── index.html     # Página com busca, resultados, detalhes e coleção
    ├── script.js      # Chamadas à API do Pokémon e ao JSON Server
    └── style.css      # Estilos (grade de cartas e painel de detalhes)
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) **22.12 ou superior** (exigido pela versão atual do JSON Server)
- Conexão com a internet (para acessar a API do Pokémon e carregar as imagens das cartas)

## Como rodar

1. Abra o terminal na pasta do projeto (onde está o `db.json`).
2. Suba o JSON Server:

   ```bash
   npx json-server db.json
   ```

3. Abra no navegador: **http://localhost:3000**

O JSON Server serve automaticamente os arquivos da pasta `public/`. Para parar o servidor, use `Ctrl + C` no terminal.

> **Importante:** abra a página pelo endereço do JSON Server, e não clicando duas vezes no `index.html`. O `script.js` acessa a coleção pelo caminho relativo `/cartas`, que só funciona quando a página e a API estão no mesmo servidor. Se a porta 3000 estiver ocupada, use outra (`npx json-server db.json --port 3002`) — não é preciso mudar nada no código.

## APIs usadas

### Pokémon TCG API (externa)

Base: `https://api.pokemontcg.io/v2/cards`

| Busca            | Requisição                                   | Função no código    |
|------------------|----------------------------------------------|---------------------|
| Cartas iniciais  | `GET /v2/cards?pageSize=20`                  | `buscarIniciais()`  |
| Por nome         | `GET /v2/cards?q=name:"charizard*"&pageSize=12` | `buscarPorNome()`   |
| Por ID           | `GET /v2/cards/swsh4-25`                     | `buscarPorId()`     |

O que for digitado no campo de busca é tratado como **ID** quando tem o formato `letras/números-letras/números` com pelo menos um número (ex.: `swsh4-25`, `dp3-3`). Caso contrário, é tratado como **nome**.

### JSON Server (local)

Como o `db.json` tem a chave `cartas`, o JSON Server cria:

| Método   | Rota           | O que faz                   | Função no código     |
|----------|----------------|-----------------------------|----------------------|
| `GET`    | `/cartas`      | Lista a coleção             | `carregarColecao()`  |
| `POST`   | `/cartas`      | Salva uma carta             | `salvarCarta()`      |
| `DELETE` | `/cartas/:id`  | Remove uma carta            | `removerCarta()`     |

A carta da API do Pokémon tem muitos campos, mas a coleção guarda só o necessário:

```json
{
  "cardId": "dp3-3",
  "nome": "Charizard",
  "colecao": "Secret Wonders",
  "imagem": "https://images.pokemontcg.io/dp3/3.png",
  "id": "wv8NxxPq-tI"
}
```

- `cardId` é o ID da carta na API do Pokémon.
- `id` é gerado pelo JSON Server e identifica o registro na sua coleção (é ele que o `DELETE` usa).

## Chave da API do Pokémon

A chave fica na constante `API_KEY`, no início do `script.js`. Ela é **opcional**: sem chave a API funciona, só que com um limite menor de requisições. Para gerar a sua, crie uma conta em [dev.pokemontcg.io](https://dev.pokemontcg.io/).

Para usar sem chave, deixe a constante vazia:

```js
const API_KEY = "";
```

> **Atenção:** em projetos só de front-end, a chave fica visível para qualquer pessoa (pelo F12 do navegador). Para estudo não tem problema, mas **não publique sua chave pessoal** em repositórios públicos, como o GitHub.

## Observações

- A coleção salva fica no `db.json`. Guarde uma cópia do arquivo se quiser voltar ao estado inicial.
- A chave `$schema` no `db.json` é adicionada pelo próprio JSON Server e pode ser ignorada.
- Se a API do Pokémon estiver fora do ar ou lenta, a página mostra "Erro ao buscar na API do Pokémon." — a coleção local continua funcionando normalmente.
- O JSON Server é feito para estudo e protótipos, não para produção.

## Tecnologias

- HTML5, CSS3 (Flexbox e Grid) e JavaScript (ES6+)
- Fetch API
- Pokémon TCG API
- JSON Server
