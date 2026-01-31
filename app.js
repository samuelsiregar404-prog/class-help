let role = "";
let reports = JSON.parse(localStorage.getItem("reports")) || [
  { id: "RPT001", facility: "AC Ruang 101", status: "Dikirim", feedback: "" },
  { id: "RPT002", facility: "Proyektor 205", status: "Diproses", feedback: "" },
  { id: "RPT003", facility: "WiFi Lemah", status: "Selesai", feedback: "" }
];

function save() {
  localStorage.setItem("reports", JSON.stringify(reports));
}

/* LOGIN */
function login(r) {
  role = r;
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  buildMenu();
  showDashboard();
}
function logout(){location.reload();}

/* MODAL */
function openRegister(){document.getElementById("registerModal").classList.remove("hidden");}
function closeRegister(){alert("Registrasi berhasil (simulasi)");document.getElementById("registerModal").classList.add("hidden");}
function openForgot(){document.getElementById("forgotModal").classList.remove("hidden");}
function closeForgot(){alert("Link reset dikirim (simulasi)");document.getElementById("forgotModal").classList.add("hidden");}

/* MENU */
function buildMenu(){
  const menu=document.getElementById("menu");
  menu.innerHTML="";
  const items=role==="student"
    ?["Dashboard","Buat Laporan","Riwayat"]
    :["Dashboard","Daftar Laporan"];
  items.forEach(i=>{
    const b=document.createElement("button");
    b.innerText=i;
    b.onclick=()=>navigate(i);
    menu.appendChild(b);
  });
}

/* NAVIGASI */
function navigate(v){
  document.getElementById("title").innerText=v;
  if(v==="Dashboard")showDashboard();
  if(v==="Buat Laporan")showForm();
  if(v==="Riwayat")showHistory();
  if(v==="Daftar Laporan")showTech();
}

/* 🌈 DASHBOARD WARNA HIDUP */
function showDashboard(){
  const total=reports.length;
  const sent=reports.filter(r=>r.status==="Dikirim").length;
  const process=reports.filter(r=>r.status==="Diproses").length;
  const done=reports.filter(r=>r.status==="Selesai").length;

  document.getElementById("content").innerHTML=`
  <div class="dashboard">
    <div class="card bg-total">
      <h3>📊 Total Laporan</h3>
      <b>${total}</b>
    </div>
    <div class="card bg-sent">
      <h3>📨 Dikirim</h3>
      <b>${sent}</b>
    </div>
    <div class="card bg-process">
      <h3>⚙️ Diproses</h3>
      <b>${process}</b>
    </div>
    <div class="card bg-done">
      <h3>✅ Selesai</h3>
      <b>${done}</b>
    </div>
  </div>`;
}

/* MAHASISWA */
function showForm(){
  document.getElementById("content").innerHTML=`
  <div class="card bg-total">
    <h3>📝 Buat Laporan</h3>
    <input id="facility" placeholder="Nama fasilitas">
    <button class="btn yellow" onclick="submitReport()">Kirim</button>
  </div>`;
}
function submitReport(){
  const f=document.getElementById("facility").value;
  if(!f)return alert("Nama fasilitas wajib diisi");
  reports.unshift({id:"RPT"+Math.floor(Math.random()*900),facility:f,status:"Dikirim",feedback:""});
  save();showHistory();
}

/* RIWAYAT + SEARCH */
function showHistory(){
  document.getElementById("content").innerHTML=`
  <div class="card bg-process">
    <h3>📚 Riwayat Laporan</h3>
    <input id="search" placeholder="Cari laporan..." oninput="renderHistory()">
    <ul id="historyList"></ul>
  </div>`;
  renderHistory();
}
function renderHistory(){
  const q=document.getElementById("search").value.toLowerCase();
  document.getElementById("historyList").innerHTML=
    reports.filter(r=>r.id.toLowerCase().includes(q)||r.facility.toLowerCase().includes(q))
    .map((r,i)=>`
      <li>${r.id} - ${r.facility}
      <span class="badge ${badge(r.status)}">${r.status}</span></li>`).join("");
}

/* TEKNISI */
function showTech(){
  document.getElementById("content").innerHTML=`
  <div class="card bg-done">
    <h3>🛠 Daftar Laporan</h3>
    <ul>${reports.map((r,i)=>`
      <li>${r.id} - ${r.facility}
      <span class="badge ${badge(r.status)}">${r.status}</span>
      <button onclick="finishReport(${i})">Selesai</button></li>`).join("")}
    </ul>
  </div>`;
}
function finishReport(i){
  reports[i].status="Selesai";
  save();
  alert("Notifikasi: Laporan "+reports[i].id+" selesai");
  showTech();
}

/* BADGE */
function badge(s){
  if(s==="Dikirim")return"sent";
  if(s==="Diproses")return"process";
  return"done";
}