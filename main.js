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
    name: 'Йошихара', // Название города (будет крупно в подсказке)
    location: 'Север', // Название региона (будет выделено цветом)
    locationColor: '#2e8b57', // Цвет для названия региона (опционально)
    desc: 'Крупнейший город на севере. Здесь живут мудрецы и маги.', // Описание (любой текст)
    forum: 'https://forum.example.com/yoshihara',
    polygon: [
      [1884, 1420], [1884, 1348], [1994, 1248], [2196, 1382], [2198, 1492], [2196, 1520], [2118, 1526], [2084, 1572], [2010, 1468]
    ]
  },
  {
    name: 'Игридас', // Название города (будет крупно в подсказке)
    location: 'Юг', // Название региона (будет выделено цветом)
    locationColor: '#ff4500', // Цвет для названия региона (опционально)
    desc: 'Город на юге, известный своими фестивалями и ярмарками.', // Описание (любой текст)
    forum: 'https://forum.example.com/igridas',
    polygon: [
      [1692, 572], [1796, 702], [1812, 788], [1802, 864], [1692, 988], [1558, 928], [1518, 768], [1534, 662], [1574, 602], [1650, 574]
    ]
  },
  {
    name: 'Идо', // Название города (будет крупно в подсказке)
    location: 'Запад', // Название региона (будет выделено цветом)
    locationColor: '#1e90ff', // Цвет для названия региона (опционально)
    desc: 'Западный город, окружённый горами и лесами.', // Описание (любой текст)
    forum: 'https://forum.example.com/ido',
    polygon: [
      [270, 3271], [247, 3393], [366, 3504], [359, 3559], [315, 3687], [491, 3893], [537, 3784], [646, 3653], [683, 3584], [707, 3510], [713, 3408], [694, 3304], [648, 3209], [469, 3161], [383, 3290], [318, 3287]
    ]
  },
  {
    name: 'Корзус', // Название города (будет крупно в подсказке)
    location: 'Центр', // Название региона (будет выделено цветом)
    locationColor: '#8b0000', // Цвет для названия региона (опционально)
    desc: 'Центральный город, сердце торговли и культуры.', // Описание (любой текст)
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
    // Кастомная подсказка:
    // 1. Название города (region.name) — крупно
    // 2. Черта
    // 3. Локация (region.location) — цвет задаётся через region.locationColor
    // 4. Описание (region.desc) — просто текст
    const tooltipHtml = `
      <div style="padding:12px 18px; background:rgba(255,255,255,0.97); border-radius:10px; box-shadow:0 2px 12px #0002; min-width:200px;">
        <div style="font-weight:bold; font-size:1.3em; color:#222; margin-bottom:6px;">${region.name}</div>
        <hr style="margin:6px 0 8px 0; border:none; border-top:1.5px solid #e0e0e0;"/>
        <div style="margin-bottom:8px; font-size:1.08em;">
          <span style="font-weight:bold; color:#888;">Локация: </span>
          <span style="color:${region.locationColor || '#3388ff'}; font-weight:bold;">${region.location || '—'}</span>
        </div>
        <div style="font-size:1em; color:#444; white-space:pre-line;">${region.desc || ''}</div>
      </div>
    `;
    this.setStyle({ color: 'orange', fillOpacity: 0.4 });
    this.bindTooltip(tooltipHtml, {sticky: true, direction: 'top', className: 'custom-tooltip'}).openTooltip();
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
