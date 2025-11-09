// ===== Dashboard JS - Leaflet Map + Filters + Chart + Animation + Theme =====

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

// ===== LEAFLET MAP INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("disasterMap");
  if (!mapContainer) return;

  const map = L.map("disasterMap").setView([22.9734, 78.6569], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

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

  const getColor = status => {
    switch (status) {
      case "Alert": return "red";
      case "Active": return "orange";
      case "Monitoring": return "dodgerblue";
      default: return "gray";
    }
  };

  function renderMarkers(data) {
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

  renderMarkers(disasters);

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

  regionFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
});

// ===== CHART INITIALIZATION =====
const ctx = document.getElementById("disasterChart");
let disasterChart;

if (ctx) {
  const graphFilter = document.getElementById("graphFilter");
  const chartTypeSelect = document.getElementById("chartType");

  const getChartData = (filter) => {
    if (filter === "week") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Incidents Reported",
          data: [5, 8, 6, 10, 9, 7, 11],
          borderColor: "#667eea",
          backgroundColor: "rgba(102,126,234,0.4)",
          fill: true,
          tension: 0.3
        }]
      };
    } else if (filter === "month") {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          label: "Incidents Reported",
          data: [28, 35, 40, 33],
          borderColor: "#764ba2",
          backgroundColor: "rgba(118,75,162,0.4)",
          fill: true,
          tension: 0.3
        }]
      };
    } else {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Incidents Reported",
          data: [200, 250, 220, 300, 270, 290, 310, 330, 400, 370, 420, 390],
          borderColor: "#ffb347",
          backgroundColor: "rgba(255,179,71,0.4)",
          fill: true,
          tension: 0.3
        }]
      };
    }
  };

  const renderChart = (type, filter) => {
    const isLight = document.body.classList.contains("light");
    const textColor = isLight ? "#000" : "#fff";
    const gridColor = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
    const bgColor = isLight ? "#ffffff" : "#181633";

    if (disasterChart) disasterChart.destroy();

    disasterChart = new Chart(ctx, {
      type: type,
      data: getChartData(filter),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: textColor } },
          title: {
            display: true,
            text: "Disaster Trends",
            color: textColor,
            font: { size: 18 }
          }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        },
        backgroundColor: bgColor
      }
    });
  };

  // Initialize first chart
  renderChart("line", "week");

  // Filter change listeners
  graphFilter.addEventListener("change", () => {
    renderChart(chartTypeSelect.value, graphFilter.value);
  });
  chartTypeSelect.addEventListener("change", () => {
    renderChart(chartTypeSelect.value, graphFilter.value);
  });
}

// ===== THEME TOGGLE =====
const modeToggle = document.getElementById("modeToggle");
if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const icon = modeToggle.querySelector("i");
    if (document.body.classList.contains("light")) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }

    // Re-render chart on theme change
    setTimeout(() => {
      const graphFilter = document.getElementById("graphFilter");
      const chartTypeSelect = document.getElementById("chartType");
      if (ctx && typeof Chart !== "undefined") {
        const filter = graphFilter?.value || "week";
        const type = chartTypeSelect?.value || "line";
        if (typeof renderChart === "function") {
          const event = new Event("change");
          graphFilter.dispatchEvent(event);
        }
      }
    }, 300);
  });
}
