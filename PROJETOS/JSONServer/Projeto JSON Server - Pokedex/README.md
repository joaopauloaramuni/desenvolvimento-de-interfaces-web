# Projeto Pokédex (HTML + CSS + Bootstrap + json-server) 🐾

## 📖 Descrição

Esta é a mesma **Pokédex** do projeto em React + Vite + Supabase, refeita **sem React, sem Vite e sem Supabase**:

| Antes (React) | Agora |
|---|---|
| Componentes `.jsx` | Funções JavaScript que devolvem HTML (`public/js/components`) |
| `useState` / `useMemo` | Um objeto `estado` e funções de redesenho no `main.js` |
| Vite (build e servidor) | Nenhum build: módulos ES (`<script type="module">`) direto no navegador |
| Supabase (PostgreSQL) | **json-server** lendo e gravando o arquivo **`db.json`** |
| CSS próprio | O mesmo CSS + **Bootstrap 5.3** (grid, formulários, toasts, tooltips e spinner) |

Os dados (151 Pokémon, 18 tipos e 12 treinadores) são os do `pokedex-data.json` da atividade, agora dentro do **`db.json`** e servidos pelo json-server. Os **favoritos** também ficam no `db.json`, na coleção `favorites`.

## ✨ Funcionalidades

Todas as do projeto original:

- 📕 **Capa**: a Pokédex fechada abre a tampa com um clique (ou `Enter`) e a tela "liga".
- 🔎 **Pesquisa por nome ou número**: `Bulba`, `BULBA`, `25`, `#025` e `025` funcionam; acentos e pontuação são ignorados (`mr mime` encontra o `Mr. Mime`). `Esc` limpa o campo.
- 🏷️ **Filtro por tipo** com nome em pt-BR, cor do tipo e quantidade. Clicar de novo tira o filtro.
- 📊 **Ordenação** por número, nome, qualquer atributo ou total, crescente ou decrescente.
- 📟 **Detalhes**: arte grande, Pokédex clássica com o sprite na telinha, atributos com barras, total, **ponto forte** (posição entre os 151), treinadores e "outros do mesmo tipo". Anterior/Próximo seguem a ordem da lista na tela.
- ⭐ **Favoritos no json-server**: a estrela grava (`POST`) ou apaga (`DELETE`) o favorito no `db.json`. A aba **Favoritos** tem a mesma pesquisa, filtro e ordenação.
- 🧢 **Treinadores** com imagem do Pokémon Showdown, insígnias e time (as iniciais aparecem se a imagem não carregar).
- 🎲 **Sortear**, 🔌 **Fechar** (volta para a capa sem perder nada) e 🌙 **Modo noturno** (segue o sistema e salva a escolha).
- 💡 **LED de sincronização**: verde (salvo), âmbar piscando (json-server respondendo), vermelho (erro) e apagado (json-server fora do ar).
- 📱 **Responsivo** e ⌨️ **acessível**: abas com setas, `Esc` fecha os detalhes, setas navegam entre Pokémon e o foco volta para o card que abriu os detalhes.

Novidades que vêm do Bootstrap:

- 🔔 **Avisos (Toast)**: "Pikachu foi adicionado aos favoritos", "… foi removido" e as mensagens de erro do json-server.
- 💬 **Tooltips** nos botões do aparelho (só em telas com mouse).

## 🚀 Como rodar

Pré-requisito: **Node.js 18 ou mais novo** (só para o json-server; a página em si não precisa de Node).

```bash
npm install
npm start
```

Acesse **`http://localhost:3000`**.

O `npm start` roda `json-server --watch db.json --port 3000`. Um único comando entrega as duas coisas:

- a **API** (`/pokemon`, `/types`, `/trainers`, `/favorites`);
- o **site**: o json-server serve a pasta **`public/`** como arquivos estáticos (é o padrão dele).

Como o site e a API estão na mesma origem, não há problema de CORS.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm start` | Sobe o json-server (API + site) em `http://localhost:3000` |
| `npm run reset` | Apaga todos os favoritos do `db.json` (pare o json-server antes) |

### Abrindo com o Live Server (opcional)

Se você abrir a pasta `public/` com o **Live Server** do VS Code (porta 5500, por exemplo):

- com o `npm start` rodando, a página fala com `http://localhost:3000` (o json-server libera CORS) e tudo funciona;
- sem o json-server, a Pokédex usa a cópia local `public/data/pokedex-data.json`, funciona normalmente e as estrelas ficam desativadas (LED apagado e aviso "Favoritos desativados").

> ⚠️ Abrir o `index.html` com dois cliques (`file://`) não funciona: o navegador bloqueia módulos ES e `fetch()` fora de um servidor.

