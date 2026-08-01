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

  function openTelegram(startPayload) {
    var url = telegramUrl(startPayload);
    if (url) window.open(url, "_blank", "noopener");
  }

  function applyOfferCopy() {
    var format = config.sessionFormat || "Онлайн";
    var duration = config.sessionDuration || "50 минут";
    var price = config.sessionPrice || "от 5 000 ₽";
    var response = config.responseTime || "в течение 24 часов";

    var heroOffer = document.getElementById("hero-offer");
    if (heroOffer) {
      heroOffer.textContent = [format, duration, price, "ответ " + response].join(" · ");
    }

    document.querySelectorAll("[data-format]").forEach(function (el) {
      el.textContent = format;
    });
    document.querySelectorAll("[data-duration]").forEach(function (el) {
      el.textContent = duration;
    });
    document.querySelectorAll("[data-price]").forEach(function (el) {
      el.textContent = price;
    });
    document.querySelectorAll("[data-response]").forEach(function (el) {
      el.textContent = response;
    });
    document.querySelectorAll("[data-education]").forEach(function (el) {
      if (config.education) el.textContent = config.education;
    });

    var line = document.getElementById("specialist-line");
    if (line) {
      var name = configured(config.specialistName) ? config.specialistName : "";
      var title = config.specialistTitle || "Психолог-консультант";
      line.textContent = name
        ? name + " — " + title + " практики «" + (config.brandName || "Конструктор Личности") + "»"
        : title + " практики «" + (config.brandName || "Конструктор Личности") + "»";
    }

    var hint = document.getElementById("contact-hint");
    if (hint) hint.textContent = "Ответ " + response;
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
      if (goal && window.reachMetrikaGoal) window.reachMetrikaGoal(goal);
    });
  });

  function wireTelegramCta(el) {
    var start = el.getAttribute("data-telegram-start") || "book";
    var url = telegramUrl(start);
    if (!url) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    if (el.tagName === "A") {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.addEventListener("click", function () {
        openTelegram(start);
      });
    }
  }

  document.querySelectorAll("[data-telegram-cta]").forEach(wireTelegramCta);

  applyOfferCopy();

  if (stickyCta && "IntersectionObserver" in window) {
    var hero = document.getElementById("hero");
    if (hero) {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            stickyCta.classList.toggle("is-visible", !entry.isIntersecting);
          });
        },
        { threshold: 0.1 }
      ).observe(hero);
    }
  }
})();
