const centralLatLong = [-43.9397233, -19.9332786]; // Ponto central do mapa (Belo Horizonte)

// Exercício 3: os dados agora vêm do JSON Server (arquivo db/db.json)
let locais = [];

let map;
let marcadores = []; // Exercício 2: guarda os marcadores para poder apagar depois

// Exercício 3: busca as unidades no JSON Server e depois monta o mapa
window.onload = () => {
  fetch(API_URL)
    .then((resposta) => resposta.json())
    .then((dados) => {
      locais = dados;
      montarMapa(locais);
    })
    .catch(() => {
      document.getElementById('lista').innerHTML =
        '<li class="mensagem">Não consegui carregar os dados. O JSON Server está rodando?</li>';
    });
};

function montarMapa(dadosLocais) {
  // O token vem do arquivo js/config.js
  mapboxgl.accessToken = MAPBOX_TOKEN;

  map = new mapboxgl.Map({
    container: 'map',                            // O container do mapa
    style: 'mapbox://styles/mapbox/streets-v12', // Estilo do mapa
    center: centralLatLong,                      // Localização central do mapa
    zoom: 9                                      // Zoom inicial
  });

  // Desenha todas as unidades no mapa e na lista
  desenharUnidades(dadosLocais);

  // Exercício 2: quando o checkbox mudar, desenha de novo com ou sem filtro
  document.getElementById('soFavoritos').addEventListener('change', atualizarTela);

  // Obtém a localização do usuário e adiciona um marcador
  navigator.geolocation.getCurrentPosition(
    processarGetCurrentPosition,
    () => { alert('Erro ao obter localização.'); }
  );
}

// Exercício 2 e 3: desenha de novo respeitando o filtro "Só favoritos"
function atualizarTela() {
  const soFavoritos = document.getElementById('soFavoritos').checked;

  if (soFavoritos) {
    desenharUnidades(locais.filter((uni) => uni.favorito));
  } else {
    desenharUnidades(locais);
  }
}

// Desenha os marcadores no mapa e os itens na lista
function desenharUnidades(unidades) {
  // Exercício 2: apaga o que já estava desenhado
  marcadores.forEach((m) => m.remove());
  marcadores = [];
  document.getElementById('lista').innerHTML = '';

  unidades.forEach((uni) => {
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h3><a href="${uni.url}" target="_blank">${uni.descricao}</a></h3>${uni.endereco}<br>${uni.cidade}`);

    const marker = new mapboxgl.Marker({ color: uni.cor })
      .setLngLat(uni.latlong)
      .setPopup(popup)
      .addTo(map);

    marcadores.push(marker); // Exercício 2

    // Exercício 1 (melhorado no 3): cria o item da lista com a estrela
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="cor" style="background: ${uni.cor}"></span>
      <span class="nome">${uni.descricao}<small>${uni.cidade}</small></span>
      <button class="estrela ${uni.favorito ? 'ativa' : ''}" title="Favoritar">${uni.favorito ? '★' : '☆'}</button>
    `;
    document.getElementById('lista').appendChild(li);

    // Exercício 1: ao clicar, voa até a unidade e abre o popup
    li.addEventListener('click', () => {
      map.flyTo({ center: uni.latlong, zoom: 15 });
      marker.togglePopup();
    });

    // Exercício 3: ao clicar na estrela, troca o favorito e salva no db.json
    const estrela = li.querySelector('.estrela');
    estrela.addEventListener('click', (evento) => {
      evento.stopPropagation(); // não deixa o clique na estrela "voar" o mapa
      salvarFavorito(uni);
    });
  });
}

// Exercício 3: envia o novo valor de "favorito" para o JSON Server (PATCH)
function salvarFavorito(uni) {
  fetch(`${API_URL}/${uni.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorito: !uni.favorito })
  })
    .then((resposta) => resposta.json())
    .then((atualizado) => {
      uni.favorito = atualizado.favorito; // atualiza o valor na memória
      atualizarTela();                    // redesenha a lista e o mapa
    })
    .catch(() => alert('Erro ao salvar o favorito. O JSON Server está rodando?'));
}

// Função para processar a localização do usuário
function processarGetCurrentPosition(local) {
  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3> Estou aqui!!! </h3>`);

  new mapboxgl.Marker({ color: 'yellow' })
    .setLngLat([local.coords.longitude, local.coords.latitude])
    .setPopup(popup)
    .addTo(map);
}
