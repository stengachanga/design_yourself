(function () {
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  var form = document.getElementById("application-form");
  var formStatus = document.getElementById("form-status");
  var telegramLink = document.getElementById("telegram-link");

  function closeNav() {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
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

  if (telegramLink && telegramLink.dataset.empty === "true") {
    telegramLink.addEventListener("click", function (e) {
      e.preventDefault();
    });
  }

  function isValidContact(value) {
    var email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phone = /^[\d\s+()-]{7,}$/;
    return email.test(value) || phone.test(value.replace(/\s/g, ""));
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.className = "form__note";
      formStatus.textContent = "";

      var nameInput = form.querySelector('[name="name"]');
      var contactInput = form.querySelector('[name="contact"]');
      var valid = true;

      nameInput.classList.remove("invalid");
      contactInput.classList.remove("invalid");

      if (!nameInput.value.trim()) {
        nameInput.classList.add("invalid");
        valid = false;
      }

      if (!contactInput.value.trim() || !isValidContact(contactInput.value.trim())) {
        contactInput.classList.add("invalid");
        valid = false;
      }

      if (!valid) {
        formStatus.textContent = "Пожалуйста, укажите имя и корректный телефон или email.";
        formStatus.classList.add("form__note--error");
        return;
      }

      if (window.reachMetrikaGoal) {
        window.reachMetrikaGoal("form_submit");
      }

      formStatus.textContent =
        "Заявка принята! Мы свяжемся с вами. Ссылка на Telegram будет добавлена позже.";
      formStatus.classList.add("form__note--success");
      form.reset();
    });
  }
})();
