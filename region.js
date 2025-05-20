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
const areas = cityId === '2' ? [
  {
    name: 'Район 3',
    forum: 'https://forum.example.com/3',
    bounds: [[20, 20], [40, 40]]
  },
  {
    name: 'Район 4',
    forum: 'https://forum.example.com/4',
    bounds: [[60, 60], [80, 80]]
  }
] : [
  {
    name: 'Район 1',
    forum: 'https://forum.example.com/1',
    bounds: [[10, 10], [30, 30]]
  },
  {
    name: 'Район 2',
    forum: 'https://forum.example.com/2',
    bounds: [[60, 60], [80, 80]]
  }
];

areas.forEach(area => {
  const rect = L.rectangle(area.bounds, { color: '#2e8b57', weight: 2, fillOpacity: 0.2 });
  rect.addTo(map);
  rect.on('mouseover', function(e) {
    this.setStyle({ color: '#ff6347', fillOpacity: 0.4 });
    this.bindTooltip(`<b>${area.name}</b>`, {sticky: true}).openTooltip();
  });
  rect.on('mouseout', function(e) {
    this.setStyle({ color: '#2e8b57', fillOpacity: 0.2 });
    this.closeTooltip();
  });
  rect.on('click', function() {
    window.open(area.forum, '_blank');
  });
});
