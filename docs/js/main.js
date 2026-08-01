(function () {
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  var stickyCta = document.getElementById("sticky-cta");
  var config = window.SITE_CONFIG || {};

  function configured(value) {
    if (!value) return false;
    var v = String(value).trim();
    return v.length > 0 && v.indexOf("PLACEHOLDER") === -1;
  }

  function telegramUrl(startPayload) {
    if (!configured(config.telegramUsername)) return "";
    var base = "https://t.me/" + String(config.telegramUsername).replace(/^@/, "");
    var start = startPayload || "book";
    if (!/^[a-z0-9_]{1,64}$/i.test(start)) start = "book";
    return base + "?start=" + encodeURIComponent(start);
  }

  function setNavOpen(open) {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  function closeNav() {
    setNavOpen(false);
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var expanded = burger.getAttribute("aria-expanded") === "true";
      setNavOpen(!expanded);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  document.querySelectorAll("[data-goal]").forEach(function (el) {
    el.addEventListener("click", function () {
      var goal = el.getAttribute("data-goal");
      if (goal && window.reachMetrikaGoal) {
        window.reachMetrikaGoal(goal);
      }
    });
  });

  function renderTelegramButtons() {
    document.querySelectorAll("[data-telegram-cta]").forEach(function (el) {
      var start = el.getAttribute("data-telegram-start") || "book";
      var url = telegramUrl(start);
      if (!url) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.href = url;
    });
  }

  renderTelegramButtons();

  if (stickyCta && "IntersectionObserver" in window) {
    var hero = document.getElementById("hero");
    if (hero) {
      var stickyObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            stickyCta.classList.toggle("is-visible", !entry.isIntersecting);
          });
        },
        { threshold: 0.1 }
      );
      stickyObserver.observe(hero);
    }
  }
})();
