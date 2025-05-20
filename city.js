// city.js — логика карты города
// Используем изображение города как подложку
const params = new URLSearchParams(window.location.search);
const cityId = params.get('city') || '1';
let imageUrl = 'IMG/city1.webp';
let imageBounds = [[0,0],[4096,4096]];
if (cityId === '2') {
  imageUrl = 'IMG/city2.jpg';
  imageBounds = [[0,0],[1943,4096]];
}
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  maxBounds: imageBounds,
  maxBoundsViscosity: 1.0
});
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);

// Масштабируем по ширине окна
const mapWidth = imageBounds[1][1];
const windowWidth = window.innerWidth;
const zoomToFitWidth = Math.log2(windowWidth / mapWidth);
map.setView([imageBounds[1][0] / 2, mapWidth / 2], zoomToFitWidth);

// Пример областей города (выделенные области)
const areas = cityId === '1' ? [
  {
    name: 'Главный Храм и кладбище', // Город 1, Район 1
    forum: 'https://forum.example.com/3',
    // Многоугольник для Района 1 (новые координаты, порядок [y, x])
    polygon: [
      [1814, 1846], [1980, 2166], [1855, 2255], [1780, 2357], [1515, 2550], [1370, 2329], [1434, 2184], [1415, 2083], [1490, 1989]
    ]
  },
  {
    name: 'Торговый квартал', // Город 1, Район 2
    forum: 'https://forum.example.com/1',
    polygon: [
      [3092, 2710], [3168, 2996], [3216, 2994], [3230, 3054], [3210, 3114], [3180, 3146], [3196, 3200], [3242, 3232], [3234, 3270], [3090, 3268],
       [2976, 3274], [2936, 3322], [2832, 3352], [2738, 3344], [2548, 3358], [2476, 3404], [2328, 3436], [2258, 3326], [2296, 3232], 
       [2386, 3224], [2508, 3206], [2592, 3052], [2644, 2962], [2736, 2872], [2858, 2798], [2970, 2732]
    ]
  },
  {
    name: 'Дом Совета', //Город 1, Район 3
    forum: 'https://forum.example.com/2',
    polygon: [
      [2326, 2402], [2354, 2542], [2294, 2562], [2264, 2596], [2248, 2640], [2224, 2664], [2180, 2666], [2150, 2646], 
      [2118, 2648], [2084, 2674], [1934, 2688], [1890, 2344], [2204, 2298], [2254, 2332], [2270, 2414]
    ]
  }
] : cityId === '2' ? [
  {
    name: 'Город 2. Район 1',
    forum: 'https://forum.example.com/4',
    bounds: [[1000, 1000], [1600, 1600]]
  }
] : cityId === '3' ? [
  {
    name: 'Область 1',
    forum: 'https://forum.example.com/area1',
    bounds: [[500, 500], [900, 900]]
  },
  {
    name: 'Область 2',
    forum: 'https://forum.example.com/area2',
    bounds: [[1200, 800], [1600, 1300]]
  },
  {
    name: 'Область 3',
    forum: 'https://forum.example.com/area3',
    bounds: [[1700, 1500], [2100, 2000]]
  }
] : [];

areas.forEach(area => {
  let shape;
  if (area.polygon) {
    shape = L.polygon(area.polygon, { color: '#2e8b57', weight: 2, fillOpacity: 0.2 });
  } else if (area.circle) {
    shape = L.circle(area.circle.center, {
      radius: area.circle.radius,
      color: '#2e8b57',
      weight: 2,
      fillOpacity: 0.2
    });
  } else {
    shape = L.rectangle(area.bounds, { color: '#2e8b57', weight: 2, fillOpacity: 0.2 });
  }
  shape.addTo(map);
  shape.on('mouseover', function(e) {
    this.setStyle({ color: '#ff6347', fillOpacity: 0.4 });
    this.bindTooltip(`<b>${area.name}</b>`, {sticky: true}).openTooltip();
  });
  shape.on('mouseout', function(e) {
    this.setStyle({ color: '#2e8b57', fillOpacity: 0.2 });
    this.closeTooltip();
  });
  shape.on('click', function() {
    window.location.href = area.forum;
  });
});

map.on('click', function(e) {
  // Для CRS.Simple координаты e.latlng соответствуют [y, x]
  console.log('Координаты клика:', e.latlng);
});
