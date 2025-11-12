document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("modeToggle");
  const body = document.body;

  // Load saved theme
  if (localStorage.getItem("theme") === "light") {
    body.classList.add("light");
    toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  // Toggle theme
  toggle.addEventListener("click", () => {
    body.classList.toggle("light");
    const isLight = body.classList.contains("light");
    toggle.innerHTML = isLight
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Leaflet map
  const map = L.map("contactMap").setView([28.6139, 77.209], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
  }).addTo(map);
  L.marker([28.6139, 77.209])
    .addTo(map)
    .bindPopup("<b>National Disaster Relief Hub</b><br>New Delhi, India.")
    .openPopup();

  // Form submission
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("responseMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    if (!data.name || !data.email || !data.subject || !data.message) {
      msg.textContent = "⚠️ Please fill out all fields.";
      msg.style.color = "orange";
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        msg.textContent = "✅ Message sent successfully!";
        msg.style.color = "limegreen";
        form.reset();
      } else {
        msg.textContent = "❌ Server error.";
        msg.style.color = "red";
      }
    } catch {
      msg.textContent = "🚫 Failed to connect to server.";
      msg.style.color = "red";
    }
  });
});
