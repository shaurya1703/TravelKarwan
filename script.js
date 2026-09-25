
const root = document.documentElement;
const trips = window.TRAVEL_KARWAN_TRIPS || [];
const themeToggle = document.getElementById("themeToggle");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const tripGrid = document.getElementById("tripGrid");
const tripSelect = document.getElementById("tripSelect");
const modal = document.getElementById("tripModal");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");

const savedTheme = localStorage.getItem("tk-theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("tk-theme", next);
});

menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

function observeReveals() {
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
}
observeReveals();

document.getElementById("year").textContent = new Date().getFullYear();

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    if (window.innerWidth < 900) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(950px) rotateY(${x*4.5}deg) rotateX(${y*-4.5}deg) translateY(-2px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

function tripCard(t) {
  return `
    <article class="trip-card reveal" data-categories="${t.category.join(" ")}">
      <div class="trip-image">
        <img src="${t.image}" alt="${t.title} trip">
        <span class="trip-badge">${t.badge || "Travel Karwan"}</span>
        <span class="trip-status">${t.status}</span>
      </div>
      <div class="trip-body">
        <small>${t.route}</small>
        <h3>${t.title}</h3>
        <p>${t.short}</p>
        <div class="trip-meta">
          <span>${t.duration}</span><span>${t.group}</span><span>${t.category[0]}</span>
        </div>
        <div class="trip-bottom">
          <b>${t.price}</b>
          <button data-open-trip="${t.id}">View trip →</button>
        </div>
      </div>
    </article>`;
}

function renderTrips(filter = "all") {
  const list = filter === "all" ? trips : trips.filter(t => t.category.includes(filter));
  tripGrid.innerHTML = list.length
    ? list.map(tripCard).join("")
    : `<div class="trip-empty">No live departures in this category yet. New routes are being curated.</div>`;
  wireTripButtons();
  observeReveals();
}

function wireTripButtons() {
  document.querySelectorAll("[data-open-trip]").forEach(btn => {
    btn.onclick = () => openTrip(btn.dataset.openTrip);
  });
}

function openTrip(id) {
  const t = trips.find(x => x.id === id);
  if (!t) return;
  modalContent.innerHTML = `
    <div class="modal-trip-image"><img src="${t.image}" alt="${t.title}"></div>
    <span class="modal-kicker">${t.status}</span>
    <h2>${t.title}</h2>
    <p>${t.short}</p>
    <div class="modal-chips">
      <span>${t.duration}</span><span>${t.group}</span><span>${t.price}</span>
    </div>
    <h3>Trip highlights</h3>
    <div class="modal-list">${t.highlights.map(x => `<div>${x}</div>`).join("")}</div>
    <h3>Package includes</h3>
    <div class="modal-list">${t.includes.map(x => `<div>${x}</div>`).join("")}</div>
    <h3>Pickup options</h3>
    <div class="modal-chips">${t.pickups.map(x => `<span>${x}</span>`).join("")}</div>
    <div class="modal-cta">
      <a class="btn btn-primary" href="#plan" onclick="document.getElementById('tripModal').classList.remove('open');document.body.style.overflow='';setTimeout(()=>document.getElementById('tripSelect').value='${t.id}',100)">Register interest →</a>
      <a class="btn btn-ghost" target="_blank" rel="noopener" href="https://wa.me/916388446797?text=${encodeURIComponent(`Hi Arnav, I want details about the ${t.title} trip.`)}">WhatsApp</a>
    </div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

document.querySelectorAll("[data-close-modal]").forEach(el => {
  el.addEventListener("click", () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
});

document.querySelectorAll("#tripFilters button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#tripFilters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTrips(btn.dataset.filter);
  });
});

function populateTripSelect() {
  tripSelect.innerHTML = `<option value="">Select</option>
    ${trips.map(t => `<option value="${t.id}">${t.title} — ${t.status}</option>`).join("")}
    <option value="custom">Custom / future trip enquiry</option>`;
}
populateTripSelect();
renderTrips();

document.getElementById("bookingForm").addEventListener("submit", e => {
  e.preventDefault();

  const selected = tripSelect.value === "custom"
    ? "Custom / future trip enquiry"
    : (trips.find(t => t.id === tripSelect.value)?.title || tripSelect.value);

  const message = `Hi Arnav,
I want to enquire/register with Travel Karwan.

PERSONAL DETAILS
Name: ${document.getElementById("fullName").value.trim()}
Contact No.: ${document.getElementById("phone").value.trim()}
Email: ${document.getElementById("email").value.trim()}
Age: ${document.getElementById("age").value}
Gender: ${document.getElementById("gender").value}
City: ${document.getElementById("city").value.trim()}
Address: ${document.getElementById("address").value.trim()}

TRAVEL DETAILS
Group of People: ${document.getElementById("groupPeople").value}
Travel Category: ${document.getElementById("travelCategory").value}
Trip: ${selected}
Pickup Point: ${document.getElementById("pickup").value}
${document.getElementById("note").value.trim() ? `Additional Message: ${document.getElementById("note").value.trim()}` : ""}

Please share seat availability and next booking steps.`;

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    window.open(`https://wa.me/916388446797?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  }, 650);
});