## 🗄️ json-server

### Por que a versão 0.17.4?

O `package.json` fixa **`json-server@0.17.4`**, a última versão estável. A linha 1.x ainda é beta e mudou o comportamento (ids viram texto, filtros e opções da linha de comando são outros). Com a versão fixa, o projeto roda igual em qualquer máquina.

### O `db.json`

```json
{
  "types":     [{ "id": 0, "name": "Typeless" }, ...],
  "pokemon":   [{ "id": 1, "name": "Bulbasaur", "stats": { ... }, "types": [ ... ] }, ...],
  "trainers":  [{ "id": 1, "name": "Ash", "badges": 9, "pokemonIds": [25, 3, 6, 9, 131, 143] }, ...],
  "favorites": []
}
```

Cada chave vira uma rota REST. Os três primeiros são só lidos; o `favorites` é lido e escrito.

### Rotas usadas pela Pokédex

| Método e rota | Para quê | Arquivo |
|---|---|---|
| `GET /types` | Tipos do filtro | `repository/pokedexRepository.js` |
| `GET /pokemon` | Os 151 Pokémon | `repository/pokedexRepository.js` |
| `GET /trainers` | Os 12 treinadores | `repository/pokedexRepository.js` |
| `GET /favorites?ownerToken=<uuid>` | Favoritos deste navegador (uma requisição só) | `repository/favoriteRepository.js` |
| `GET /favorites/<id>` | O favorito existe? (200 ou 404) | `repository/favoriteRepository.js` |
| `POST /favorites` | Favoritar | `repository/favoriteRepository.js` |
| `DELETE /favorites/<id>` | Desfavoritar | `repository/favoriteRepository.js` |

### Um favorito

```json
{
  "id": "8b5c65ab-4834-4a3a-9185-e2e73be37182-25",
  "ownerToken": "8b5c65ab-4834-4a3a-9185-e2e73be37182",
  "pokemonId": 25,
  "createdAt": "2026-10-23T09:56:11.420Z"
}
```

| Campo | Descrição |
|---|---|
| `id` | `ownerToken` + `-` + ID do Pokémon. O json-server recusa ids repetidos, então o mesmo navegador nunca favorita o mesmo Pokémon duas vezes |
| `ownerToken` | Identificador anônimo do navegador (não há login) |
| `pokemonId` | ID do Pokémon (o `favoriteService.js` só aceita de 1 a 151) |
| `createdAt` | Data/hora em que o Pokémon foi favoritado |

### Como a estrela funciona (o "toggle")

O original usava a função SQL `toggle_favorite` do Supabase. Aqui o `favoriteRepository.js` faz o mesmo com duas chamadas:

```js
// 1. Já é favorito?  GET /favorites/<id>  -> 200 (sim) ou 404 (não)
// 2a. Sim -> DELETE /favorites/<id>   e devolve false
// 2b. Não -> POST /favorites { id, ownerToken, pokemonId, createdAt }   e devolve true
```

Quem decide é o que está no `db.json`, e não a tela. Por isso duas abas abertas não deixam os favoritos fora de sincronia. Enquanto o json-server responde, a estrela fica desativada e o LED pisca.

### O `owner_token`

Na primeira visita, o navegador gera um **UUID** (`crypto.randomUUID()`) e guarda no `localStorage` (`pokedex:owner-token`). Ele vai em cada chamada e separa os favoritos de cada navegador, como no projeto com Supabase:

- outro navegador (ou aba anônima) tem outro token e outros favoritos;
- limpar os dados do site gera um token novo e a aba Favoritos começa vazia (as linhas antigas continuam no `db.json`).

> 🔐 O json-server é uma **API falsa para desenvolvimento**: não tem autenticação nem permissões, e qualquer um que acesse a porta 3000 pode ler e apagar tudo. Use só na sua máquina, nunca em produção.

## 🅱️ Onde o Bootstrap é usado

O Bootstrap é carregado **antes** do CSS da Pokédex, então o visual do aparelho prevalece. Os arquivos ficam em `public/vendor/bootstrap/` (funciona sem internet e sem CDN).

| Recurso do Bootstrap | Onde |
|---|---|
| **Grid** (`row`, `col-*`, `g-*`) | Barra de ferramentas (pesquisa, ordenação e tipos) no `main.js` |
| **Grid** (`row-cols-*`) | Lista de Pokémon (`pokemonCard.js`) e lista de treinadores (`trainerList.js`) |
| **`form-control`** | Campo de pesquisa (`searchBar.js`) |
| **`form-select`** | Ordenação (`sortControl.js`) |
| **Toast** | Avisos de favorito e de erro (`mostrarToast()` no `main.js`, estilo em `css/components/toast.css`) |
| **Tooltip** | Botões Noturno, Fechar e Sortear (`data-bs-toggle="tooltip"` no `index.html`) |
| **Spinner** (`spinner-border`) | "Carregando a Pokédex..." e "Carregando favoritos..." (`emptyState.js`) |
| **Utilitários** | `visually-hidden`, `list-unstyled`, `h-100`, `d-flex`, `gap-*`, `position-fixed`... |
| **`data-bs-theme`** | Acompanha o modo noturno: toasts e tooltips ficam escuros junto com a tela |

