// main.js — логика главной карты
// Используем изображение карты мира как подложку
const imageUrl = 'IMG/world.jpg';
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
    cities: ['Город А', 'Город Б', 'Город С'],
      polygon: [
      [3844, 461], [3910, 589], [3886, 687], [3891, 759], [3944, 846], [3898, 958],
      [3917, 1068], [3923, 1185], [3886, 1269], [3885, 1433], [3971, 1735], [3887, 1843],
      [3763, 1917], [3631, 1605], [3399, 1151], [3503, 879], [3465, 704], [3473, 659],
      [3597, 549], [3687, 489], [3807, 459]
    ], // Пример, подберите под вашу карту
    cityMap: 'region.html?city=1'
  },
  {
    name: 'Юнион',
    cities: ['Город В'],
    polygon: [
      [2518, 1976], [2410, 1990], [2326, 2070], [2300, 2188], [2328, 2302], [2410, 2416],
      [2536, 2430], [2664, 2374], [2746, 2272], [2762, 2148], [2720, 2024], [2644, 1960]
    ], // Пример, подберите под вашу карту
    cityMap: 'region.html?city=2'
  },
  {
    name: 'Игридас',
    cities: ['Город С',
      'Город Д', 'Город Е', 'Город Ж', 'Город З', 'Город И', 'Город К', 'Город Л'
    ],
    polygon: [
      [2642, 910], [2700, 1128], [2806, 1134], [2908, 1038], [2956, 952], [2948, 878],
      [2840, 824], [2754, 806]
    ],
    cityMap: 'region.html?city=3'
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
