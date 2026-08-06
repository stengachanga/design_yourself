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

  function contactTelegramUrl() {
    if (!configured(config.telegramContactUsername)) return "";
    return (
      "https://t.me/" +
      String(config.telegramContactUsername).replace(/^@/, "").trim()
    );
  }

  function contactEmailUrl() {
    if (!configured(config.contactEmail)) return "";
    return "mailto:" + String(config.contactEmail).trim();
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
      line.textContent = name ? name + " — " + title : title;
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
    var tgHref = contactTelegramUrl();
    var tgLine = document.getElementById("contact-telegram-line");
    var tgLink = document.getElementById("contact-telegram-link");
    var footerTg = document.getElementById("footer-telegram");
    if (tgContact && tgHref) {
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
        emailInline.textContent = " или email";
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

  function wireContactCta(el) {
    var channel = (el.getAttribute("data-contact") || "telegram").toLowerCase();
    var url = channel === "email" ? contactEmailUrl() : contactTelegramUrl();
    if (!url) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    if (el.tagName === "A") {
      el.href = url;
      if (channel === "telegram") {
        el.target = "_blank";
        el.rel = "noopener";
      } else {
        el.removeAttribute("target");
        el.removeAttribute("rel");
      }
    }
  }

  document.querySelectorAll("[data-contact]").forEach(wireContactCta);

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
