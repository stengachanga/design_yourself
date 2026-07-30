(function () {
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  var form = document.getElementById("application-form");
  var formStatus = document.getElementById("form-status");
  var courseSelect = document.getElementById("course-select");
  var contactInput = document.getElementById("contact-input");
  var contactFieldText = document.getElementById("contact-field-text");
  var contactAlternatives = document.getElementById("contact-alternatives");
  var stickyCta = document.getElementById("sticky-cta");
  var config = window.SITE_CONFIG || {};

  function configured(value) {
    if (!value) return false;
    var v = String(value).trim();
    return v.length > 0 && v.indexOf("PLACEHOLDER") === -1;
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

  document.querySelectorAll("[data-course]").forEach(function (el) {
    el.addEventListener("click", function () {
      var course = el.getAttribute("data-course");
      if (courseSelect && course) {
        courseSelect.value = course;
      }
    });
  });

  document.querySelectorAll("[data-scroll-highlight]").forEach(function (el) {
    el.addEventListener("click", function () {
      var targetId = el.getAttribute("data-scroll-highlight");
      var section = document.getElementById(targetId);
      if (!section) return;
      section.classList.add("is-highlighted");
      setTimeout(function () {
        section.classList.remove("is-highlighted");
      }, 2000);
    });
  });

  function applyCourseFromUrl() {
    if (!courseSelect || courseSelect.tagName !== "SELECT") return;
    var params = new URLSearchParams(window.location.search);
    var course = params.get("course");
    if (course && courseSelect.querySelector('option[value="' + course + '"]')) {
      courseSelect.value = course;
    }
  }

  applyCourseFromUrl();

  function updateContactField() {
    if (!form || !contactInput || !contactFieldText) return;
    var type = form.querySelector('input[name="contact_type"]:checked');
    var isEmail = type && type.value === "email";
    contactFieldText.textContent = isEmail ? "Email" : "Телефон";
    contactInput.type = isEmail ? "email" : "tel";
    contactInput.inputMode = isEmail ? "email" : "tel";
    contactInput.autocomplete = isEmail ? "email" : "tel";
    contactInput.placeholder = isEmail ? "name@example.com" : "+7 (999) 123-45-67";
    contactInput.value = "";
    contactInput.classList.remove("invalid");
  }

  if (form) {
    form.querySelectorAll('input[name="contact_type"]').forEach(function (radio) {
      radio.addEventListener("change", updateContactField);
    });
  }

  function renderContactAlternatives() {
    if (!contactAlternatives) return;
    var parts = [];
    if (config.contactPhone) {
      parts.push('<a href="tel:' + config.contactPhone.replace(/\s/g, "") + '">Позвонить</a>');
    }
    if (configured(config.contactEmail) && !String(config.contactEmail).includes("example")) {
      parts.push('<a href="mailto:' + config.contactEmail + '">' + config.contactEmail + "</a>");
    } else if (configured(config.contactEmail)) {
      parts.push('<a href="mailto:' + config.contactEmail + '">Email</a>');
    }
    contactAlternatives.innerHTML = parts.length
      ? "Или свяжитесь напрямую: " + parts.join(" · ")
      : "";
  }

  renderContactAlternatives();

  function isValidContact(value, isEmail) {
    if (isEmail) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    return /^[\d\s+()-]{7,}$/.test(value.replace(/\s/g, ""));
  }

  function buildLeadPayload(formData) {
    return {
      name: formData.get("name"),
      contact: formData.get("contact"),
      contactType: formData.get("contact_type"),
      course: formData.get("course") || "consultation",
      message: formData.get("message") || "",
      submittedAt: new Date().toISOString(),
      source: config.siteUrl || window.location.href,
    };
  }

  function saveLeadLocally(payload) {
    try {
      var key = "design_yourself_leads";
      var leads = JSON.parse(localStorage.getItem(key) || "[]");
      leads.push(payload);
      localStorage.setItem(key, JSON.stringify(leads));
    } catch (e) {
      /* ignore */
    }
  }

  function formatTelegramMessage(payload) {
    return [
      "🆕 Заявка с сайта «Конструктор Личности»",
      "",
      "Имя: " + payload.name,
      "Контакт: " + payload.contact + " (" + payload.contactType + ")",
      "Запрос: консультация",
      "Комментарий: " + (payload.message || "—"),
      "Источник: " + payload.source,
      "Время: " + payload.submittedAt,
    ].join("\n");
  }

  async function sendViaTelegram(payload) {
    var token = config.telegramBotToken;
    var chatId = config.telegramChatId;
    if (!configured(token) || !configured(chatId)) {
      throw new Error("telegram_not_configured");
    }
    var response = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatTelegramMessage(payload),
      }),
    });
    var data = await response.json();
    if (!data.ok) throw new Error(data.description || "telegram_send_failed");
  }

  function sendViaMailto(payload) {
    var body = [
      "Имя: " + payload.name,
      "Контакт: " + payload.contact + " (" + payload.contactType + ")",
      "Запрос: консультация",
      "Комментарий: " + (payload.message || "—"),
    ].join("\n");
    var email = config.contactEmail || "hello@design-yourself.example";
    window.location.href =
      "mailto:" +
      encodeURIComponent(email) +
      "?subject=" +
      encodeURIComponent("Запись на консультацию — Конструктор Личности") +
      "&body=" +
      encodeURIComponent(body);
  }

  async function submitForm(formData) {
    var payload = buildLeadPayload(formData);
    saveLeadLocally(payload);

    if (configured(config.telegramBotToken) && configured(config.telegramChatId)) {
      await sendViaTelegram(payload);
      return "telegram";
    }

    if (config.formEndpoint) {
      var response = await fetch(config.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!response.ok) throw new Error("form_submit_failed");
      return "endpoint";
    }

    sendViaMailto(payload);
    return "mailto";
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      formStatus.className = "form__note";
      formStatus.textContent = "";

      var nameInput = form.querySelector('[name="name"]');
      var consentInput = form.querySelector('[name="consent"]');
      var type = form.querySelector('input[name="contact_type"]:checked');
      var isEmail = type && type.value === "email";
      var valid = true;

      nameInput.classList.remove("invalid");
      contactInput.classList.remove("invalid");

      if (!nameInput.value.trim()) {
        nameInput.classList.add("invalid");
        valid = false;
      }

      if (!contactInput.value.trim() || !isValidContact(contactInput.value.trim(), isEmail)) {
        contactInput.classList.add("invalid");
        valid = false;
      }

      if (!consentInput.checked) {
        formStatus.textContent = "Необходимо согласие на обработку персональных данных.";
        formStatus.classList.add("form__note--error");
        return;
      }

      if (!valid) {
        formStatus.textContent = "Пожалуйста, заполните обязательные поля корректно.";
        formStatus.classList.add("form__note--error");
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;

      try {
        var channel = await submitForm(new FormData(form));
        if (window.reachMetrikaGoal) {
          window.reachMetrikaGoal("form_submit");
        }
        var messages = {
          telegram: "Заявка отправлена! Свяжусь с вами в течение 24 часов.",
          endpoint: "Заявка отправлена! Свяжусь с вами в течение 24 часов.",
          mailto: "Заявка сохранена. Откроется почтовый клиент для отправки.",
        };
        formStatus.textContent = messages[channel] || messages.endpoint;
        formStatus.classList.add("form__note--success");
        form.reset();
        updateContactField();
      } catch (err) {
        formStatus.textContent =
          "Не удалось отправить заявку. Попробуйте позже или напишите на " +
          (config.contactEmail || "email");
        formStatus.classList.add("form__note--error");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

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
