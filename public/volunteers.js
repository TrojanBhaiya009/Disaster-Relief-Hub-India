// ===== SCROLL ANIMATIONS =====
const fadeEls = document.querySelectorAll(".fade-up");
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
  });
}, { threshold: 0.2 });
fadeEls.forEach(el => obs.observe(el));

// ===== THEME TOGGLE (sync with site) =====
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

// ===== FORM LOGIC + PREVIEW LIST =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("volunteerForm");
  const list = document.getElementById("volunteerList");
  const msg = document.getElementById("formMsg");

  function cardHtml(v) {
    return `
      <div class="col-md-4 mb-4">
        <div class="card p-3">
          <h5 class="mb-1">${v.fullName}</h5>
          <p class="mb-1"><strong>Expertise:</strong> ${v.skills}</p>
          <p class="mb-1"><strong>Location:</strong> ${v.city}, ${v.state}</p>
          <p class="mb-1"><strong>Availability:</strong> ${v.availability}</p>
          <p class="mb-1"><i class="fa-solid fa-envelope"></i> ${v.email}</p>
          <p class="mb-0"><i class="fa-solid fa-phone"></i> ${v.phone}</p>
        </div>
      </div>
    `;
  }

  function addToPreview(v) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cardHtml(v);
    // append actual .col-md-4 node
    list.appendChild(wrapper.firstElementChild);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      state: document.getElementById("state").value,
      city: document.getElementById("city").value.trim(),
      skills: document.getElementById("skills").value,
      availability: document.getElementById("availability").value,
      notes: document.getElementById("notes").value.trim(),
      consent: document.getElementById("consent").checked
    };

    // Basic validation
    if (!data.consent) {
      msg.className = "mt-3 small error";
      msg.textContent = "Please agree to be contacted.";
      return;
    }
    if (!data.fullName || !data.email || !data.phone || !data.state || !data.city || !data.skills || !data.availability) {
      msg.className = "mt-3 small error";
      msg.textContent = "Please fill all required fields.";
      return;
    }

    // Show optimistic UI preview
    addToPreview(data);
    msg.className = "mt-3 small success";
    msg.textContent = "Registered locally. Attempting to save to server…";

    // ===== BACKEND HOOK (Node + SQL) =====
    // Replace `/api/volunteers` with your actual endpoint.
    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Server responded with an error");
      msg.className = "mt-3 small success";
      msg.textContent = "Successfully registered on server ✅";
      form.reset();
    } catch (err) {
      // Still keep the preview; let user know server save failed
      msg.className = "mt-3 small error";
      msg.textContent = "Saved locally, but server save failed. Check backend endpoint.";
      console.error(err);
    }
  });
});
