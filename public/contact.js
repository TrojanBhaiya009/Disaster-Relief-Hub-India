// ============ Dark Mode Toggle ============ //
const modeToggle = document.getElementById("modeToggle");
const body = document.body;

modeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const icon = modeToggle.querySelector("i");
  if (body.classList.contains("light-mode")) {
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
  }
});

// ============ Leaflet Map ============ //
const map = L.map("contactMap").setView([28.6139, 77.2090], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([28.6139, 77.2090])
  .addTo(map)
  .bindPopup("<b>National Disaster Relief Hub</b><br>New Delhi, India.")
  .openPopup();

// ============ Contact Form Submission ============ //
const contactForm = document.getElementById("contactForm");
const responseMsg = document.getElementById("responseMsg");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      responseMsg.textContent = "✅ Message sent successfully!";
      responseMsg.style.color = "#00ff99";
      contactForm.reset();
    } else {
      responseMsg.textContent = "❌ Failed to send message. Try again.";
      responseMsg.style.color = "#ff4c4c";
    }
  } catch (error) {
    console.error("Error:", error);
    responseMsg.textContent = "⚠️ Server error. Please try later.";
    responseMsg.style.color = "#ffcc00";
  }
});
