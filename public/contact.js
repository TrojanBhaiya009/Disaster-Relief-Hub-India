// 🌗 Dark / Light mode toggle + save preference
const toggle = document.getElementById("modeToggle");
const body = document.body;

// Load saved mode
if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
} else {
  toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

// Toggle mode
toggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");

  if (body.classList.contains("light-mode")) {
    toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem("theme", "light");
  } else {
    toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("theme", "dark");
  }
});

// 🗺️ Leaflet Map Initialization
const map = L.map("contactMap").setView([28.6139, 77.209], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
}).addTo(map);

L.marker([28.6139, 77.209])
  .addTo(map)
  .bindPopup("<b>National Disaster Relief Hub</b><br>New Delhi, India.")
  .openPopup();

// 📩 Contact Form Submission Logic
const contactForm = document.getElementById("contactForm");
const responseMsg = document.getElementById("responseMsg");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validation
  if (!name || !email || !subject || !message) {
    showMessage("⚠️ Please fill out all fields.", "orange");
    return;
  }

  // Send to backend
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (res.ok) {
      showMessage("✅ Message sent successfully!", "limegreen");
      contactForm.reset();
    } else {
      throw new Error("Server Error");
    }
  } catch (err) {
    showMessage("❌ Failed to send message. Try again later.", "red");
  }
});

// 🧩 Helper function for animated responses
function showMessage(text, color) {
  responseMsg.textContent = text;
  responseMsg.style.color = color;
  responseMsg.style.opacity = 1;
  responseMsg.style.transition = "opacity 0.4s ease";

  setTimeout(() => {
    responseMsg.style.opacity = 0;
  }, 4000);
}

// 💫 Smooth scroll reveal animation (optional polish)
window.addEventListener("scroll", () => {
  document.querySelectorAll(".contact-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }
  });
});

// Initial hidden state for animation
document.querySelectorAll(".contact-card").forEach((card) => {
  card.style.opacity = 0;
  card.style.transform = "translateY(30px)";
  card.style.transition = "all 0.5s ease";
});
