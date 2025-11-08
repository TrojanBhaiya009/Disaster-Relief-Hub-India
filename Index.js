// ===== Dashboard JS - Leaflet Map + Filters + Animation =====

// Scroll animations
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


// ===== LEAFLET MAP INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("disasterMap");
  if (!mapContainer) return; // if map not present, stop

  // Initialize map
  const map = L.map("disasterMap").setView([22.9734, 78.6569], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Sample Disaster Data
  const disasters = [
    { state: "Kerala", region: "South", status: "Active", coords: [10.8505, 76.2711] },
    { state: "Uttarakhand", region: "North", status: "Monitoring", coords: [30.0668, 79.0193] },
    { state: "Maharashtra", region: "West", status: "Active", coords: [19.7515, 75.7139] },
    { state: "Gujarat", region: "West", status: "Alert", coords: [22.2587, 71.1924] },
    { state: "Assam", region: "North-East", status: "Monitoring", coords: [26.2006, 92.9376] },
    { state: "Bihar", region: "East", status: "Alert", coords: [25.0961, 85.3131] },
    { state: "Tamil Nadu", region: "South", status: "Monitoring", coords: [11.1271, 78.6569] },
  ];

  let markers = [];

  // Function: Get color based on status
  const getColor = status => {
    switch (status) {
      case "Alert": return "red";
      case "Active": return "orange";
      case "Monitoring": return "dodgerblue";
      default: return "gray";
    }
  };

  // Function: Render markers
  function renderMarkers(data) {
    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    data.forEach(d => {
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<i class="fa-solid fa-location-dot" style="color:${getColor(d.status)};font-size:24px;"></i>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const marker = L.marker(d.coords, { icon })
        .addTo(map)
        .bindPopup(`
          <b>${d.state}</b><br>
          Region: ${d.region}<br>
          Status: <strong style="color:${getColor(d.status)};">${d.status}</strong>
        `);
      markers.push(marker);
    });
  }

  // Initial render
  renderMarkers(disasters);

  // Filter logic
  const regionFilter = document.getElementById("regionFilter");
  const statusFilter = document.getElementById("statusFilter");

  function applyFilters() {
    const regionVal = regionFilter.value;
    const statusVal = statusFilter.value;

    const filtered = disasters.filter(d => {
      const regionMatch = regionVal === "all" || d.region === regionVal;
      const statusMatch = statusVal === "all" || d.status === statusVal;
      return regionMatch && statusMatch;
    });

    renderMarkers(filtered);
  }

  if (regionFilter && statusFilter) {
    regionFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
  }

  // ===== Light / Dark Mode Toggle =====
  const toggleBtn = document.getElementById("modeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");

      const icon = toggleBtn.querySelector("i");
      if (document.body.classList.contains("light")) {
        icon.classList.replace("fa-moon", "fa-sun");
      } else {
        icon.classList.replace("fa-sun", "fa-moon");
      }
    });
  }
});
