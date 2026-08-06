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
        ? name + " — " + title
        : title;
    }

    var hint = document.getElementById("contact-hint");
    if (hint) hint.textContent = "Ответ " + response;

    var ig = document.getElementById("instagram-link");
    if (ig && configured(config.instagramUsername)) {
      ig.hidden = false;
      ig.href = "https://instagram.com/" + String(config.instagramUsername).replace(/^@/, "");
      ig.target = "_blank";
      ig.rel = "noopener";
      ig.textContent = "Instagram";
    }

    var tgContact = configured(config.telegramContactUsername)
      ? String(config.telegramContactUsername).replace(/^@/, "").trim()
      : "";
    var tgLine = document.getElementById("contact-telegram-line");
    var tgLink = document.getElementById("contact-telegram-link");
    var footerTg = document.getElementById("footer-telegram");
    if (tgContact) {
      var tgHref = "https://t.me/" + tgContact;
      var tgLabel = "@" + tgContact;
      if (tgLine && tgLink) {
        tgLine.hidden = false;
        tgLink.href = tgHref;
        tgLink.textContent = tgLabel;
        tgLink.target = "_blank";
        tgLink.rel = "noopener";
      }
      if (footerTg) {
        footerTg.hidden = false;
        footerTg.href = tgHref;
        footerTg.textContent = tgLabel;
        footerTg.target = "_blank";
        footerTg.rel = "noopener";
      }
    }

    var email = configured(config.contactEmail) ? String(config.contactEmail).trim() : "";
    var emailLine = document.getElementById("contact-email-line");
    var emailLink = document.getElementById("contact-email-link");
    var footerEmail = document.getElementById("footer-email");
    var emailInline = document.getElementById("contact-email-inline");
    if (email) {
      if (emailLine && emailLink) {
        emailLine.hidden = false;
        emailLink.href = "mailto:" + email;
        emailLink.textContent = email;
      }
      if (footerEmail) {
        footerEmail.hidden = false;
        footerEmail.href = "mailto:" + email;
        footerEmail.textContent = email;
      }
      if (emailInline) {
        emailInline.hidden = false;
        emailInline.textContent = "или email";
      }
    } else if (emailInline) {
      emailInline.hidden = true;
    }
  }

  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach(function (el) {
      io.observe(el);
    });
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
  initReveal();

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

