(function () {
  "use strict";

  /* ── State ── */
  var answers = {};
  var history = [];

  /* ── Screen order (full flow) ── */
  var fullFlow = [
    "intro","q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14","email","review"
  ];

  /* If user picks "no-loss" on Q1 → skip triage (Q2-Q6) and jump to Q7 */
  var skipTriageFlow = [
    "intro","q1","q7","q8","q9","q10","q11","q12","q13","q14","email","review"
  ];

  function getFlow() {
    return answers.reason === "no-loss" ? skipTriageFlow : fullFlow;
  }

  /* ── DOM helpers ── */
  var wrapper = document.getElementById("quizWrapper");
  var progressBar = document.getElementById("quizProgress");
  var backBtn = document.getElementById("quizBack");

  function currentScreen() {
    return wrapper.querySelector(".quiz-screen.active");
  }

  function screenByName(name) {
    return wrapper.querySelector('[data-screen="' + name + '"]');
  }

  /* ── Hide site header/footer ── */
  document.body.classList.add("quiz-active");

  /* ── Progress ── */
  function updateProgress() {
    var flow = getFlow();
    var cur = currentScreen();
    var name = cur ? cur.getAttribute("data-screen") : "intro";
    var idx = flow.indexOf(name);
    if (idx < 0) idx = 0;
    var pct = Math.round((idx / (flow.length - 1)) * 100);
    progressBar.style.width = pct + "%";
  }

  /* ── Validation: check if current screen has a valid answer ── */
  function isScreenAnswered(screenName) {
    if (screenName === "intro" || screenName === "email" || screenName === "review") return true;

    var screen = screenByName(screenName);
    if (!screen) return true;

    /* Single-choice: check if the top-level quiz-options has a selected item */
    var singleOpts = screen.querySelector('.quiz-options[data-type="single"][data-key]');
    if (singleOpts) {
      var key = singleOpts.getAttribute("data-key");
      /* For Q7 the top-level container is not a quiz-options with data-key, so skip this */
      if (key && !answers[key]) return false;
    }

    /* Multi-choice: check if at least one is selected */
    var multiOpts = screen.querySelector('.quiz-options[data-type="multi"][data-key]');
    if (multiOpts) {
      var mkey = multiOpts.getAttribute("data-key");
      if (!answers[mkey] || (Array.isArray(answers[mkey]) && answers[mkey].length === 0)) return false;
    }

    /* Grid: check if all rows have a selection */
    var grid = screen.querySelector(".quiz-grid[data-key]");
    if (grid) {
      var gkey = grid.getAttribute("data-key");
      var rows = grid.querySelectorAll(".quiz-grid-row[data-item]");
      if (!answers[gkey]) return false;
      for (var i = 0; i < rows.length; i++) {
        var item = rows[i].getAttribute("data-item");
        if (!answers[gkey][item]) return false;
      }
    }

    /* Q7 special: need age + sex */
    if (screenName === "q7") {
      var ageInput = document.getElementById("qAge");
      var age = ageInput ? ageInput.value.trim() : "";
      if (!age || !answers.sex) return false;
    }

    return true;
  }

  /* ── Navigate ── */
  function goTo(screenName) {
    var cur = currentScreen();
    if (cur) {
      var curName = cur.getAttribute("data-screen");
      if (curName !== screenName) history.push(curName);
      cur.classList.remove("active");
    }
    var next = screenByName(screenName);
    if (next) {
      next.classList.remove("active");
      void next.offsetWidth;
      next.classList.add("active");
    }
    backBtn.classList.toggle("visible", history.length > 0 && screenName !== "review");
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goNext() {
    var flow = getFlow();
    var cur = currentScreen();
    var name = cur ? cur.getAttribute("data-screen") : "intro";

    /* Block if not answered */
    if (!isScreenAnswered(name)) return;

    var idx = flow.indexOf(name);
    if (idx >= 0 && idx < flow.length - 1) {
      goTo(flow[idx + 1]);
    }
  }

  function goBack() {
    if (history.length === 0) return;
    var prev = history.pop();
    var cur = currentScreen();
    if (cur) cur.classList.remove("active");
    var prevScreen = screenByName(prev);
    if (prevScreen) {
      prevScreen.classList.remove("active");
      void prevScreen.offsetWidth;
      prevScreen.classList.add("active");
    }
    backBtn.classList.toggle("visible", history.length > 0);
    updateProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Start button ── */
  document.getElementById("quizStart").addEventListener("click", function () {
    goNext();
  });

  /* ── Back button ── */
  backBtn.addEventListener("click", goBack);

  /* ── Single-choice options: auto-advance ── */
  wrapper.addEventListener("click", function (e) {
    var option = e.target.closest(".quiz-option");
    if (!option) return;

    var container = option.closest(".quiz-options");
    if (!container) return;

    var type = container.getAttribute("data-type");
    var key = container.getAttribute("data-key");

    if (type === "single") {
      container.querySelectorAll(".quiz-option").forEach(function (o) {
        o.classList.remove("selected");
      });
      option.classList.add("selected");
      answers[key] = option.getAttribute("data-value");

      /* Show/hide conditional female questions */
      if (key === "sex") {
        var femBlock = document.getElementById("femaleQuestions");
        if (femBlock) {
          femBlock.classList.toggle("visible", option.getAttribute("data-value") === "female");
        }
        return; /* Don't auto-advance from sex selection inside Q7 */
      }

      /* Don't auto-advance if inside the personal info screen (nested options) */
      var screen = option.closest(".quiz-screen");
      if (screen && screen.getAttribute("data-screen") === "q7") return;

      /* Auto-advance after short delay for single-choice top-level questions */
      setTimeout(goNext, 350);

    } else if (type === "multi") {
      var isExclusive = option.getAttribute("data-exclusive") === "true";
      if (isExclusive) {
        container.querySelectorAll(".quiz-option").forEach(function (o) {
          o.classList.remove("selected");
        });
        option.classList.add("selected");
      } else {
        var noneOpt = container.querySelector('[data-exclusive="true"]');
        if (noneOpt) noneOpt.classList.remove("selected");
        option.classList.toggle("selected");
      }
      var vals = [];
      container.querySelectorAll(".quiz-option.selected").forEach(function (o) {
        vals.push(o.getAttribute("data-value"));
      });
      answers[key] = vals;
    }
  });

  /* ── Grid radios (yes/no/not-sure) ── */
  wrapper.addEventListener("click", function (e) {
    var radio = e.target.closest(".grid-radio");
    if (!radio) return;

    var row = radio.closest(".quiz-grid-row");
    var grid = radio.closest(".quiz-grid");
    if (!row || !grid) return;

    var key = grid.getAttribute("data-key");
    var item = row.getAttribute("data-item");
    var val = radio.getAttribute("data-val");

    row.querySelectorAll(".grid-radio").forEach(function (r) {
      r.classList.remove("selected");
    });
    radio.classList.add("selected");

    if (!answers[key]) answers[key] = {};
    answers[key][item] = val;
  });

  /* ── Next buttons (multi-choice & grid screens) ── */
  wrapper.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goNext();
    });
  });

  /* ── Q7 Continue (capture age before validation) ── */
  var q7Next = document.getElementById("q7Next");
  if (q7Next) {
    q7Next.addEventListener("click", function () {
      var ageInput = document.getElementById("qAge");
      var age = ageInput ? ageInput.value.trim() : "";
      if (age) answers.age = age;
      goNext();
    });
  }

  /* ── Email submit ── */
  document.getElementById("quizSubmitEmail").addEventListener("click", function () {
    var emailInput = document.getElementById("qEmail");
    var emailError = document.getElementById("emailError");
    var email = emailInput.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add("error");
      emailError.style.display = "block";
      return;
    }

    emailInput.classList.remove("error");
    emailError.style.display = "none";
    answers.email = email;

    submitQuizData(answers);

    goTo("review");
    backBtn.classList.remove("visible");
  });

  /* ── Format answers into readable text ── */
  function formatAnswers(data) {
    var lines = [];
    lines.push("=== HAIR QUIZ SUBMISSION ===");
    lines.push("Date: " + new Date().toISOString());
    lines.push("Email: " + (data.email || ""));
    lines.push("");

    var labels = {
      reason: "What brings you here",
      onset_time: "When did hair loss start",
      onset_type: "How did it start",
      pattern: "Main pattern",
      scalp_symptoms: "Scalp symptoms",
      breakage_vs_shedding: "Breakage vs shedding",
      age: "Age",
      sex: "Sex at birth",
      pregnant: "Pregnant or breastfeeding",
      postpartum: "Postpartum in last 12 months",
      cycles: "Menstrual cycles",
      bleeding: "Bleeding",
      diet: "Diet pattern",
      dieted: "Dieted in last 6 months",
      sun: "Sun exposure",
      exclusions: "Dietary exclusions",
      iron_symptoms: "Iron deficiency symptoms",
      vitd_symptoms: "Vitamin D symptoms",
      b12_symptoms: "B12 / other symptoms"
    };

    Object.keys(labels).forEach(function (key) {
      if (data[key] === undefined) return;
      var val = data[key];
      if (Array.isArray(val)) {
        val = val.join(", ");
      } else if (typeof val === "object" && val !== null) {
        var parts = [];
        Object.keys(val).forEach(function (k) {
          parts.push(k + ": " + val[k]);
        });
        val = parts.join(", ");
      }
      lines.push(labels[key] + ": " + val);
    });

    return lines.join("\n");
  }

  function slugifyTagPart(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);
  }

  function addUniqueTag(tags, tag) {
    if (!tag) return;
    if (tags.indexOf(tag) === -1) tags.push(tag);
  }

  function buildCustomerTags(data) {
    var tags = ["newsletter", "prospect", "hair_quiz_submission"];
    var dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    addUniqueTag(tags, "hq_date_" + dateTag);

    Object.keys(data).forEach(function (key) {
      if (key === "email" || data[key] === undefined || data[key] === null || data[key] === "") return;

      var keyPart = slugifyTagPart(key);
      var val = data[key];

      if (Array.isArray(val)) {
        val.forEach(function (entry) {
          var part = slugifyTagPart(entry);
          if (part) addUniqueTag(tags, "hq_" + keyPart + "_" + part);
        });
        return;
      }

      if (typeof val === "object") {
        Object.keys(val).forEach(function (subKey) {
          var subKeyPart = slugifyTagPart(subKey);
          var subValPart = slugifyTagPart(val[subKey]);
          if (subKeyPart && subValPart) {
            addUniqueTag(tags, "hq_" + keyPart + "_" + subKeyPart + "_" + subValPart);
          }
        });
        return;
      }

      var valuePart = slugifyTagPart(val);
      if (valuePart) addUniqueTag(tags, "hq_" + keyPart + "_" + valuePart);
    });

    return tags.slice(0, 200);
  }

  function setFormFieldValue(fieldId, value) {
    var field = document.getElementById(fieldId);
    if (!field) return;
    field.value = value;
  }

  function submitShopifyForm(form) {
    if (!form) return Promise.reject(new Error("Missing form element"));
    var action = (form.getAttribute("action") || window.location.pathname).split("#")[0];
    var method = (form.getAttribute("method") || "POST").toUpperCase();

    return fetch(action, {
      method: method,
      body: new FormData(form),
      credentials: "same-origin",
      redirect: "follow",
      headers: {
        Accept: "text/html"
      }
    }).then(function (response) {
      if (!response.ok) throw new Error("Shopify form submit failed with status " + response.status);
      return response;
    });
  }

  function saveSubmissionLocally(data) {
    try {
      var stored = JSON.parse(localStorage.getItem("quiz_submissions") || "[]");
      stored.push({ timestamp: new Date().toISOString(), data: data });
      localStorage.setItem("quiz_submissions", JSON.stringify(stored));
    } catch (err) { /* silent */ }
  }

  /* ── Submit to backend ── */
  function submitQuizData(data) {
    /*
     * Two submissions:
     * 1. Create/update Shopify customer with tags from quiz answers
     *    (visible in Admin -> Customers).
     * 2. Send full answer payload via contact form email.
     */

    if (!data.email) return;

    var customerTags = buildCustomerTags(data);
    var customerTagsValue = customerTags.join(", ");
    var customerForm = document.getElementById("quizCustomerForm");
    var contactForm = document.getElementById("quizContactForm");
    var customerSubmitPromise = Promise.resolve();

    /* 1. Create/update customer in Shopify through native customer form */
    if (customerForm) {
      setFormFieldValue("quizCustomerEmailInput", data.email);
      setFormFieldValue("quizCustomerTagsInput", customerTagsValue);

      customerSubmitPromise = submitShopifyForm(customerForm).catch(function () {
        return null;
      });
    }

    /* 2. Send full answers through native Shopify contact form */
    if (!contactForm) {
      saveSubmissionLocally(data);
      return;
    }

    setFormFieldValue("quizContactEmailInput", data.email);
    setFormFieldValue("quizContactTagsInput", customerTagsValue);
    setFormFieldValue("quizContactSubjectInput", "Hair Quiz Submission - " + data.email);
    setFormFieldValue("quizContactBodyInput", formatAnswers(data));

    customerSubmitPromise.then(function () {
      return submitShopifyForm(contactForm);
    }).catch(function () {
      saveSubmissionLocally(data);
    });
  }

  /* ── Initial state ── */
  updateProgress();
})();
