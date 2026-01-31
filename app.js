let role = "";
let reports = JSON.parse(localStorage.getItem("reports")) || [
  { id: "RPT001", facility: "AC Ruang 101", status: "Dikirim", feedback: "" },
  { id: "RPT002", facility: "Proyektor 205", status: "Diproses", feedback: "" },
  { id: "RPT003", facility: "WiFi Lemah", status: "Selesai", feedback: "" }
];

function save() {
  localStorage.setItem("reports", JSON.stringify(reports));
}

/* ================= LOGIN ================= */
function login(r) {
  role = r;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  buildMenu();
  showDashboard();
}

function logout() {
  location.reload();
}

/* ================= MENU ================= */
function buildMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  const items =
    role === "student"
      ? ["Dashboard", "Buat Laporan", "Riwayat"]
      : ["Dashboard", "Daftar Laporan"];

  items.forEach(item => {
    const btn = document.createElement("button");
    btn.innerText = item;
    btn.onclick = () => navigate(item);
    menu.appendChild(btn);
  });
}

/* ================= NAVIGASI ================= */
function navigate(view) {
  document.getElementById("title").innerText = view;
  if (view === "Dashboard") showDashboard();
  if (view === "Buat Laporan") showForm();
  if (view === "Riwayat") showHistory();
  if (view === "Daftar Laporan") showTech();
}

/* ================= DASHBOARD ================= */
function showDashboard() {
  const total = reports.length;
  const sent = reports.filter(r => r.status === "Dikirim").length;
  const process = reports.filter(r => r.status === "Diproses").length;
  const done = reports.filter(r => r.status === "Selesai").length;

  document.getElementById("content").innerHTML = `
    <div class="dashboard">
      <div class="card bg-total"><h3>Total</h3><b>${total}</b></div>
      <div class="card bg-sent"><h3>Dikirim</h3><b>${sent}</b></div>
      <div class="card bg-process"><h3>Diproses</h3><b>${process}</b></div>
      <div class="card bg-done"><h3>Selesai</h3><b>${done}</b></div>
    </div>
  `;
}

/* ================= MAHASISWA ================= */
function showForm() {
  document.getElementById("content").innerHTML = `
    <div class="card bg-total">
      <h3>Buat Laporan</h3>
      <input id="facility" placeholder="Nama fasilitas">
      <button class="btn yellow" onclick="submitReport()">Kirim</button>
    </div>
  `;
}

function submitReport() {
  const f = document.getElementById("facility").value;
  if (!f) return alert("Nama fasilitas wajib diisi");

  reports.unshift({
    id: "RPT" + Math.floor(Math.random() * 900),
    facility: f,
    status: "Dikirim",
    feedback: ""
  });

  save();
  showHistory();
}

/* ================= RIWAYAT + SEARCH & FILTER ================= */
function showHistory() {
  document.getElementById("content").innerHTML = `
    <div class="card bg-process">
      <h3>Riwayat Laporan</h3>

      <input id="searchInput" placeholder="Cari ID / fasilitas"
        oninput="renderHistory()" style="width:100%;margin-bottom:8px">

      <select id="statusFilter" onchange="renderHistory()"
        style="width:100%;margin-bottom:12px">
        <option value="">Semua Status</option>
        <option value="Dikirim">Dikirim</option>
        <option value="Diproses">Diproses</option>
        <option value="Selesai">Selesai</option>
      </select>

      <ul id="historyList"></ul>
    </div>
  `;
  renderHistory();
}

function renderHistory() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const f = document.getElementById("statusFilter").value;

  document.getElementById("historyList").innerHTML = reports
    .filter(r =>
      (r.id.toLowerCase().includes(q) || r.facility.toLowerCase().includes(q)) &&
      (f === "" || r.status === f)
    )
    .map((r, i) => `
      <li style="margin-bottom:12px">
        <b>${r.id}</b> - ${r.facility}
        <span class="badge ${badge(r.status)}">${r.status}</span>

        ${
          r.status === "Selesai"
            ? `
            <textarea id="fb${i}" placeholder="Tulis feedback..."
              style="width:100%;margin-top:6px"></textarea>
            <button class="btn blue" onclick="saveFeedback(${i})">
              Kirim Feedback
            </button>
            `
            : ""
        }
      </li>
    `).join("");
}

function saveFeedback(i) {
  const t = document.getElementById("fb" + i).value;
  if (!t) return alert("Feedback tidak boleh kosong");
  reports[i].feedback = t;
  save();
  alert("Feedback terkirim");
  showHistory();
}

/* ================= TEKNISI + SEARCH & FILTER ================= */
function showTech() {
  document.getElementById("content").innerHTML = `
    <div class="card bg-done">
      <h3>Daftar Laporan Teknisi</h3>

      <input id="searchTech" placeholder="Cari laporan"
        oninput="renderTech()" style="width:100%;margin-bottom:8px">

      <select id="filterTech" onchange="renderTech()"
        style="width:100%;margin-bottom:12px">
        <option value="">Semua Status</option>
        <option value="Dikirim">Dikirim</option>
        <option value="Diproses">Diproses</option>
        <option value="Selesai">Selesai</option>
      </select>

      <ul id="techList"></ul>
    </div>
  `;
  renderTech();
}

function renderTech() {
  const q = document.getElementById("searchTech").value.toLowerCase();
  const f = document.getElementById("filterTech").value;

  document.getElementById("techList").innerHTML = reports
    .filter(r =>
      (r.id.toLowerCase().includes(q) || r.facility.toLowerCase().includes(q)) &&
      (f === "" || r.status === f)
    )
    .map((r, i) => `
      <li style="margin-bottom:12px">
        <b>${r.id}</b> - ${r.facility}
        <span class="badge ${badge(r.status)}">${r.status}</span>
        ${r.feedback ? `<p>💬 ${r.feedback}</p>` : ""}
        ${
          r.status !== "Selesai"
            ? `<button class="btn blue" onclick="finishReport(${i})">Selesai</button>`
            : ""
        }
      </li>
    `).join("");
}

function finishReport(i) {
  reports[i].status = "Selesai";
  save();
  alert("Laporan diselesaikan");
  showTech();
}

/* ================= BADGE ================= */
function badge(s) {
  if (s === "Dikirim") return "sent";
  if (s === "Diproses") return "process";
  return "done";
}
/* ================= MODAL REGISTER & FORGOT ================= */

function openRegister() {
  document.getElementById("registerModal").classList.remove("hidden");
}

function closeRegister() {
  document.getElementById("registerModal").classList.add("hidden");
}

function openForgot() {
  document.getElementById("forgotModal").classList.remove("hidden");
}

function closeForgot() {
  document.getElementById("forgotModal").classList.add("hidden");
}
