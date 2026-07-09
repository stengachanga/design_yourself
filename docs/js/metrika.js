(function () {
  var COUNTER_ID = 110553308;

  window.reachMetrikaGoal = function (goalName) {
    if (typeof ym === "function") {
      ym(COUNTER_ID, "reachGoal", goalName);
    }
  };

  var scrollGoals = [
    { id: "courses", goal: "scroll_courses" },
    { id: "benefits", goal: "scroll_benefits" },
    { id: "contact", goal: "scroll_contact" },
  ];

  var fired = {};

  function initScrollGoals() {
    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var goal = entry.target.dataset.scrollGoal;
          if (goal && !fired[goal]) {
            fired[goal] = true;
            window.reachMetrikaGoal(goal);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    scrollGoals.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (el) {
        el.dataset.scrollGoal = item.goal;
        observer.observe(el);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollGoals);
  } else {
    initScrollGoals();
  }
})();
