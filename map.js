// =====================
// 1) 初始化地图
// =====================
const map = L.map('map', {
  scrollWheelZoom: true,
  wheelDebounceTime: 80,
  wheelPxPerZoomLevel: 120,
  zoomSnap: 1,
  zoomDelta: 1
}).setView([20.0, 0.0], 2);

// 基础地图层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 10
}).addTo(map);

// =====================
// 2) 城市数据（用你的原数据）
// =====================
const cities = [
  { name: "东京", coords: [35.6895, 139.6917], visited: false, photos: ["path/to/tokyo1.jpg", "path/to/tokyo2.jpg"] },
  { name: "巴黎", coords: [48.8566, 2.3522], visited: false, photos: ["path/to/paris1.jpg", "path/to/paris2.jpg"] },
  { name: "纽约", coords: [40.7128, -74.0060], visited: false, photos: [] },
  { name: "悉尼", coords: [-33.8688, 151.2093], visited: false, photos: [] },
  { name: "北京", coords: [39.9042, 116.4074], visited: false, url: "/DD-MEIMEI/cities/Beijing/" },
  { name: "伦敦", coords: [51.5074, -0.1278], visited: false, photos: [] },
  { name: "莫斯科", coords: [55.7558, 37.6173], visited: false, photos: [] },
  { name: "开罗", coords: [30.0444, 31.2357], visited: false, photos: ["path/to/cairo1.jpg"] },
  { name: "新德里", coords: [28.6139, 77.2090], visited: false, photos: [] },
  { name: "布宜诺斯艾利斯", coords: [-34.6037, -58.3816], visited: false, photos: [] },

  { name: "中山", coords: [22.5159, 113.3926], visited: true, url: "cities/ZhongShan/index.html" },
  { name: "珠海", coords: [22.2707, 113.5767], visited: true, url: "cities/ZhuHai/index.html" },

  { name: "南京", coords: [32.0603, 118.7969], visited: false, url: "cities/Nanjing" },
  { name: "六合（南京）", coords: [32.3463, 118.8482], visited: false, photos: ["path/to/liuhe1.jpg"] },
  { name: "香港", coords: [22.3193, 114.1694], visited: false, url: "/DD-MEIMEI/cities/Hong Kong" },
  { name: "长春", coords: [43.8171, 125.3235], visited: false, photos: ["path/to/changchun1.jpg"] },
  { name: "哈尔滨", coords: [45.8038, 126.5350], visited: false, photos: [] },
  { name: "广州", coords: [23.1291, 113.2644], visited: false, photos: ["path/to/guangzhou1.jpg"] },
  { name: "深圳", coords: [22.5431, 114.0579], visited: true, url: "/DD-family/cities/ShenZhen/index.html" },
  { name: "长沙", coords: [28.2278, 112.9389], visited: false, photos: [] },
  { name: "高邮", coords: [32.7852, 119.4432], visited: false, photos: ["path/to/gaoyou1.jpg"] },

  { name: "上海", coords: [31.2304, 121.4737], visited: true, url: "cities/ShangHai/index.html" },
  { name: "苏州", coords: [31.2989, 120.5853], visited: false, photos: ["path/to/suzhou1.jpg"] },
  { name: "嘉兴", coords: [30.7474, 120.7555], visited: true, url: "cities/JiaXing/index.html" },
  { name: "瓦肆 est（上海）", coords: [31.1958, 121.4504], visited: true, url: "cities/VAS-est/index.html" },
  { name: "汕尾", coords: [22.7862, 115.3753], visited: true, url: "cities/ShanWei/index.html" },
];

// =====================
// 3) 左侧栏：渲染 visited=true 的城市列表，并点击跳转
// =====================
const cityListEl = document.getElementById("city-list");
const visitedCountEl = document.getElementById("visited-count");

// 小工具：防止 photos/url 缺失时报错
function safeArray(x) {
  return Array.isArray(x) ? x : [];
}

// 可选：如果你有 GitHub Pages 的 basePath，可以在这里统一加前缀
// const basePath = "/DD-MEIMEI/"; // 例子
const basePath = "";

// 规范化 URL：让 "cities/Nanjing" 这种也能自动当目录
function normalizeUrl(u) {
  if (!u) return null;

  // 以 "/" 开头：当成站点根路径（注意：GitHub Pages 可能会 404）
  if (u.startsWith("/")) return u;

  const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(u);
  if (!looksLikeFile && !u.endsWith("/")) u += "/";
  if (u.endsWith("/")) u += "index.html";

  return basePath + u;
}

// 只取 visited 且有 url 的城市用于左侧列表
const visitedCities = cities
  .filter(c => c.visited && c.url)
  .map(c => ({ ...c, _url: normalizeUrl(c.url) }))
  .filter(c => !!c._url);

// 排序（按中文/英文都尽量自然）
visitedCities.sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));

// 更新计数
visitedCountEl.textContent = `${visitedCities.length}`;

// 渲染列表
visitedCities.forEach(city => {
  const li = document.createElement("li");

  const dot = document.createElement("span");
  dot.className = "dot";

  const name = document.createElement("span");
  name.className = "city-name";
  name.textContent = city.name;

  li.appendChild(dot);
  li.appendChild(name);

  // 点击跳转
  li.addEventListener("click", () => {
    window.location.href = city._url;
  });

  // 悬停飞到该城市
  li.addEventListener("mouseenter", () => {
    map.flyTo(city.coords, Math.max(map.getZoom(), 5), { duration: 0.6 });
  });

  cityListEl.appendChild(li);
});

// =====================
// 4) 地图上添加 marker（保持你原有逻辑）
// =====================
cities.forEach(city => {
  const marker = L.circleMarker(city.coords, {
    radius: 5,
    color: city.visited ? 'green' : 'gray',
    fillColor: city.visited ? 'lightgreen' : 'lightgray',
    fillOpacity: 0.8
  }).addTo(map);

  const url = normalizeUrl(city.url);

  if (city.visited && url) {
    // 去过 + 有 URL：点击跳转
    marker.on('click', () => {
      window.location.href = url;
    });
    marker.bindPopup(`<b>${city.name}</b><br>点击进入`);
  } else if (city.visited) {
    // 去过但无 URL：显示照片弹窗
    const photos = safeArray(city.photos)
      .map(photo => `<img src="${photo}" style="width:200px;margin-top:10px;border-radius:10px;" alt="${city.name}" />`)
      .join("");

    marker.bindPopup(`
      <b>${city.name}</b><br>
      ${photos || "已去过（暂无照片）"}
    `);
  } else {
    // 未去过：提示
    marker.bindPopup(`<b>${city.name}</b><br>未去过`);
  }
});
