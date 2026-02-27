(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggleBtn = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.matches && t.matches("a")) {
        nav.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Theme toggle (persisted)
  const root = document.documentElement;
  const themeBtn = document.querySelector("[data-theme-toggle]");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Formspree submit helper (AJAX submit + status text)
  async function wireForm(formId, statusId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        if (status) status.textContent = "Please fill out all required fields correctly.";
        return;
      }

      // Honeypot
      const hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value.trim() !== "") {
        if (status) status.textContent = "Thanks! Submitted.";
        form.reset();
        return;
      }

      if (status) status.textContent = "Sending…";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          if (status) status.textContent = "Thanks! We’ll be in touch shortly.";
          form.reset();
        } else {
          if (status) status.textContent = "Sorry — something went wrong. Please call us.";
        }
      } catch {
        if (status) status.textContent = "Network error — please try again or call us.";
      }
    });
  }

  // Wire up forms (IDs exist on relevant pages)
  wireForm("quoteForm", "formStatus");
    
})();
