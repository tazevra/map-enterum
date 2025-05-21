// main.js — логика главной карты
// Используем изображение карты мира как подложку
const imageUrl = 'IMG/world.webp'; // Путь к изображению карты мира
const imageBounds = [[0,0], [4096,4096]]; // Карта мира: 4096x4096
// Используем CRS.Simple для точного отображения изображения
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2, // Максимальное приближение в 2 раза
  maxBounds: imageBounds, // Ограничение перемещения ровно по картинке
  maxBoundsViscosity: 1.0 // Жёсткое ограничение
});
L.imageOverlay(imageUrl, imageBounds).addTo(map);
// Масштабирование по ширине 4096px
const mapWidth = 4096;
const windowWidth = window.innerWidth;
const zoomToFitWidth = Math.log2(windowWidth / mapWidth);
map.setView([imageBounds[1][0] / 2, mapWidth / 2], zoomToFitWidth);

// Новые регионы с координатами под изображение
const regions = [
  {
    name: 'Йошихара',
    cities: ['Город Йошихара', 'Рикутен', 'Коуфу'],
 polygon: [
      [3844, 461], [3910, 589], [3886, 687], [3891, 759], [3944, 846], [3898, 958],
      [3917, 1068], [3923, 1185], [3886, 1269], [3885, 1433], [3971, 1735], [3887, 1843],
      [3763, 1917], [3631, 1605], [3399, 1151], [3503, 879], [3465, 704], [3473, 659],
      [3597, 549], [3687, 489], [3807, 459]
    ], // Пример, подберите под вашу карту
    image: 'IMG/region1.jpg',
    cityMap: 'region.html?region=1'
  },
  {
    name: 'Арамидис',
    cities: ['Город В','Город С', 'Город D'],
 polygon: [
      [3472, 320], [3434, 612], [3396, 778], [3390, 926], [3310, 1176], [3294, 1400], [3304, 1552], [3258, 1728], 
      [3198, 1860], [3044, 1714], [2854, 1662], [2708, 1650], [2488, 1630], [2468, 1412], [2440, 1118], [2408, 858], 
      [2382, 402], [2432, 120], [2726, 236], [3020, 308], [3302, 298], [3486, 330]
    ], // Пример, подберите под вашу карту
    image: 'IMG/region2.webp',
    cityMap: 'region.html?region=2'
  },
  {
    name: 'Юнион',
    cities: ['Город E', 'Город F', 'Город G'],
 polygon: [
      [2374, 1736], [2748, 1726], [3044, 1820], [3246, 1886], [3284, 1908], [3512, 2012], [3708, 2116], [3984, 2172], 
      [3986, 2412], [3944, 2716], [3832, 3016], [3678, 3300], [3498, 3590], [3348, 3732], [3126, 3772], 
      [2928, 3738], [2736, 3728], [2516, 3814], [2260, 3754], [1952, 3640], [1530, 3290], 
      [1490, 3038], [2024, 2288], [2162, 2100], [2422, 1818]
    ], // Пример, подберите под вашу карту
    image: 'IMG/region3.webp',
    cityMap: 'region.html?region=3'
  },
  {
    name: 'Корзус',
    cities: ['Город H', 'Город I', 'Город J'],
 polygon: [
      [2204, 88], [2306, 466], [2350, 764], [2378, 1022], [2406, 1342], [2396, 1556], [2366, 1716], [2324, 1800], [2202, 1946], 
      [2086, 2070], [1900, 2372], [1746, 2516], [1118, 2452], [830, 2416], [566, 2446], [356, 1648], [230, 1492], [204, 1420], 
      [194, 1200], [834, 790], [1160, 650], [1258, 484], [1230, 252], [1376, 30], [1598, 46], [1836, 86], [2006, 34], [2174, 28] 
    ], // Пример, подберите под вашу карту
    image: 'IMG/region4.webp',
    cityMap: 'region.html?region=4'
  }
];

regions.forEach(region => {
  let shape;
  if (region.polygon) {
    shape = L.polygon(region.polygon, { color: '#3388ff', weight: 2, fillOpacity: 0.2 });
  } else {
    shape = L.rectangle(region.bounds, { color: '#3388ff', weight: 2, fillOpacity: 0.2 });
  }
  shape.addTo(map);
  shape.on('mouseover', function(e) {
    this.setStyle({ color: 'orange', fillOpacity: 0.4 });
    this.bindTooltip(`<b>${region.name}</b><br><span class='city-list'>Города: ${region.cities.join(', ')}</span>`, {sticky: true}).openTooltip();
  });
  shape.on('mouseout', function(e) {
    this.setStyle({ color: '#3388ff', fillOpacity: 0.2 });
    this.closeTooltip();
  });
  shape.on('click', function() {
    window.location.href = region.cityMap;
  });
});

map.on('click', function(e) {
  // Для CRS.Simple координаты e.latlng соответствуют [y, x]
  console.log('Координаты клика:', e.latlng);
});
