const map = L.map("map", {
  scrollWheelZoom: true,
  wheelDebounceTime: 80,
  wheelPxPerZoomLevel: 120,
  zoomSnap: 1,
  zoomDelta: 1,
  zoomControl: true
}).setView([27.4, 112.9], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
  maxZoom: 10
}).addTo(map);

const cities = [
  { name: "东京", coords: [35.6895, 139.6917], visited: false },
  { name: "巴黎", coords: [48.8566, 2.3522], visited: false },
  { name: "纽约", coords: [40.7128, -74.0060], visited: false },
  { name: "悉尼", coords: [-33.8688, 151.2093], visited: false },
  { name: "北京", coords: [39.9042, 116.4074], visited: false, url: "cities/Beijing/" },
  { name: "伦敦", coords: [51.5074, -0.1278], visited: false },
  { name: "莫斯科", coords: [55.7558, 37.6173], visited: false },
  { name: "开罗", coords: [30.0444, 31.2357], visited: false },
  { name: "新德里", coords: [28.6139, 77.2090], visited: false },
  { name: "布宜诺斯艾利斯", coords: [-34.6037, -58.3816], visited: false },

  {
    name: "曼谷",
    coords: [13.7563, 100.5018],
    visited: true,
    url: "cities/Bangkok/index.html",
    cover: "cities/Bangkok/media/cover.jpg",
    range: "2026.07.29 - 07.30",
    count: 1,
    mediaLabel: "video",
    note: "四面佛、CentralWorld、水门市场和曼谷第一夜"
  },

  {
    name: "中山",
    coords: [22.5159, 113.3926],
    visited: true,
    url: "cities/ZhongShan/index.html",
    cover: "cities/ZhongShan/images/IMG_7742.jpg",
    range: "2026.03 - 2026.05",
    count: 6,
    note: "甜点、早茶和一点夏天的果香"
  },
  {
    name: "珠海",
    coords: [22.2707, 113.5767],
    visited: true,
    url: "cities/ZhuHai/index.html",
    cover: "cities/ZhuHai/images/3.jpg",
    range: "2025.12",
    count: 7,
    note: "海边、落日和颓记"
  },
  { name: "南京", coords: [32.0603, 118.7969], visited: false, url: "cities/Nanjing/" },
  { name: "六合（南京）", coords: [32.3463, 118.8482], visited: false },
  { name: "香港", coords: [22.3193, 114.1694], visited: false, url: "cities/Hong Kong/" },
  { name: "长春", coords: [43.8171, 125.3235], visited: false },
  { name: "哈尔滨", coords: [45.8038, 126.5350], visited: false },
  { name: "广州", coords: [23.1291, 113.2644], visited: false },
  {
    name: "深圳",
    coords: [22.5431, 114.0579],
    visited: true,
    url: "cities/ShenZhen/index.html",
    cover: "cities/ShenZhen/images/IMG_7956.jpg",
    range: "2026.03 - 2026.05",
    count: 10,
    note: "日常饭点和城市碎片"
  },
  { name: "长沙", coords: [28.2278, 112.9389], visited: false },
  { name: "高邮", coords: [32.7852, 119.4432], visited: false },
  {
    name: "上海",
    coords: [31.2304, 121.4737],
    visited: true,
    url: "cities/ShangHai/index.html",
    cover: "cities/ShangHai/images/1.jpg",
    range: "2025.01",
    count: 4,
    note: "演唱会之前的小笼和街景"
  },
  { name: "苏州", coords: [31.2989, 120.5853], visited: false },
  {
    name: "嘉兴",
    coords: [30.7474, 120.7555],
    visited: true,
    url: "cities/JiaXing/index.html",
    cover: "cities/JiaXing/images/8.jpg",
    range: "2026.01",
    count: 11,
    note: "月河街、船宴和日落"
  },
  {
    name: "瓦肆 est（上海）",
    coords: [31.1958, 121.4504],
    visited: true,
    url: "cities/VAS-est/index.html",
    cover: "cities/VAS-est/images/7.jpg",
    range: "2025.01",
    count: 11,
    note: "Wolf Alice live night"
  },
  {
    name: "汕尾",
    coords: [22.7862, 115.3753],
    visited: true,
    url: "cities/ShanWei/index.html",
    cover: "cities/ShanWei/images/8.jpg",
    range: "2026.02",
    count: 16,
    note: "海边、饭桌和短假"
  }
];

const cityListEl = document.getElementById("city-list");
const visitedCountEl = document.getElementById("visited-count");
const basePath = "";

function normalizeUrl(url) {
  if (!url) return null;
  if (url.startsWith("/")) return url;

  const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(url);
  if (!looksLikeFile && !url.endsWith("/")) url += "/";
  if (url.endsWith("/")) url += "index.html";

  return basePath + url;
}

function popupHtml(city) {
  const url = normalizeUrl(city.url);
  const cover = city.cover || "";
  const mediaLabel = city.mediaLabel || "photos";
  return `
    <div class="city-popup">
      ${cover ? `<img src="${cover}" alt="${city.name}">` : ""}
      <div class="city-popup__body">
        <strong>${city.name}</strong>
        <span>${city.range || "Visited"} · ${city.count || 0} ${mediaLabel}</span>
        <span>${city.note || ""}</span>
        ${url ? `<a href="${url}">Open album →</a>` : ""}
      </div>
    </div>
  `;
}

const visitedCities = cities
  .filter((city) => city.visited && city.url)
  .map((city) => ({ ...city, _url: normalizeUrl(city.url) }))
  .filter((city) => city._url);

visitedCities.sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
visitedCountEl.textContent = `${visitedCities.length} places`;

visitedCities.forEach((city) => {
  const li = document.createElement("li");
  const mediaLabel = city.mediaLabel || "photos";
  li.innerHTML = `
    <img class="city-thumb" src="${city.cover}" alt="${city.name}">
    <span>
      <span class="city-name">${city.name}</span>
      <span class="city-meta">${city.range} · ${city.count} ${mediaLabel}</span>
      <span class="city-note">${city.note}</span>
    </span>
  `;

  li.addEventListener("click", () => {
    window.location.href = city._url;
  });

  li.addEventListener("mouseenter", () => {
    map.flyTo(city.coords, Math.max(map.getZoom(), 7), { duration: 0.65 });
  });

  cityListEl.appendChild(li);
});

const bounds = [];

cities.forEach((city) => {
  const url = normalizeUrl(city.url);

  if (city.visited) {
    bounds.push(city.coords);
  }

  const marker = city.visited
    ? L.marker(city.coords, {
        icon: L.divIcon({
          className: "",
          html: '<div class="visited-marker"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -10]
        })
      }).addTo(map)
    : L.circleMarker(city.coords, {
        radius: 4,
        color: "#7b7f78",
        fillColor: "#c9c5ba",
        fillOpacity: 0.68,
        weight: 1
      }).addTo(map);

  if (city.visited && url) {
    marker.bindPopup(popupHtml(city));
    marker.on("dblclick", () => {
      window.location.href = url;
    });
  } else {
    marker.bindPopup(`<b>${city.name}</b><br>Not yet`);
  }
});

if (bounds.length) {
  map.fitBounds(bounds, { padding: [70, 70], maxZoom: 6 });
}
