// region.js — логика карты города
// Используем изображение города как подложку
const params = new URLSearchParams(window.location.search);
const cityId = params.get('city') || '1';
const border = 15;
let imageUrl = 'IMG/city1.webp';
let imageBounds = [[0,0],[1943,4096]];
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
map.fitBounds(imageBounds); // fitBounds автоматически подгоняет изображение под размер экрана

// Новые области города с координатами под изображение
const areas = [
  {
    name: 'Город А',
    cityId: 1,
    bounds: [[600, 400], [1800, 1600]]
  },
  {
    name: 'Город В',
    cityId: 2,
    bounds: [[2200, 2600], [3200, 3600]]
  }
];

areas.forEach(area => {
  const rect = L.rectangle(area.bounds, { color: '#3388ff', weight: 2, fillOpacity: 0.2 });
  rect.addTo(map);
  rect.on('mouseover', function(e) {
    this.setStyle({ color: 'orange', fillOpacity: 0.4 });
    this.bindTooltip(`<b>${area.name}</b>`, {sticky: true}).openTooltip();
  });
  rect.on('mouseout', function(e) {
    this.setStyle({ color: '#3388ff', fillOpacity: 0.2 });
    this.closeTooltip();
  });
  rect.on('click', function() {
    // Переход на карту города
    window.location.href = `city.html?city=${area.cityId}`;
  });
});
