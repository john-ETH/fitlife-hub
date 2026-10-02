// ข้อมูลท่าออกกำลังกายจำลอง (สำหรับแสดงผลและกรอง)
const exercisesData = [
  { id: 1, name: "Push Up (วิดพื้น)", category: "chest", desc: "สร้างความแข็งแรงของอกและแขน" },
  { id: 2, name: "Squat (สควอท)", category: "legs", desc: "บริหารกล้ามเนื้อขาและสะโพก" },
  { id: 3, name: "Plank (แพลงก์)", category: "core", desc: "เสริมความแข็งแรงของแกนกลางลำตัว" },
  { id: 4, name: "Dumbbell Press", category: "chest", desc: "เน้นสร้างกล้ามเนื้ออกส่วนกลาง" },
  { id: 5, name: "Lunge", category: "legs", desc: "ฝึกการทรงตัวและกล้ามเนื้อต้นขา" }
];

document.addEventListener('DOMContentLoaded', () => {
  fetchWeatherData();
  renderExercises(exercisesData);
  setupFilter();
});

// ดึงข้อมูล Open-Meteo API
async function fetchWeatherData() {
  const loadingEl = document.getElementById('weather-loading');
  const contentEl = document.getElementById('weather-content');
  const errorEl = document.getElementById('weather-error');

  // พิกัดกรุงเทพฯ (Lat: 13.75, Lon: 100.51)
  const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.51&current_weather=true';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการโหลดข้อมูล');

    const data = await response.json();
    const weather = data.current_weather;

    // คำนวณคำแนะนำตามอุณหภูมิ
    let advice = "สภาพอากาศดี เหมาะสำหรับการวิ่งกลางแจ้ง";
    if (weather.temperature > 32) advice = "อากาศร้อนจัด ควรเตรียมน้ำดื่มและเลี่ยงแดดจัด";

    // อัปเดต DOM
    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
    contentEl.innerHTML = `
      <div class="bg-slate-700 p-4 rounded-lg">
        <p class="text-slate-400 text-sm">อุณหภูมิ</p>
        <p class="text-2xl font-bold text-amber-400">${weather.temperature} °C</p>
      </div>
      <div class="bg-slate-700 p-4 rounded-lg">
        <p class="text-slate-400 text-sm">ความเร็วลม</p>
        <p class="text-2xl font-bold text-sky-400">${weather.windspeed} km/h</p>
      </div>
      <div class="bg-slate-700 p-4 rounded-lg col-span-1 md:col-span-1">
        <p class="text-slate-400 text-sm">คำแนะนำ</p>
        <p class="text-sm font-semibold text-emerald-400">${advice}</p>
      </div>
    `;
  } catch (error) {
    console.error('API Error:', error);
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
  }
}

// Render รายการ Exercise Cards
function renderExercises(data) {
  const listEl = document.getElementById('exercise-list');
  if (!listEl) return;

  if (data.length === 0) {
    listEl.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8">ไม่พบท่าออกกำลังกายที่ค้นหา</p>`;
    return;
  }

  listEl.innerHTML = data.map(item => `
    <article class="bg-slate-800 text-white rounded-xl p-6 shadow-md border border-slate-700 hover:border-orange-500 transition-all">
      <span class="text-xs font-bold uppercase bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">${item.category}</span>
      <h3 class="text-xl font-bold mt-3 mb-2">${item.name}</h3>
      <p class="text-slate-400 text-sm">${item.desc}</p>
    </article>
  `).join('');
}

// ระบบ Filter และ Search
function setupFilter() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');

  function filterData() {
    const searchText = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = exercisesData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchText);
      const matchCategory = category === 'all' || item.category === category;
      return matchSearch && matchCategory;
    });

    renderExercises(filtered);
  }

  if (searchInput && categoryFilter) {
    searchInput.addEventListener('input', filterData);
    categoryFilter.addEventListener('change', filterData);
  }
}