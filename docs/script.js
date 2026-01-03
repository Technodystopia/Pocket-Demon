// PocketDemon Documentation Scripts

(function () {
  "use strict";

  // ========================================
  // Theme Management
  // ========================================
  const ThemeManager = {
    init() {
      const savedTheme = localStorage.getItem("pocketdemon-theme") || "dark";
      this.setTheme(savedTheme, false);
      this.bindEvents();
    },

    setTheme(theme, animate = true) {
      if (animate) {
        document.body.style.transition =
          "background-color 0.3s ease, color 0.3s ease";
      }
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("pocketdemon-theme", theme);
      this.updateToggleButton(theme);
      this.updateLogo(theme);
    },

    updateToggleButton(theme) {
      const toggle = document.querySelector(".theme-toggle");
      if (!toggle) return;

      const icon = toggle.querySelector(".theme-toggle-icon");
      const label = toggle.querySelector(".theme-toggle-label");

      if (theme === "dark") {
        icon.textContent = "☀️";
        label.textContent = "Light";
      } else {
        icon.textContent = "🌙";
        label.textContent = "Dark";
      }
    },

    updateLogo(theme) {
      const logo = document.querySelector(".logo-image");
      if (!logo) return;

      if (theme === "dark") {
        logo.src = "images/DemonLogoBlack.png";
      } else {
        logo.src = "images/DemonLogoWhite.png";
      }
    },

    toggle() {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      this.setTheme(next);
    },

    bindEvents() {
      const toggle = document.querySelector(".theme-toggle");
      if (toggle) {
        toggle.addEventListener("click", () => this.toggle());
      }
    },
  };

  // ========================================
  // Mobile Menu
  // ========================================
  const MobileMenu = {
    init() {
      this.sidebar = document.querySelector(".sidebar");
      this.menuToggle = document.querySelector(".menu-toggle");
      this.overlay = this.createOverlay();
      this.bindEvents();
    },

    createOverlay() {
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      document.body.appendChild(overlay);
      return overlay;
    },

    open() {
      this.sidebar.classList.add("open");
      this.overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    },

    close() {
      this.sidebar.classList.remove("open");
      this.overlay.classList.remove("active");
      document.body.style.overflow = "";
    },

    toggle() {
      if (this.sidebar.classList.contains("open")) {
        this.close();
      } else {
        this.open();
      }
    },

    bindEvents() {
      if (this.menuToggle) {
        this.menuToggle.addEventListener("click", () => this.toggle());
      }

      this.overlay.addEventListener("click", () => this.close());

      // Close menu when clicking nav links on mobile
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 900) {
            this.close();
          }
        });
      });

      // Close on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.sidebar.classList.contains("open")) {
          this.close();
        }
      });
    },
  };

  // ========================================
  // Collapsible Navigation Sections
  // ========================================
  const CollapsibleNav = {
    init() {
      this.sections = document.querySelectorAll(".nav-section");
      // Reset old state format (one-time migration)
      const version = localStorage.getItem("pocketdemon-nav-version");
      if (version !== "2") {
        localStorage.removeItem("pocketdemon-nav-state");
        localStorage.setItem("pocketdemon-nav-version", "2");
      }
      this.loadState();
      this.bindEvents();
    },

    loadState() {
      const savedState = JSON.parse(
        localStorage.getItem("pocketdemon-nav-state") || "{}",
      );

      this.sections.forEach((section) => {
        const title = section.querySelector(".nav-section-title")?.textContent;
        if (title) {
          // Check if explicitly set to open (true), otherwise collapse
          const isOpen = savedState[title] === true;
          if (!isOpen) {
            section.classList.add("collapsed");
          }
        }
      });
    },

    saveState() {
      const state = {};
      this.sections.forEach((section) => {
        const title = section.querySelector(".nav-section-title")?.textContent;
        if (title) {
          // Save true if open, false if collapsed
          state[title] = !section.classList.contains("collapsed");
        }
      });
      localStorage.setItem("pocketdemon-nav-state", JSON.stringify(state));
    },

    toggle(section) {
      section.classList.toggle("collapsed");
      this.saveState();
    },

    bindEvents() {
      this.sections.forEach((section) => {
        const header = section.querySelector(".nav-section-header");
        if (header) {
          header.addEventListener("click", () => this.toggle(section));
        }
      });
    },
  };

  // ========================================
  // Search Functionality
  // ========================================
  const Search = {
    pages: [
      {
        title: "Home",
        url: "index.html",
        category: "Main",
        keywords: ["welcome", "start", "overview", "introduction"],
      },
      {
        title: "Getting Started",
        url: "getting-started.html",
        category: "Main",
        keywords: ["setup", "install", "begin", "quick start", "tutorial"],
      },
      {
        title: "Bands",
        url: "bands.html",
        category: "Core Features",
        keywords: ["artists", "musicians", "groups", "add band"],
      },
      {
        title: "Events & Concerts",
        url: "events.html",
        category: "Core Features",
        keywords: ["shows", "gigs", "live", "log concert", "add event"],
      },
      {
        title: "Venues",
        url: "venues.html",
        category: "Core Features",
        keywords: ["locations", "places", "clubs", "arenas", "stadiums"],
      },
      {
        title: "Statistics",
        url: "statistics.html",
        category: "Core Features",
        keywords: ["stats", "analytics", "data", "insights", "charts"],
      },
      {
        title: "Maps",
        url: "maps.html",
        category: "Core Features",
        keywords: ["world map", "locations", "geography", "travel"],
      },
      {
        title: "Concert Buddies",
        url: "buddies.html",
        category: "Social",
        keywords: ["friends", "companions", "people", "who"],
      },
      {
        title: "Sharing",
        url: "sharing.html",
        category: "Social",
        keywords: ["share", "export", "social media", "post"],
      },
      {
        title: "Wishlist",
        url: "wishlist.html",
        category: "Collections",
        keywords: ["want to see", "future", "planned", "upcoming"],
      },
      {
        title: "Photo Gallery",
        url: "gallery.html",
        category: "Collections",
        keywords: ["photos", "images", "pictures", "polaroid"],
      },
      {
        title: "Media Collection",
        url: "collection.html",
        category: "Collections",
        keywords: ["media", "files", "attachments"],
      },
      {
        title: "Merchandise",
        url: "merch.html",
        category: "Collections",
        keywords: ["merch", "shirts", "posters", "memorabilia"],
      },
      {
        title: "Backup & Sync",
        url: "backup.html",
        category: "Data",
        keywords: ["backup", "restore", "dropbox", "cloud", "sync"],
      },
      {
        title: "Import Data",
        url: "import.html",
        category: "Data",
        keywords: ["import", "migrate", "transfer", "setlist.fm", "last.fm"],
      },
      {
        title: "Integrations",
        url: "integrations.html",
        category: "Data",
        keywords: ["connect", "api", "external", "services"],
      },
      {
        title: "Achievements",
        url: "achievements.html",
        category: "More",
        keywords: ["badges", "rewards", "unlock", "milestones"],
      },
      {
        title: "Spending Tracker",
        url: "spending.html",
        category: "More",
        keywords: ["money", "cost", "expenses", "budget", "tickets"],
      },
      {
        title: "Year in Review",
        url: "year-in-review.html",
        category: "More",
        keywords: ["yearly", "annual", "summary", "wrapped"],
      },
      {
        title: "Settings",
        url: "settings.html",
        category: "More",
        keywords: ["preferences", "options", "configure", "customize"],
      },
      {
        title: "FAQ",
        url: "faq.html",
        category: "More",
        keywords: ["help", "questions", "answers", "support", "troubleshoot"],
      },
    ],

    init() {
      this.input = document.querySelector(".search-input");
      this.results = document.querySelector(".search-results");
      if (!this.input || !this.results) return;
      this.bindEvents();
    },

    search(query) {
      if (!query.trim()) return [];

      const q = query.toLowerCase();
      return this.pages
        .filter((page) => {
          const titleMatch = page.title.toLowerCase().includes(q);
          const categoryMatch = page.category.toLowerCase().includes(q);
          const keywordMatch = page.keywords.some((k) => k.includes(q));
          return titleMatch || categoryMatch || keywordMatch;
        })
        .slice(0, 6);
    },

    render(results) {
      if (results.length === 0) {
        this.results.innerHTML =
          '<div class="search-no-results">No results found</div>';
        return;
      }

      this.results.innerHTML = results
        .map(
          (page) => `
                <div class="search-result-item">
                    <a href="${page.url}">
                        <div class="search-result-title">${page.title}</div>
                        <div class="search-result-category">${page.category}</div>
                    </a>
                </div>
            `,
        )
        .join("");
    },

    show() {
      this.results.classList.add("active");
    },

    hide() {
      this.results.classList.remove("active");
    },

    bindEvents() {
      this.input.addEventListener("input", (e) => {
        const query = e.target.value;
        if (query.trim()) {
          const results = this.search(query);
          this.render(results);
          this.show();
        } else {
          this.hide();
        }
      });

      this.input.addEventListener("focus", () => {
        if (this.input.value.trim()) {
          this.show();
        }
      });

      // Close on click outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) {
          this.hide();
        }
      });

      // Keyboard navigation
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.hide();
          this.input.blur();
        }
      });

      // Keyboard shortcut to focus search (/)
      document.addEventListener("keydown", (e) => {
        if (e.key === "/" && !e.target.matches("input, textarea")) {
          e.preventDefault();
          this.input.focus();
        }
      });
    },
  };

  // ========================================
  // Scroll to Top Button
  // ========================================
  const ScrollToTop = {
    init() {
      this.button = this.createButton();
      this.bindEvents();
    },

    createButton() {
      const button = document.createElement("button");
      button.className = "scroll-to-top";
      button.innerHTML = "↑";
      button.setAttribute("aria-label", "Scroll to top");
      document.body.appendChild(button);
      return button;
    },

    update() {
      const scrolled = window.scrollY;
      if (scrolled > 400) {
        this.button.classList.add("visible");
      } else {
        this.button.classList.remove("visible");
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    bindEvents() {
      window.addEventListener("scroll", () => this.update(), { passive: true });
      this.button.addEventListener("click", () => this.scrollToTop());
    },
  };

  // ========================================
  // Reading Progress Bar
  // ========================================
  const ReadingProgress = {
    init() {
      this.bar = this.createBar();
      this.bindEvents();
    },

    createBar() {
      const bar = document.createElement("div");
      bar.className = "reading-progress";
      document.body.appendChild(bar);
      return bar;
    },

    update() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      this.bar.style.width = `${Math.min(progress, 100)}%`;
    },

    bindEvents() {
      window.addEventListener("scroll", () => this.update(), { passive: true });
      window.addEventListener("resize", () => this.update(), { passive: true });
    },
  };

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });
    },
  };

  // ========================================
  // Initialize Everything
  // ========================================
  document.addEventListener("DOMContentLoaded", function () {
    ThemeManager.init();
    MobileMenu.init();
    CollapsibleNav.init();
    Search.init();
    ScrollToTop.init();
    ReadingProgress.init();
    SmoothScroll.init();
  });
})();
