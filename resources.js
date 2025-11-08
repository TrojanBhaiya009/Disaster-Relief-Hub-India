// ===== RESOURCES PAGE JS WITH MAP + FILTERS + THEME =====

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll(".fade-up");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
fadeElements.forEach(el => observer.observe(el));

// ===== THEME TOGGLE =====
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("modeToggle");
  const icon = toggleBtn.querySelector("i");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    icon.classList.replace("fa-moon", "fa-sun");
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    icon.classList.replace(isLight ? "fa-moon" : "fa-sun", isLight ? "fa-sun" : "fa-moon");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
});

// ===== LEAFLET MAP + RESOURCES =====
document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("resourcesMap").setView([22.9734, 78.6569], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const resources = [
    { type: "Medical", location: "Delhi", coords: [28.6139, 77.2090], name: "Medical Supplies Warehouse", available: "500 First Aid Kits, 200 Blankets", contact: "+91-11-XXXX-XXXX" },
    { type: "Food", location: "Mumbai", coords: [19.0760, 72.8777], name: "Food Distribution Center", available: "5 Tons Rice, 10 Tankers Water", contact: "+91-22-XXXX-XXXX" },
    { type: "Vehicles", location: "Bangalore", coords: [12.9716, 77.5946], name: "Transport Fleet Hub", available: "25 Trucks, 10 Ambulances", contact: "+91-80-XXXX-XXXX" },
    { type: "Generators", location: "Chennai", coords: [13.0827, 80.2707], name: "Power Supply Depot", available: "12 Diesel Generators", contact: "+91-44-XXXX-XXXX" },
    { type: "Shelter", location: "Kolkata", coords: [22.5726, 88.3639], name: "Temporary Shelter Camp", available: "80 Family Tents, 400 Blankets", contact: "+91-33-XXXX-XXXX" }
  ];

  let markers = [];

  // ===== CARD RENDER FUNCTION =====
  const listContainer = document.getElementById("resourcesList");
  function renderResources(data) {
    listContainer.innerHTML = "";
    data.forEach(r => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card p-3">
          <h5>${r.name}</h5>
          <p><strong>Type:</strong> ${r.type}</p>
          <p><strong>Location:</strong> ${r.location}</p>
          <p><strong>Available:</strong> ${r.available}</p>
          <p><strong>Contact:</strong> ${r.contact}</p>
        </div>
      `;
      listContainer.appendChild(col);
    });
  }

  // ===== MAP MARKER FUNCTION =====
  function getColor(type) {
    switch (type) {
      case "Medical": return "#ff4757";
      case "Food": return "#ffa502";
      case "Vehicles": return "#1e90ff";
      case "Generators": return "#a55eea";
      case "Shelter": return "#2ed573";
      default: return "gray";
    }
  }

  function renderMarkers(data) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    data.forEach(r => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<i class="fa-solid fa-warehouse" style="color:${getColor(r.type)};font-size:22px;"></i>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const marker = L.marker(r.coords, { icon })
        .addTo(map)
        .bindPopup(`
          <b>${r.name}</b><br>
          Type: <strong style="color:${getColor(r.type)}">${r.type}</strong><br>
          Location: ${r.location}<br>
          ${r.available}<br>
          <i class="fa-solid fa-phone"></i> ${r.contact}
        `);
      markers.push(marker);
    });
  }

  // INITIAL LOAD
  renderResources(resources);
  renderMarkers(resources);

  // FILTER FUNCTION
  const form = document.getElementById("resourceForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const typeVal = document.getElementById("resourceType").value;
    const locVal = document.getElementById("locationFilter").value;

    const filtered = resources.filter(r =>
      (typeVal === "all" || r.type === typeVal) &&
      (locVal === "all" || r.location === locVal)
    );

    renderResources(filtered);
    renderMarkers(filtered);
  });
});
