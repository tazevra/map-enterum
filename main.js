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
map.fitBounds(imageBounds);
//map.setZoom(0,); // Стартовое приближение (чем больше число, тем сильнее зум)

// Новые регионы с координатами под изображение
const regions = [
  {
    name: 'Северный регион',
    cities: ['Город А', 'Город Б'],
    bounds: [[600, 400], [1800, 1600]], // Пример, подберите под вашу карту
    cityMap: 'region.html?city=1'
  },
  {
    name: 'Южный регион',
    cities: ['Город В'],
    bounds: [[2200, 2600], [3200, 3600]], // Пример, подберите под вашу карту
    cityMap: 'region.html?city=2'
  }
];

regions.forEach(region => {
  const rect = L.rectangle(region.bounds, { color: '#3388ff', weight: 2, fillOpacity: 0.2 });
  rect.addTo(map);
  rect.on('mouseover', function(e) {
    this.setStyle({ color: 'orange', fillOpacity: 0.4 });
    this.bindTooltip(`<b>${region.name}</b><br><span class='city-list'>Города: ${region.cities.join(', ')}</span>`, {sticky: true}).openTooltip();
  });
  rect.on('mouseout', function(e) {
    this.setStyle({ color: '#3388ff', fillOpacity: 0.2 });
    this.closeTooltip();
  });
  rect.on('click', function() {
    window.location.href = region.cityMap;
  });
});

map.on('click', function(e) {
  // Для CRS.Simple координаты e.latlng соответствуют [y, x]
  console.log('Координаты клика:', e.latlng);
});
