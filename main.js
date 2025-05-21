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
    forum: 'https://forum.example.com/yoshihara',
    polygon: [
      [1884, 1420], [1884, 1348], [1994, 1248], [2196, 1382], [2198, 1492], [2196, 1520], [2118, 1526], [2084, 1572], [2010, 1468]
    ]
  },
  {
    name: 'Игридас',
    forum: 'https://forum.example.com/igridas',
    polygon: [
      [1692, 572], [1796, 702], [1812, 788], [1802, 864], [1692, 988], [1558, 928], [1518, 768], [1534, 662], [1574, 602], [1650, 574]
    ]
  },
  {
    name: 'Идо',
    forum: 'https://forum.example.com/ido',
    polygon: [
      [270, 3271], [247, 3393], [366, 3504], [359, 3559], [315, 3687], [491, 3893], [537, 3784], [646, 3653], [683, 3584], [707, 3510], [713, 3408], [694, 3304], [648, 3209], [469, 3161], [383, 3290], [318, 3287]
    ]
  },
  {
    name: 'Корзус',
    forum: 'https://forum.example.com/korzus',
    polygon: [
      [1696, 3324], [1536, 3382], [1332, 3392], [1004, 3438], [928, 3484], [844, 3490], [718, 3468], [638, 3514], [552, 3612], [502, 3672], [482, 3770], [468, 3856], [544, 3900], [602, 3908], [676, 3886], [736, 3878], [798, 3900], [858, 3930], [934, 3890], [986, 3884], [1056, 3894], [1198, 3912], [1290, 3884], [1388, 3880], [1540, 3886], [1618, 3898], [1684, 3884], [1808, 3684], [1986, 3436], [1996, 3328], [1996, 3238], [1772, 3334]
    ]
  }
];

regions.forEach(region => {
  const shape = L.polygon(region.polygon, { color: '#3388ff', weight: 2, fillOpacity: 0.2 });
  shape.addTo(map);
  shape.on('mouseover', function(e) {
    this.setStyle({ color: 'orange', fillOpacity: 0.4 });
    this.bindTooltip(`<b>${region.name}</b>`, {sticky: true}).openTooltip();
  });
  shape.on('mouseout', function(e) {
    this.setStyle({ color: '#3388ff', fillOpacity: 0.2 });
    this.closeTooltip();
  });
  shape.on('click', function() {
    window.open(region.forum, '_blank');
  });
});

map.on('click', function(e) {
  // Для CRS.Simple координаты e.latlng соответствуют [y, x]
  console.log('Координаты клика:', e.latlng);
});
