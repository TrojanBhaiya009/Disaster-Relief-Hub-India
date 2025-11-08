// ===== NEEDS PAGE JS - Unified with Index (Theme + Animations + Map + Filters) =====

// ===== SCROLL ANIMATIONS =====
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

// ===== THEME TOGGLE (Unified with Index.js) =====
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle") || document.getElementById("modeToggle");

  // Restore saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light");

  if (toggleBtn) {
    const icon = toggleBtn.querySelector("i");
    if (document.body.classList.contains("light")) {
      icon.classList.replace("fa-moon", "fa-sun");
    }

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const isLight = document.body.classList.contains("light");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      icon.classList.replace(isLight ? "fa-moon" : "fa-sun", isLight ? "fa-sun" : "fa-moon");
    });
  }
});

// ===== LEAFLET MAP INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  const map = L.map("map").setView([22.9734, 78.6569], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const needs = [
    { state: "Kerala", type: "Medical", coords: [10.8505, 76.2711], details: "Urgent need for medical aid & first aid kits." },
    { state: "Maharashtra", type: "Food", coords: [19.7515, 75.7139], details: "Food and clean water required for flood victims." },
    { state: "Uttarakhand", type: "Shelter", coords: [30.0668, 79.0193], details: "Temporary shelters needed for displaced families." },
    { state: "Gujarat", type: "Transport", coords: [22.2587, 71.1924], details: "Need vehicles for supply transportation." },
    { state: "Assam", type: "Food", coords: [26.2006, 92.9376], details: "Emergency rations needed due to flash floods." }
  ];

  let markers = [];

  function renderMarkers(data) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    data.forEach(n => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<i class="fa-solid fa-location-dot" style="color:#667eea;font-size:24px;"></i>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });
      const marker = L.marker(n.coords, { icon })
        .addTo(map)
        .bindPopup(`<b>${n.state}</b><br>Type: ${n.type}<br>${n.details}`);
      markers.push(marker);
    });
  }

  renderMarkers(needs);

  const needsList = document.getElementById("needs-list");
  function renderNeeds(data) {
    needsList.innerHTML = "";
    data.forEach(n => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";
      col.innerHTML = `
        <div class="card p-3">
          <h5>${n.state}</h5>
          <p><strong>Type:</strong> ${n.type}</p>
          <p>${n.details}</p>
        </div>`;
      needsList.appendChild(col);
    });
  }
  renderNeeds(needs);

  // ===== FILTER LOGIC =====
  const form = document.getElementById("needs-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const stateVal = document.getElementById("stateFilter").value;
    const typeVal = document.getElementById("typeFilter").value;

    const filtered = needs.filter(n => {
      const matchState = stateVal === "all" || n.state === stateVal;
      const matchType = typeVal === "all" || n.type === typeVal;
      return matchState && matchType;
    });

    renderMarkers(filtered);
    renderNeeds(filtered);
  });
});
