# Mapa das unidades PUC Minas (Mapbox)

Página que mostra as **unidades da PUC Minas** em um mapa interativo feito com o **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/)**. Cada unidade tem um marcador e, ao clicar nele, abre um popup com o nome (que é um link para o site da unidade), o endereço e a cidade. A página também marca no mapa onde você está.

O projeto usa só **HTML, CSS e JavaScript puro**: não tem back-end nem JSON Server. Os dados das unidades ficam em um array dentro do `js/app.js`.

> Este é o **projeto base**, o ponto de partida dos exercícios. A versão com os exercícios resolvidos (lista de unidades, filtro de favoritos e favoritos salvos no JSON Server) está no projeto **Projeto JSON Server - Mapa PUC Minas**.

## Funcionalidades

- Mapa centralizado em Belo Horizonte (Praça da Liberdade), com zoom 9 e estilo **Streets**
- 7 marcadores, com cores por região:
  - 🔴 **vermelho**: unidades de Belo Horizonte (Coração Eucarístico, Praça da Liberdade, Barreiro e São Gabriel)
  - 🔵 **azul**: Região Metropolitana (Contagem e Betim)
  - 🟢 **verde**: interior (Poços de Caldas)
- Popup com link para o site da unidade (abre em nova aba)
- Marcador 🟡 **amarelo** "Estou aqui!!!" com a localização do usuário (o navegador pede permissão)

## Estrutura do projeto

```
Projeto base de exemplo - Mapa PUC Minas/
├── index.html      # Carrega o Mapbox GL JS (CDN) e os scripts do projeto
├── css/
│   └── style.css   # Faz o mapa ocupar a tela inteira
└── js/
    ├── config.js   # ← Token do Mapbox (você precisa preencher)
    └── app.js      # Dados das unidades e lógica do mapa
```

## Pré-requisitos

- Um navegador atualizado (Chrome, Edge, Firefox ou Safari)
- Conexão com a internet: a biblioteca do Mapbox é carregada pela CDN e o mapa é baixado dos servidores do Mapbox
- Uma conta no Mapbox e um **token público** (veja o passo a passo abaixo)

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

Pronto, já dá para rodar o projeto.

## Como rodar

**Jeito mais simples:** abra o `index.html` no navegador com duplo clique. O mapa e os marcadores das unidades aparecem normalmente.

**Se o marcador "Estou aqui!!!" não aparecer:** alguns navegadores bloqueiam a localização em arquivos abertos direto do computador. Nesse caso:

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)**.
3. Clique em **Go Live**, no canto inferior direito.
4. Quando o navegador perguntar, **permita** o acesso à localização.

Se a permissão for negada, aparece o aviso "Erro ao obter localização.", mas o resto do mapa continua funcionando.

## Restrição de URL (opcional)

O token público fica visível para qualquer pessoa que abrir o código da página (F12). Isso é esperado: ele foi feito para isso. Mesmo assim, para evitar que alguém use o seu token em outro site, o Mapbox permite **restringir o token a endereços específicos**.

