const centralLatLong = [-43.9397233, -19.9332786]; // Ponto central do mapa (Belo Horizonte)

const locais = [
  {
    "id": 1,
    "descricao": "PUC Minas - Coração Eucarístico",
    "endereco": "Rua Dom José Gaspar, 500",
    "favorito": true,
    "cidade": "Belo Horizonte",
    "latlong": [-43.992911, -19.923564],
    "url": "https://www.pucminas.br",
    "cor": "red"
  },
  {
    "id": 2,
    "descricao": "PUC Minas - Praça da Liberdade",
    "endereco": "Av. Brasil, 2023 - Funcionários",
    "favorito": false,
    "cidade": "Belo Horizonte",
    "latlong": [-43.9397233, -19.9332786],
    "url": "https://www.pucminas.br/unidade/praca-da-liberdade/Paginas/default.aspx",
    "cor": "red"
  },
  {
    "id": 3,
    "descricao": "PUC Minas - Barreiro",
    "endereco": "Avenida Afonso Vaz de Melo, 1.200 - Barreiro",
    "favorito": true,
    "cidade": "Belo Horizonte",
    "latlong": [-44.025818, -19.976609],
    "url": "https://www.pucminas.br/unidade/barreiro/Paginas/default.aspx",
    "cor": "red"
  },
  {
    "id": 4,
    "descricao": "PUC Minas - São Gabriel",
    "endereco": "Rua Walter Ianni, 255 - São Gabriel",
    "favorito": true,
    "cidade": "Belo Horizonte",
    "latlong": [-43.917967, -19.859226],
    "url": "https://www.pucminas.br/unidade/sao-gabriel/Paginas/default.aspx",
    "cor": "red"
  },
  {
    "id": 5,
    "descricao": "PUC Minas - Contagem",
    "endereco": "R. Rio Comprido, 4.580",
    "favorito": false,
    "cidade": "Contagem",
    "latlong": [-44.076069, -19.939135],
    "url": "https://www.pucminas.br/unidade/contagem/Paginas/default.aspx",
    "cor": "blue"
  },
  {
    "id": 6,
    "descricao": "PUC Minas - Betim",
    "endereco": "R. do Rosário, 1.081 Bairro Angola",
    "favorito": true,
    "cidade": "Betim",
    "latlong": [-44.1984331, -19.9550716],
    "url": "https://www.pucminas.br/unidade/betim/Paginas/default.aspx",
    "cor": "blue"
  },
  {
    "id": 7,
    "descricao": "PUC Minas - Poços de Caldas",
    "endereco": "Av. Pe. Cletus Francis Cox, 1.661",
    "favorito": true,
    "cidade": "Poços de Caldas",
    "latlong": [-46.5944649, -21.78904],
    "url": "https://www.pucpcaldas.br/",
    "cor": "green"
  }
];

let map;

// Função que carrega os dados de unidades da PUC Minas
window.onload = () => {
  montarMapa(locais);
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

  // Adiciona marcadores para cada local
  dadosLocais.forEach((uni) => {
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h3><a href="${uni.url}" target="_blank">${uni.descricao}</a></h3><br>${uni.endereco} <br> ${uni.cidade}`);

    new mapboxgl.Marker({ color: uni.cor })
      .setLngLat(uni.latlong)
      .setPopup(popup)
      .addTo(map);
  });

  // Obtém a localização do usuário e adiciona um marcador
  navigator.geolocation.getCurrentPosition(
    processarGetCurrentPosition,
    () => { alert('Erro ao obter localização.'); }
  );
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
