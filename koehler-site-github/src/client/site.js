/* Koehler Rescue Services — progressive enhancement */
(function () {
  "use strict";

  var body = document.body;
  var toggle = document.getElementById("nav-toggle");
  var drawer = document.getElementById("mobile-drawer");

  function setNav(open) {
    body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (drawer) drawer.setAttribute("aria-hidden", String(!open));
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!body.classList.contains("nav-open"));
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && body.classList.contains("nav-open")) {
      setNav(false);
      if (toggle) toggle.focus();
    }
  });

  if (drawer) {
    drawer.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) setNav(false);
    });
  }

  /* sticky header shadow */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* reveal on scroll */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  /* forms */
  document.querySelectorAll("[data-request-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var label = button ? button.innerHTML : "";

    function show(kind, html) {
      if (!status) return;
      status.className = "form-status is-" + kind;
      status.innerHTML = html;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var required = form.querySelectorAll("[required]");
      var bad = null;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          bad = bad || field;
          field.style.borderColor = "#ef4444";
        } else {
          field.style.borderColor = "";
        }
      });
      if (bad) {
        bad.focus();
        show("error", "Please fill in the highlighted fields so we can reach you.");
        return;
      }

      var phone = form.querySelector('[name="phone"]');
      if (phone && phone.value.replace(/\D/g, "").length < 10) {
        phone.style.borderColor = "#ef4444";
        phone.focus();
        show("error", "Please enter a 10-digit phone number so we can call you back.");
        return;
      }

      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = value;
      });

      if (button) {
        button.disabled = true;
        button.innerHTML = "Sending…";
      }
      show("success", "Sending your request…");

      fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().then(function (json) {
            return { ok: res.ok, json: json };
          });
        })
        .then(function (result) {
          if (result.ok && result.json && result.json.ok) {
            form.reset();
            show(
              "success",
              "<strong>Request received.</strong> We've sent it to our 24/7 team. If you don't hear back shortly — or if you're in a travel lane — call <a href='tel:+19892860100'>989-286-0100</a> right now."
            );
          } else {
            show(
              "error",
              "<strong>We couldn't send that automatically.</strong> Please call <a href='tel:+19892860100'>989-286-0100</a> now — we answer 24/7 — or email <a href='mailto:brian@koehlerrescue.com'>brian@koehlerrescue.com</a>."
            );
          }
        })
        .catch(function () {
          show(
            "error",
            "<strong>Connection problem.</strong> Please call <a href='tel:+19892860100'>989-286-0100</a> — that's always the fastest way to reach us."
          );
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            button.innerHTML = label;
          }
        });
    });
  });
})();