Como funciona, segundo a [documentação de tokens](https://docs.mapbox.com/accounts/guides/tokens/):

- O token só funciona nos endereços que você cadastrar (até 100 por token).
- Formatos aceitos: `meusite.com`, `meusite.com:8080`, `http://meusite.com`, `usuario.github.io` etc.
- **Não aceita** endereço IP (como `127.0.0.1`) nem curingas (`*`).
- `localhost` é **bloqueado**, a não ser que você o adicione na lista.
- O **Default public token** não aceita restrição. Para restringir, crie um token próprio (Opção B).

Recomendação para este projeto:

- **Enquanto estiver desenvolvendo:** deixe o token sem restrição. Com restrição, abrir o `index.html` com duplo clique não funciona, porque o navegador não informa de qual site vem a requisição.
- **Se quiser restringir localmente:** adicione `localhost:5500` e abra o projeto em `http://localhost:5500`. O Live Server abre em `http://127.0.0.1:5500` por padrão, e IP não é aceito.
- **Ao publicar** (por exemplo, no GitHub Pages): adicione o endereço do site, como `seuusuario.github.io`.

## Como o código funciona

1. O `index.html` carrega, nesta ordem:
   1. o CSS e o JS do **Mapbox GL JS v3.32.0** pela CDN;
   2. o `js/config.js`, que define a constante `MAPBOX_TOKEN`;
   3. o `js/app.js`, que usa essa constante.

   A ordem importa: o `config.js` precisa vir **antes** do `app.js`.
2. Quando a página termina de carregar (`window.onload`), a função `montarMapa(locais)` é chamada.
3. `montarMapa`:
   - define o token em `mapboxgl.accessToken`;
   - cria o mapa com `new mapboxgl.Map({ container, style, center, zoom })`;
   - percorre o array `locais` e, para cada unidade, cria um `mapboxgl.Popup` e um `mapboxgl.Marker` com a cor da unidade;
   - pede a localização do usuário com `navigator.geolocation.getCurrentPosition`.
4. Se a localização for obtida, `processarGetCurrentPosition` adiciona o marcador amarelo "Estou aqui!!!".

### Atenção à ordem das coordenadas

O Mapbox usa **`[longitude, latitude]`**, nessa ordem. Apesar do campo se chamar `latlong`, os valores no `app.js` estão como `[longitude, latitude]`:

```js
"latlong": [-43.992911, -19.923564]  // [longitude, latitude]
```

O Google Maps mostra as coordenadas na ordem contrária (`latitude, longitude`). Se você copiar de lá, **inverta os números**, senão o marcador vai parar no lugar errado.

### Como adicionar uma unidade

Basta incluir um novo objeto no array `locais`, em `js/app.js`:

```js
{
  "id": 8,
  "descricao": "Nome da unidade",
  "endereco": "Rua Exemplo, 123",
  "favorito": false,
  "cidade": "Cidade",
  "latlong": [-44.000000, -19.900000],   // [longitude, latitude]
  "url": "https://www.pucminas.br",
  "cor": "purple"                        // qualquer cor CSS: nome, #hex ou rgb()
}
```

> O campo `favorito` já existe nos dados, mas ainda não é usado no mapa. Ele pode servir, por exemplo, para mostrar só as unidades favoritas ou para usar uma cor diferente.

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Mapa em branco, com erro `401` no console (F12) | Token não preenchido, errado ou ainda `SEU_TOKEN_AQUI` | Confira o token em `js/config.js` |
| Mapa em branco com token certo | O token tem restrição de URL que não inclui o endereço atual | Remova a restrição ou adicione o endereço (veja [Restrição de URL](#restrição-de-url-opcional)) |
| Erro dizendo para usar token público (`pk.*`) | Foi usado um token secreto (`sk.`) | Gere um token só com **Public scopes** |
| Marcador amarelo não aparece | Localização negada ou bloqueada no arquivo local | Permita a localização e/ou rode com o Live Server |
| Marcador em lugar errado (às vezes no oceano) | Latitude e longitude invertidas | Use a ordem `[longitude, latitude]` |
| Nada carrega | Sem internet | O Mapbox precisa de conexão |

## Documentação e links úteis

### Conta e token

- [Página de tokens (Access tokens)](https://console.mapbox.com/account/access-tokens/): onde ficam o token padrão e os tokens criados
- [Criar um token](https://console.mapbox.com/account/access-tokens/create): página de criação de token
- [Guia: como funcionam os access tokens](https://docs.mapbox.com/help/dive-deeper/access-tokens/): tokens públicos x secretos, escopos e criação
- [Gerenciamento de tokens e restrição de URL](https://docs.mapbox.com/accounts/guides/tokens/)
- [Preços e limite gratuito](https://www.mapbox.com/pricing)

### Mapbox GL JS

- [Visão geral do Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Instalação (CDN e npm)](https://docs.mapbox.com/mapbox-gl-js/guides/install/)
- [Referência da API: `Map`](https://docs.mapbox.com/mapbox-gl-js/api/map/): opções como `container`, `style`, `center` e `zoom`
- [Referência da API: Markers and controls](https://docs.mapbox.com/mapbox-gl-js/api/markers/): `Marker`, `Popup`, `NavigationControl`, `GeolocateControl` etc.
- [Galeria de exemplos](https://docs.mapbox.com/mapbox-gl-js/example/)
- [Estilos de mapa (Standard, Streets, Satellite, Dark...)](https://docs.mapbox.com/map-styles/guides/)
- [Changelog (novas versões)](https://github.com/mapbox/mapbox-gl-js/blob/main/CHANGELOG.md)

### Exemplos oficiais relacionados a este projeto

- [Adicionar um marcador](https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/)
- [Anexar um popup a um marcador](https://docs.mapbox.com/mapbox-gl-js/example/set-popup/)
- [Mostrar popup ao clicar](https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/)
- [Marcadores personalizados com imagem](https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/)
- [Localizar o usuário (`GeolocateControl`)](https://docs.mapbox.com/mapbox-gl-js/example/locate-user/)
- [Botões de zoom e rotação (`NavigationControl`)](https://docs.mapbox.com/mapbox-gl-js/example/navigation/)
- [Trocar o estilo do mapa](https://docs.mapbox.com/mapbox-gl-js/example/setstyle/)

### Outros

- [Geolocation API (MDN, em português)](https://developer.mozilla.org/pt-BR/docs/Web/API/Geolocation_API)
- [Extensão Live Server para VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Próximos passos: exercícios

A partir deste projeto são feitos 3 exercícios. Os enunciados, com passo a passo, estão no arquivo `ENUNCIADO-EXERCICIOS.txt` do projeto **Projeto JSON Server - Mapa PUC Minas**:

1. **Lista de unidades com "voar até":** painel com a lista; ao clicar, o mapa voa até a unidade e abre o popup
2. **Filtro "Só favoritos":** checkbox que mostra só as unidades com `favorito: true`
3. **Favoritar e salvar com JSON Server:** os dados passam a vir do `db.json` e a estrela salva o favorito

Outras ideias:

- Adicionar os botões de zoom com `map.addControl(new mapboxgl.NavigationControl())`
- Trocar o marcador amarelo pelo `GeolocateControl`, que já vem com botão e acompanha o usuário

## Tecnologias

- HTML5, CSS3 e JavaScript (ES6+)
- Mapbox GL JS v3.32.0
- Geolocation API do navegador
