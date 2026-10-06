# Mapa das unidades PUC Minas (Mapbox + JSON Server)

Versão do mapa das unidades da PUC Minas com os **Exercícios 1, 2 e 3 resolvidos**. O mapa é feito com o **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/)**, e os dados das unidades vêm do **[JSON Server](https://github.com/typicode/json-server)**, que também guarda os favoritos no arquivo `db/db.json`.

Tudo feito com **HTML, CSS e JavaScript puro**, usando `fetch`.

> O ponto de partida dos exercícios é o projeto **Projeto base de exemplo - Mapa PUC Minas**. Os enunciados, com passo a passo, estão no arquivo `ENUNCIADO-EXERCICIOS.txt`.

## Funcionalidades

- Mapa centralizado em Belo Horizonte, com um marcador colorido para cada unidade e popup com nome (link), endereço e cidade
- **Exercício 1:** painel com a lista de unidades. Ao clicar em uma, o mapa **voa até ela** e abre o popup
- **Exercício 2:** chave **"Só favoritos"**, que mostra no mapa e na lista só as unidades favoritas
- **Exercício 3:** estrela ☆/★ em cada unidade. Ao clicar, o favorito é trocado e **salvo no `db/db.json`**, e continua salvo depois de recarregar a página (F5)
- Marcador amarelo "Estou aqui!!!" com a localização do usuário
- Layout que se adapta ao celular (o painel vai para a parte de baixo da tela)

## Estrutura do projeto

```
Projeto JSON Server - Mapa PUC Minas/
├── index.html                  # Mapa + painel com a lista e o filtro
├── ENUNCIADO-EXERCICIOS.txt    # Enunciados e passo a passo dos exercícios
├── package.json                # Script "npm start" e versão do JSON Server
├── package-lock.json
├── .vscode/
│   └── settings.json           # Faz o Live Server ignorar a pasta db/
├── db/
│   └── db.json                 # "Banco de dados" com as unidades e os favoritos
├── css/
│   └── style.css               # Painel, chave "Só favoritos", estrela e popup
└── js/
    ├── config.js               # ← Token do Mapbox e endereço da API
    └── app.js                  # Lógica do mapa, da lista e dos favoritos
```

> **Importante:** o `db.json` precisa ficar **dentro da pasta `db/`**. O `package.json`, o `.vscode/settings.json` e o enunciado usam esse caminho. Se ele estiver solto na raiz do projeto, o `npm start` dá o erro `File db/db.json not found`.

## Pré-requisitos

- [Node.js](https://nodejs.org/) **22.12 ou superior** (exigido pela versão do JSON Server usada no projeto, a `1.0.0-beta.15`)
- Um navegador atualizado
- Conexão com a internet (a biblioteca e o mapa do Mapbox vêm da internet)
- Uma conta no Mapbox e um **token público** (veja o passo a passo abaixo)

Para conferir a versão do Node:

```bash
node -v
```

## Como gerar o token do Mapbox

O Mapbox só mostra o mapa se a requisição tiver um **access token** (chave de acesso). Para este projeto, o token precisa ser **público**, ou seja, começar com `pk.`.

### 1. Crie uma conta

Acesse o **[console do Mapbox](https://console.mapbox.com/)** e crie uma conta gratuita (ou faça login, se já tiver uma).

O plano gratuito do Mapbox GL JS inclui **até 50.000 carregamentos de mapa por mês**, mais do que suficiente para estudo. Veja os detalhes na [página de preços](https://www.mapbox.com/pricing).

### 2. Abra a página de tokens

**https://console.mapbox.com/account/access-tokens/**

Nessa página fica a lista de todos os seus tokens.

### 3. Escolha uma das opções

**Opção A: usar o token padrão (mais rápido)**

Toda conta já vem com um **Default public token**, criado automaticamente. Ele já começa com `pk.` e serve para desenvolvimento. É só clicar para copiar e pular para o passo 4.

**Opção B: criar um token só para este projeto (recomendado)**

1. Na página de tokens, clique no botão azul **Create a token**. Também dá para abrir direto: https://console.mapbox.com/account/access-tokens/create
2. Em **Token name**, dê um nome que lembre o projeto, por exemplo `mapa-puc-minas`.
3. Em **Public scopes**, deixe marcados os escopos públicos, que são os necessários para exibir o mapa.
4. **Não marque nada em _Secret scopes_.** Isso transformaria o token em secreto (`sk.`), e o Mapbox GL JS não aceita token secreto no navegador.
5. Em **Token restrictions** (restrição de URL), deixe em branco por enquanto. Leia a seção [Restrição de URL](#restrição-de-url-opcional) antes de preencher.
6. Clique em **Create token**, no fim da página, e confirme com a sua senha.
7. Copie o token criado (começa com `pk.`).

### 4. Cole o token no projeto

Abra o arquivo `js/config.js` e troque `SEU_TOKEN_AQUI` pelo token copiado:

```js
const MAPBOX_TOKEN = 'pk.eyJ1Ijoi...seu-token-aqui...';
```

No mesmo arquivo fica o endereço do JSON Server, que não precisa mudar se você usar a porta padrão (3000):

```js
const API_URL = 'http://localhost:3000/locais';
```

## Como rodar

### Opção 1: com `npm start` (recomendado)

1. Abra o terminal na pasta do projeto (onde está o `package.json`).
2. Instale as dependências (só na primeira vez):

   ```bash
   npm install
   ```

3. Suba o JSON Server:

   ```bash
   npm start
   ```

4. Abra no navegador: **http://localhost:3000**

### Opção 2: sem instalar nada

```bash
npx json-server db/db.json --static .
```

Se aparecer `Ok to proceed? (y)`, digite `y` e aperte Enter.

Nas duas opções, o JSON Server entrega **o site e a API ao mesmo tempo**. O `--static .` faz ele servir os arquivos da pasta do projeto, incluindo o `index.html`:

- Site: http://localhost:3000
- Dados: http://localhost:3000/locais

Deixe o terminal aberto enquanto usa o site. Para parar, use `Ctrl + C`.

### Usando o Live Server do VS Code

Também funciona: deixe o JSON Server rodando (Opção 1 ou 2) e abra o site com o **Live Server** ("Go Live"). O arquivo `.vscode/settings.json` já faz o Live Server ignorar a pasta `db/`, para a página não recarregar sozinha toda vez que um favorito é salvo.

## Endpoints da API

O JSON Server cria as rotas a partir das chaves do `db.json`. Como o arquivo tem a chave `locais`, temos:

| Método  | Rota           | O que faz                          | Usado em          |
|---------|----------------|------------------------------------|-------------------|
| `GET`   | `/locais`      | Lista todas as unidades            | `window.onload`   |
| `GET`   | `/locais/:id`  | Busca uma unidade pelo id          | —                 |
| `PATCH` | `/locais/:id`  | Altera só o campo enviado (`favorito`) | `salvarFavorito()` |

Exemplo de unidade no `db/db.json`:

```json
{
  "id": "2",
  "descricao": "PUC Minas - Praça da Liberdade",
  "endereco": "Av. Brasil, 2023 - Funcionários",
  "favorito": false,
  "cidade": "Belo Horizonte",
  "latlong": [-43.9397233, -19.9332786],
  "url": "https://www.pucminas.br/unidade/praca-da-liberdade/Paginas/default.aspx",
  "cor": "red"
}
```

## Como o código funciona

1. **Carregar os dados (Ex. 3):** no `window.onload`, um `fetch(API_URL)` busca as unidades no JSON Server, guarda tudo na variável `locais` e chama `montarMapa`. Se o servidor estiver desligado, aparece no painel a mensagem "Não consegui carregar os dados. O JSON Server está rodando?".
2. **Montar o mapa:** `montarMapa` define o token, cria o mapa com `new mapboxgl.Map(...)`, desenha as unidades, liga o filtro e pede a localização do usuário.
3. **Desenhar as unidades:** `desenharUnidades(unidades)`:
   - apaga os marcadores e a lista anteriores (guardados no array `marcadores`) **(Ex. 2)**;
   - para cada unidade, cria o `Popup` e o `Marker` no mapa;
   - cria o item da lista com a bolinha de cor, o nome, a cidade e a estrela **(Ex. 1 e 3)**.
4. **Voar até a unidade (Ex. 1):** ao clicar no item da lista, `map.flyTo({ center, zoom: 15 })` move o mapa e `marker.togglePopup()` abre o popup.
5. **Filtro (Ex. 2):** quando a chave "Só favoritos" muda, `atualizarTela()` redesenha usando só as unidades com `favorito: true` (ou todas, se estiver desligada).
6. **Favoritar (Ex. 3):** ao clicar na estrela:
   - `evento.stopPropagation()` impede que o clique também faça o mapa voar;
   - `salvarFavorito(uni)` envia um `PATCH` com `{ favorito: !uni.favorito }`;
   - com a resposta do servidor, atualiza o valor na memória e chama `atualizarTela()`.

### Teste rápido

Ao abrir pela primeira vez, 5 unidades são favoritas (Praça da Liberdade e Contagem não são).

1. Clique na estrela vazia da Praça da Liberdade: ela fica cheia ★.
2. Abra o `db/db.json`: o `"favorito"` dela agora é `true`.
3. Aperte F5: a estrela continua cheia.
4. Ligue "Só favoritos" e desmarque uma estrela: a unidade some da lista e do mapa.

### Atenção à ordem das coordenadas

O Mapbox usa **`[longitude, latitude]`**, nessa ordem. Apesar do campo se chamar `latlong`, os valores estão como `[longitude, latitude]`. O Google Maps mostra na ordem contrária (`latitude, longitude`). Se copiar coordenadas de lá, **inverta os números**.

## Restrição de URL (opcional)

O token público fica visível para qualquer pessoa que abrir o código da página (F12). Isso é esperado: ele foi feito para isso. Mesmo assim, o Mapbox permite **restringir o token a endereços específicos**, para que ninguém o use em outro site.

Como funciona, segundo a [documentação de tokens](https://docs.mapbox.com/accounts/guides/tokens/):

- O token só funciona nos endereços cadastrados (até 100 por token).
- Formatos aceitos: `meusite.com`, `meusite.com:8080`, `http://meusite.com`, `usuario.github.io` etc.
- **Não aceita** endereço IP (como `127.0.0.1`) nem curingas (`*`).
- `localhost` é **bloqueado**, a não ser que você o adicione na lista.
- O **Default public token** não aceita restrição. Para restringir, crie um token próprio (Opção B).

Recomendação para este projeto:

- **Enquanto estiver desenvolvendo:** deixe o token sem restrição.
- **Se quiser restringir localmente:** adicione `localhost:3000` (JSON Server) e, se usar o Live Server, `localhost:5500`. Abra o Live Server por `http://localhost:5500`, porque ele abre em `http://127.0.0.1:5500` por padrão e IP não é aceito.

## Observações

- O JSON Server **reescreve o `db.json`** a cada favorito salvo. É normal os ids virarem texto (`"1"` em vez de `1`) e aparecer a linha `"$schema"`.
- Para voltar os favoritos ao estado inicial, guarde uma cópia do `db/db.json` antes de testar.
- O JSON Server é feito para estudo e protótipos, não para produção.

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `File db/db.json not found` ao rodar `npm start` | O `db.json` está fora da pasta `db/` | Crie a pasta `db` e mova o `db.json` para dentro dela |
| Painel mostra "Não consegui carregar os dados..." | JSON Server desligado | Rode `npm start` e recarregue a página |
| "Erro ao salvar o favorito..." | JSON Server caiu ou foi parado | Rode `npm start` de novo |
| Mapa em branco, com erro `401` no console (F12) | Token não preenchido, errado ou ainda `SEU_TOKEN_AQUI` | Confira o token em `js/config.js` |
| Mapa em branco com token certo | Token com restrição de URL que não inclui o endereço atual | Remova a restrição ou adicione o endereço |
| Página recarrega sozinha ao favoritar (Live Server) | O Live Server está vigiando o `db.json` | Confira se o `db.json` está em `db/` e se o `.vscode/settings.json` existe |
| `npm start` não roda ou dá erro de versão | Node.js antigo | Atualize para o Node 22.12 ou superior |
| Porta 3000 ocupada | Outro programa usando a porta | Rode `npm start -- --port 3001` e troque a porta no `API_URL` do `js/config.js` |
| Marcador amarelo não aparece | Localização negada pelo navegador | Permita o acesso à localização |
| Marcador em lugar errado | Latitude e longitude invertidas | Use a ordem `[longitude, latitude]` |

## Documentação e links úteis

### Mapbox: conta e token

- [Página de tokens (Access tokens)](https://console.mapbox.com/account/access-tokens/): onde ficam o token padrão e os tokens criados
- [Criar um token](https://console.mapbox.com/account/access-tokens/create): página de criação de token
- [Guia: como funcionam os access tokens](https://docs.mapbox.com/help/dive-deeper/access-tokens/): tokens públicos x secretos, escopos e criação
- [Gerenciamento de tokens e restrição de URL](https://docs.mapbox.com/accounts/guides/tokens/)
- [Preços e limite gratuito](https://www.mapbox.com/pricing)

### Mapbox GL JS

- [Visão geral do Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Instalação (CDN e npm)](https://docs.mapbox.com/mapbox-gl-js/guides/install/)
- [Referência da API: `Map`](https://docs.mapbox.com/mapbox-gl-js/api/map/): opções do mapa e métodos como `flyTo`
- [Referência da API: Markers and controls](https://docs.mapbox.com/mapbox-gl-js/api/markers/): `Marker` (inclui `remove` e `togglePopup`), `Popup`, `NavigationControl`, `GeolocateControl` etc.
- [Galeria de exemplos](https://docs.mapbox.com/mapbox-gl-js/example/)
- [Estilos de mapa (Standard, Streets, Satellite, Dark...)](https://docs.mapbox.com/map-styles/guides/)
- [Changelog (novas versões)](https://github.com/mapbox/mapbox-gl-js/blob/main/CHANGELOG.md)

### Exemplos oficiais relacionados a este projeto

- [Adicionar um marcador](https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/)
- [Anexar um popup a um marcador](https://docs.mapbox.com/mapbox-gl-js/example/set-popup/)
- [Voar até um local (`flyTo`)](https://docs.mapbox.com/mapbox-gl-js/example/flyto/)
- [Opções do `flyTo` (velocidade, curva...)](https://docs.mapbox.com/mapbox-gl-js/example/flyto-options/)
- [Localizar o usuário (`GeolocateControl`)](https://docs.mapbox.com/mapbox-gl-js/example/locate-user/)
- [Botões de zoom e rotação (`NavigationControl`)](https://docs.mapbox.com/mapbox-gl-js/example/navigation/)

### JSON Server e JavaScript

- [JSON Server (GitHub)](https://github.com/typicode/json-server)
- [Fetch API (MDN, em português)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [Geolocation API (MDN, em português)](https://developer.mozilla.org/pt-BR/docs/Web/API/Geolocation_API)
- [Extensão Live Server para VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Tecnologias

- HTML5, CSS3 (variáveis CSS, Flexbox e media queries) e JavaScript (ES6+)
- Mapbox GL JS v3.32.0
- JSON Server 1.0.0-beta.15
- Fetch API e Geolocation API
