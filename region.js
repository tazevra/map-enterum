// region.js — логика карты города
// Используем изображение города как подложку
const params = new URLSearchParams(window.location.search);
const regionId = params.get('region') || '1';
const border = 15;
let imageUrl = 'IMG/region1.jpg';
let imageBounds = [[0,0],[1943,4096]];
if (regionId === '2') {
  imageUrl = 'IMG/region2.webp';
  imageBounds = [[0,0],[2924,4096]];
} else if (regionId === '3') {
  imageUrl = 'IMG/region3.webp';
  imageBounds = [[0,0],[4096,4096]];
} else if (regionId === '4') {
  imageUrl = 'IMG/region4.webp';
  imageBounds = [[0,0],[4096,4096]];
}
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 2,
  maxBounds: imageBounds,
  maxBoundsViscosity: 1.0
});
L.imageOverlay(imageUrl, imageBounds).addTo(map);
// Масштабирование по ширине 4096px
const mapWidth = 4096;
const windowWidth = window.innerWidth;
const zoomToFitWidth = Math.log2(windowWidth / mapWidth);
map.setView([imageBounds[1][0] / 2, mapWidth / 2], zoomToFitWidth);

// Новые области города с координатами под изображение
const areas = regionId === '1' ? [
  {
    name: 'Город А',
    cityId: 1,
    // Многоугольник для Города А
    polygon: [
      [880, 680], [688, 836], [508, 1208], [596, 1400], [796, 1648], [916, 1704], [988, 1684], [1096, 1584], [1160, 1460], 
      [1260, 1208], [1192, 1020]
    ]
  }
] : regionId === '2' ? [
  {
    name: 'Город В',
    cityId: 2,
    // Многоугольник для Города Б
    polygon: [
      [1692, 572], [1796, 702], [1812, 788], [1802, 864], [1692, 988], [1558, 928], [1518, 768], [1534, 662], [1574, 602], 
      [1650, 574]
    ]
  }
] : regionId === '3' ? [
  {
    name: 'Город С',
    cityId: 3,
    // Многоугольник для Города С
    polygon: [
      [270, 3271], [247, 3393], [366, 3504], [359, 3559], [315, 3687], [491, 3893], [537, 3784], [646, 3653], [683, 3584], 
      [707, 3510], [713, 3408], [694, 3304], [648, 3209], [469, 3161], [383, 3290], [318, 3287]
    ]
  }
] : regionId === '4' ? [
  {
    name: 'Корзус',
    cityId: 4,
    // Многоугольник для Корзуса
    polygon: [
      [100, 200], [150, 250], [200, 300], [250, 350], [300, 400], [350, 450], [400, 500], [450, 550], [500, 600]
    ]
  }
] : [];

areas.forEach(area => {
  let shape;
  if (area.polygon) {
    shape = L.polygon(area.polygon, { color: '#3388ff', weight: 2, fillOpacity: 0.2 });
  } else {
    shape = L.rectangle(area.bounds, { color: '#3388ff', weight: 2, fillOpacity: 0.2 });
  }
  shape.addTo(map);
  shape.on('mouseover', function(e) {
    this.setStyle({ color: 'orange', fillOpacity: 0.4 });
    this.bindTooltip(`<b>${area.name}</b>`, {sticky: true}).openTooltip();
  });
  shape.on('mouseout', function(e) {
    this.setStyle({ color: '#3388ff', fillOpacity: 0.2 });
    this.closeTooltip();
  });
  shape.on('click', function() {
    // Переход на карту города
    window.location.href = `city.html?city=${area.cityId}`;
  });
});

map.on('click', function(e) {
  // Для CRS.Simple координаты e.latlng соответствуют [y, x]
  console.log('Координаты клика:', e.latlng);
});
