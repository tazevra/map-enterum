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
    cities: ['Город А'],
    bounds: [[600, 400], [1800, 1600]],
    image: 'IMG/region1.jpg',
    cityMap: 'region.html?region=1'
  },
  {
    name: 'Игридас',
    cities: ['Город В'],
    bounds: [[2200, 2600], [3200, 3600]],
    image: 'IMG/region2.webp',
    cityMap: 'region.html?region=2'
  },
  {
    name: 'Идо',
    cities: ['Город С'],
    bounds: [[1000, 2000], [2000, 3000]], // Примерные координаты, скорректируйте под вашу карту
    image: 'IMG/region3.webp',
    cityMap: 'region.html?region=3'
  },
  {
    name: 'Корзус',
    cities: ['Город D'],
    polygon: [
      [1696, 3324], [1536, 3382], [1332, 3392], [1004, 3438], [928, 3484], [844, 3490], [718, 3468], [638, 3514], [552, 3612], [502, 3672], [482, 3770], [468, 3856], [544, 3900], [602, 3908], [676, 3886], [736, 3878], [798, 3900], [858, 3930], [934, 3890], [986, 3884], [1056, 3894], [1198, 3912], [1290, 3884], [1388, 3880], [1540, 3886], [1618, 3898], [1684, 3884], [1808, 3684], [1986, 3436], [1996, 3328], [1996, 3238], [1772, 3334]
    ],
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