A "ponte" entre os dois fica no começo do `css/base.css`: as variáveis do Bootstrap (`--bs-body-bg`, `--bs-border-color`...) recebem as cores da tela do aparelho, então os componentes do Bootstrap combinam com o tema claro e o escuro.

## ⚙️ Como funciona

```text
                       ┌── fetch ─────▶ json-server  GET /types /pokemon /trainers  (db.json)
                       │                             GET/POST/DELETE /favorites
Navegador (JS puro) ───┤
                       ├── <img src> ─▶ raw.githubusercontent.com/PokeAPI/sprites   (Pokémon)
                       │
                       └── <img src> ─▶ play.pokemonshowdown.com/sprites/trainers   (treinadores)
```

1. O `main.js` mostra a capa e, ao mesmo tempo, busca os dados no json-server (`pokedexRepository.js`). Se ele não responder, usa a cópia local `data/pokedex-data.json`.
2. O `pokedexService.js` transforma o JSON em objetos prontos para a tela (`createPokemon`, `createTrainer`): número formatado (`#025`), soma dos atributos, nome normalizado para a pesquisa e URLs das imagens. Isso acontece **uma vez só**.
3. Os favoritos deste navegador chegam numa única chamada (`GET /favorites?ownerToken=...`).
4. A lista exibida é **calculada** a cada mudança (como o `useMemo` do React): `resultado()` aplica `filterPokemon` e `sortPokemon` sobre a lista base (Pokédex inteira ou só favoritos).
5. A tela é redesenhada **por partes**:
   - `renderConteudo()` monta a aba inteira (só ao trocar de aba);
   - `atualizar()` troca a lista, os contadores e os filtros, **sem recriar o campo de pesquisa** (o foco e o cursor não se perdem enquanto você digita);
   - `atualizarEstrelas()` muda só as estrelas de um Pokémon ao favoritar;
   - `renderDetalhes()` cria os detalhes uma vez e só troca o conteúdo ao ir para o anterior/próximo.
6. Os cliques são tratados por **delegação de eventos**: um único `addEventListener("click")` lê o `data-action` do botão (`open-pokemon`, `toggle-favorite`, `tab`...) e chama a função da tabela `ACOES`.
7. Ao redesenhar, `trocarHtml()` (`utils/dom.js`) devolve o foco para o "mesmo" botão (atributo `data-focus-key`), então quem usa teclado não perde o lugar.

### Do React para o JavaScript puro

| Conceito no React | Aqui |
|---|---|
| Componente funcional + props | Função que recebe um objeto e devolve uma string HTML (`pokemonCard({ pokemon, isFavorite, ... })`) |
| `useState` | Objeto `estado` no `main.js` |
| `useMemo` (estado derivado) | Funções `listaBase()`, `resultado()`, `mostrarFiltros()` |
| Re-render | `renderConteudo()`, `atualizar()`, `renderDetalhes()`, `renderStatus()` |
| `onClick` em cada botão | Delegação: um ouvinte só + `data-action` |
| `onError` do `<img>` | Um ouvinte de `error` na fase de captura (`ativarImagensReserva()`) |
| `useRef` + `focus()` | `data-focus-key` + `trocarHtml()` |
| `key` para refazer animação | Trocar o elemento (sensor do Sortear) ou o atributo `data-boot` (a/b) |
| `inert={...}` | `elemento.inert = true/false` |
| Hooks próprios | `services/` e `repository/` (as regras continuam separadas da tela) |
| `.env.local` do Supabase | `API_URL` em `js/config/appConfig.js` |

Para não injetar código pela página, todo texto que vem dos dados passa por `esc()` (`utils/dom.js`) antes de entrar no HTML.

## 📂 Estrutura do Projeto

