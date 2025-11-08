// needs.js — Leaflet + Animation + Filtering 🌍

console.log("🗺️ Needs Map (Leaflet) loaded");

// ===== Navbar Highlight =====
const currentPage = location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
  const href = link.getAttribute("href");
  if (href === currentPage) link.classList.add("active");
});

// ===== Scroll Animation =====
const fadeElements = document.querySelectorAll(".fade-up, .fade-left, .fade-right");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
fadeElements.forEach(el => observer.observe(el));

// ===== Leaflet Map Setup =====
const map = L.map("map").setView([22.9734, 78.6569], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ===== Sample Needs Data =====
const needsData = [
  { state: "Kerala", type: "Medical", coords: [10.8505, 76.2711], details: "Urgent need for medical aid & first aid kits." },
  { state: "Maharashtra", type: "Food", coords: [19.7515, 75.7139], details: "Food and clean water required for flood victims." },
  { state: "Uttarakhand", type: "Shelter", coords: [30.0668, 79.0193], details: "Temporary shelters needed for displaced families." },
  { state: "Gujarat", type: "Transport", coords: [22.2587, 71.1924], details: "Need vehicles for supply transportation." },
  { state: "Assam", type: "Food", coords: [26.2006, 92.9376], details: "Emergency rations needed due to flash floods." },
];

let markers = [];

function renderMapMarkers(data) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  data.forEach(need => {
    const marker = L.marker(need.coords)
      .addTo(map)
      .bindPopup(`<b>${need.state}</b><br><i>${need.type}</i><br>${need.details}`);
    markers.push(marker);
  });
}

function renderNeedsList(data) {
  const container = document.getElementById("needs-list");
  container.innerHTML = "";
  data.forEach(need => {
    const div = document.createElement("div");
    div.className = "col-md-4 fade-up";
    div.innerHTML = `
      <div class="card p-3 mb-3">
        <h5>${need.state}</h5>
        <p><strong>Type:</strong> ${need.type}</p>
        <p>${need.details}</p>
      </div>
    `;
    container.appendChild(div);
  });
  const newEls = container.querySelectorAll(".fade-up");
  newEls.forEach(el => observer.observe(el));
}

renderMapMarkers(needsData);
renderNeedsList(needsData);

// ===== Filter Handler =====
document.getElementById("needs-form").addEventListener("submit", e => {
  e.preventDefault();
  const state = document.getElementById("stateFilter").value;
  const type = document.getElementById("typeFilter").value;

  const filtered = needsData.filter(n => {
    const matchState = state === "all" || n.state === state;
    const matchType = type === "all" || n.type === type;
    return matchState && matchType;
  });

  renderMapMarkers(filtered);
  renderNeedsList(filtered);

  const btn = e.target.querySelector("button");
  btn.innerHTML = "✅ Filtered!";
  btn.style.background = "linear-gradient(135deg, #00c853, #43a047)";
  setTimeout(() => {
    btn.innerHTML = "Filter Needs";
    btn.style.background = "";
  }, 2000);
});
