const ready = (fn) => {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

ready(() => {
  const pricingToggle = document.querySelector("[data-pricing-toggle]");
  if (pricingToggle) {
    const buttons = pricingToggle.querySelectorAll("button");
    const priceEls = document.querySelectorAll("[data-price]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.dataset.mode;
        priceEls.forEach((priceEl) => {
          const weekly = priceEl.dataset.weekly;
          const monthly = priceEl.dataset.monthly;
          priceEl.textContent = mode === "monthly" ? monthly : weekly;
        });
      });
    });
  }

  const mealCount = document.querySelector("[data-meal-count]");
  if (mealCount) {
    const output = document.querySelector("[data-meal-output]");
    mealCount.addEventListener("input", () => {
      output.textContent = mealCount.value;
    });
  }

  const draggables = document.querySelectorAll(".draggable-meal");
  const slots = document.querySelectorAll(".calendar-slot");
  draggables.forEach((meal) => {
    meal.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", meal.dataset.meal);
    });
  });
  slots.forEach((slot) => {
    slot.addEventListener("dragover", (event) => event.preventDefault());
    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      const mealName = event.dataTransfer.getData("text/plain");
      if (!mealName) return;
      const item = document.createElement("div");
      item.className = "draggable-meal";
      item.textContent = mealName;
      slot.appendChild(item);
    });
  });

  const checklist = document.querySelectorAll("[data-checklist] input");
  checklist.forEach((item) => {
    item.addEventListener("change", () => {
      const label = item.closest("label");
      if (label) {
        label.style.textDecoration = item.checked ? "line-through" : "none";
        label.style.color = item.checked ? "#64748B" : "";
      }
    });
  });

  const calculator = document.querySelector("[data-calculator]");
  if (calculator) {
    const result = calculator.querySelector("[data-calculated]");
    calculator.addEventListener("submit", (event) => {
      event.preventDefault();
      const protein = Number(calculator.querySelector("[name=protein]").value || 0);
      const carbs = Number(calculator.querySelector("[name=carbs]").value || 0);
      const fats = Number(calculator.querySelector("[name=fats]").value || 0);
      const calories = protein * 4 + carbs * 4 + fats * 9;
      result.textContent = `${calories} kcal`;
    });
  }

  const steps = document.querySelectorAll("[data-step]");
  if (steps.length) {
    let current = 0;
    const updateSteps = () => {
      steps.forEach((step, index) => {
        step.style.display = index === current ? "block" : "none";
      });
      document.querySelectorAll(".progress-step").forEach((bar, index) => {
        bar.classList.toggle("active", index <= current);
      });
    };
    updateSteps();
    document.querySelectorAll("[data-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        current = Math.min(current + 1, steps.length - 1);
        updateSteps();
      });
    });
    document.querySelectorAll("[data-prev]").forEach((btn) => {
      btn.addEventListener("click", () => {
        current = Math.max(current - 1, 0);
        updateSteps();
      });
    });
  }

  const themeToggles = document.querySelectorAll("[data-theme-toggle]");
  if (themeToggles.length) {
    const applyTheme = (isDark) => {
      document.body.classList.toggle("dark-theme", isDark);
      themeToggles.forEach((btn) => {
        btn.textContent = isDark ? "Light Mode" : "Dark Mode";
        btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      });
    };
    const stored = localStorage.getItem("freshplate-theme");
    applyTheme(stored === "dark");
    themeToggles.forEach((btn) => {
      btn.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-theme");
        localStorage.setItem("freshplate-theme", isDark ? "dark" : "light");
        applyTheme(isDark);
      });
    });
  }

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.querySelector("[data-menu-panel]");
  const menuClose = document.querySelector("[data-menu-close]");
  if (menuToggle && menuPanel) {
    const closeMenu = () => {
      menuPanel.classList.remove("open");
      if (menuClose) menuClose.classList.remove("show");
    };
    menuToggle.addEventListener("click", () => {
      menuPanel.classList.toggle("open");
      if (menuClose) menuClose.classList.toggle("show");
    });
    if (menuClose) {
      menuClose.addEventListener("click", closeMenu);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    });
  }

  const siteMenuToggles = document.querySelectorAll("[data-site-menu-toggle]");
  siteMenuToggles.forEach((toggle) => {
    const target = document.querySelector(toggle.dataset.target);
    if (!target) return;
    toggle.addEventListener("click", () => {
      target.classList.toggle("open");
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        target.classList.remove("open");
      }
    });
  });
});