```text
📁 pokedex-bootstrap
│
├── 🗃️ db.json                            └── Banco do json-server: types, pokemon, trainers e favorites
├── 📄 package.json                       └── json-server 0.17.4 e os scripts start / reset
├── 📁 scripts
│   └── reset-favoritos.js                └── npm run reset: esvazia "favorites" no db.json
│
└── 📁 public                             └── Servida pelo json-server em http://localhost:3000
    ├── index.html                        └── O aparelho (carcaça, botões, tela), Bootstrap, CSS e o main.js
    ├── favicon.ico / favicon-*.png / apple-touch-icon.png
    │
    ├── 📁 vendor/bootstrap               └── bootstrap.min.css e bootstrap.bundle.min.js (5.3.3)
    ├── 📁 img                            └── pokedex-fechada/aberta/classica.webp e sem-imagem.svg
    ├── 📁 data
    │   └── pokedex-data.json             └── Cópia local dos dados (usada se o json-server não responder)
    │
    ├── 🎨 css
    │   ├── base.css                      └── Tokens de cor (aparelho, mesa, tela clara/escura), ponte com o Bootstrap, botões
    │   ├── app.css                       └── Área útil da tela e barra de ferramentas
    │   └── 📁 components                 └── Um CSS por componente (o mesmo do projeto React) + toast.css
    │
    └── 📜 js
        ├── main.js                       └── Estado, redesenho, eventos, capa, tema, toasts e tooltips
        ├── ⚙️ config/appConfig.js         └── API_URL, total de Pokémon, escala das barras, URLs das imagens, chaves do localStorage
        ├── 🧩 model                       └── pokemon.js, pokemonType.js (pt-BR e cores), trainer.js
        ├── 🗄️ repository
        │   ├── api.js                    └── fetch() com tempo máximo e erros em português
        │   ├── pokedexRepository.js      └── GET /types /pokemon /trainers (ou a cópia local)
        │   └── favoriteRepository.js     └── GET/POST/DELETE /favorites
        ├── 🔎 services
        │   ├── pokedexService.js         └── Pesquisa, filtro, ordenação, ranking dos atributos
        │   └── favoriteService.js        └── Validação do ID (1 a 151) + owner_token
        ├── 🧰 utils                       └── dom.js (esc, trocarHtml), storage.js (localStorage + owner_token), text.js
        └── 🧱 components                  └── Funções que devolvem HTML:
            ├── pokedexCover.js           └── Capa: Pokédex fechada/aberta com a tampa que gira
            ├── screenTabs.js             └── Abas Pokédex, Favoritos e Treinadores
            ├── searchBar.js / sortControl.js / typeFilter.js
            ├── pokemonCard.js            └── Card e lista de Pokémon
            ├── pokemonDetails.js         └── Detalhes com Anterior/Próximo
            ├── classicPokedex.js         └── Pokédex clássica: sprite na tela, nome no visor e tipos
            ├── trainerList.js / trainerAvatar.js
            ├── statBar.js / typeBadge.js / favoriteButton.js / pokemonImage.js
            ├── statusBar.js / emptyState.js
            └── icon.js                   └── Ícones SVG desenhados à mão
```

## 🖼️ Imagens

- **Pokémon**: repositório público [PokeAPI/sprites](https://github.com/PokeAPI/sprites), montadas pelo ID (`sprites/pokemon/{id}.png` nos cards e `other/official-artwork/{id}.png` nos detalhes). Se uma imagem falhar, aparece `img/sem-imagem.svg`.
- **Treinadores**: [Pokémon Showdown](https://play.pokemonshowdown.com/sprites/trainers/), com uma lista de nomes por treinador em `TRAINER_SPRITES` (`appConfig.js`). Se nenhuma carregar, aparecem as iniciais.

## 🧯 Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| LED apagado e "Favoritos desativados" | json-server parado (ou página aberta por outro servidor) | Rodar `npm start` e abrir `http://localhost:3000` |
| LED vermelho e aviso "Sem conexão com http://localhost:3000" | O json-server caiu depois de a página abrir | Rodar `npm start` de novo e recarregar a página |
| `EADDRINUSE: address already in use :::3000` | Outro programa (ou outro json-server) usando a porta 3000 | Fechar o outro programa. Se mudar a porta no `package.json`, mude também `PORTA_JSON_SERVER` em `js/config/appConfig.js` |
| Página em branco ao abrir o `index.html` com dois cliques | `file://` bloqueia módulos ES | Abrir por `http://localhost:3000` |
| Favoritos somem em outro navegador | Os favoritos são por navegador (`ownerToken`) | Comportamento esperado |
| Erro 500 ao favoritar | Favorito repetido no `db.json` (editado à mão) | `npm run reset` com o json-server parado |
| Imagens com um ponto de interrogação | Sem internet ou GitHub fora do ar | A Pokédex continua funcionando; as imagens voltam com a conexão |

> ⚠️ Pokémon, a Pokédex, os treinadores e suas imagens são marcas da Nintendo, Game Freak e The Pokémon Company. Os sprites dos treinadores são do Pokémon Showdown. Este é um projeto acadêmico, sem fins comerciais.
