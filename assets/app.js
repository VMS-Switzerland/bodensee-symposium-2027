/* Bodensee Symposium 2027 – renders the page from the files in /content.
   All texts are edited in Pages CMS; this file only needs changing for layout work. */
(function () {
  "use strict";

  var FILES = ["general", "programme", "registration", "venue", "partners", "contact", "legal"];

  var $ = function (sel) { return document.querySelector(sel); };
  var arr = function (v) { return Array.isArray(v) ? v : []; };
  var str = function (v) { return v == null ? "" : String(v); };
  var esc = function (v) {
    return str(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var lines = function (v) { return esc(v).replace(/\n/g, "<br>"); };

  // Accept web links, mail/phone links, page anchors and uploaded files ("/uploads/..." or "uploads/...").
  function href(u) {
    u = str(u).trim();
    if (!u) return "";
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return "";
    if (/^www\./i.test(u)) return "https://" + u;
    if (u.charAt(0) === "#") return u;
    return u.replace(/^\/+/, "");
  }
  var isExternal = function (u) { return /^https?:/i.test(u); };
  function linkAttrs(u) {
    return 'href="' + esc(u) + '"' + (isExternal(u) ? ' target="_blank" rel="noopener"' : "");
  }
  function btn(url, label, cls) {
    var u = href(url);
    if (!u || !label) return "";
    return '<a class="btn' + (cls ? " " + cls : "") + '" ' + linkAttrs(u) + ">" + esc(label) +
      (isExternal(u) ? ' <span class="arr" aria-hidden="true">↗</span>' : "") + "</a>";
  }
  function textLink(url, label) {
    var u = href(url);
    if (!u) return esc(label);
    return "<a " + linkAttrs(u) + ">" + esc(label) + (isExternal(u) ? ' <span aria-hidden="true">↗</span>' : "") + "</a>";
  }
  function fileType(u) {
    var m = str(u).split("?")[0].match(/\.([a-z0-9]{2,5})$/i);
    if (m) return m[1].toUpperCase();
    return isExternal(u) ? "Link" : "";
  }
  // Rich text comes from the editors in Pages CMS (trusted). Scripts are stripped as a safety net.
  function rich(html) {
    return str(html).replace(/<script[\s\S]*?<\/script>/gi, "").replace(/\son\w+="[^"]*"/gi, "");
  }

  var STATUS = {
    call: { upcoming: "Opens soon", open: "Open", closed: "Closed" },
    stream: { upcoming: "Link follows", live: "Live now", ended: "Ended" },
    reg: { upcoming: "Opens soon", open: "Open", closed: "Closed" }
  };
  function chip(kind, status) {
    var s = STATUS[kind][status] ? status : "upcoming";
    return '<span class="chip is-' + s + '">' + esc(STATUS[kind][s]) + "</span>";
  }

  /* ---------- Sections ---------- */

  function renderGeneral(g, reg) {
    if (g.notice && g.notice.show && g.notice.text) {
      $("#notice-label").textContent = g.notice.label || "Note";
      $("#notice-text").textContent = g.notice.text;
      $("#notice").hidden = false;
    } else {
      $("#notice").hidden = true;
    }
    if (g.edition) $("#edition").textContent = g.edition;
    if (g.organisers) $("#orgline").textContent = g.organisers;
    if (g.theme) $("#theme-line").textContent = g.theme;
    if (g.date) $("#f-date").textContent = g.date;
    if (g.place) $("#f-place").textContent = g.place;
    var emya = href(g.emyaUrl);
    $("#f-emya").innerHTML = emya ? textLink(emya, g.emyaLabel || "EMYA2027") : esc(g.emyaLabel);
    $("#foot-line").textContent = [g.date, g.place].filter(Boolean).join(" · ");

    var regState = { upcoming: "Opens soon", open: "Open now", closed: "Closed" }[reg.status] || "Opens soon";
    $("#f-reg").textContent = regState + (reg.status === "closed" ? "" : " via EMYA2027");

    var regUrl = href(reg.url);
    ["#bar-register", "#hero-register"].forEach(function (id) {
      var a = $(id);
      if (regUrl) a.setAttribute("href", regUrl);
    });

    var week = arr(g.week).map(function (w) {
      var title = w.url ? textLink(w.url, w.title) : esc(w.title);
      return '<li class="' + (w.highlight ? "here" : "") + '"><div class="when">' + esc(w.when) +
        '</div><div class="what"><strong>' + title + "</strong>" +
        (w.text ? '<span class="muted">' + esc(w.text) + "</span>" : "") + "</div></li>";
    }).join("");

    $("#about-body").innerHTML =
      '<div class="block">' +
        (g.aboutTitle ? '<h3 class="sub">' + esc(g.aboutTitle) + "</h3>" : "") +
        (g.aboutLead ? '<p class="lead">' + esc(g.aboutLead) + "</p>" : "") +
        (g.aboutText ? '<div class="prose">' + rich(g.aboutText) + "</div>" : "") +
      "</div>" +
      (week ? '<div class="block"><p class="kicker">' + esc(g.weekTitle || "The week") + '</p><ol class="week">' + week + "</ol></div>" : "");
  }

  function renderProgramme(p) {
    var items = arr(p.items).map(function (it) {
      var meta = [];
      if (it.speakers) meta.push(esc(it.speakers));
      if (it.language) meta.push("Language: " + esc(it.language));
      if (it.streamed) meta.push("Livestream");
      return "<li><div class=\"time\">" + esc(it.time) + '</div><div class="body">' +
        (it.format ? '<span class="tag">' + esc(it.format) + "</span>" : "") +
        '<span class="title">' + esc(it.title) + "</span>" +
        (it.text ? "<span>" + esc(it.text) + "</span>" : "") +
        (meta.length ? '<span class="meta">' + meta.map(function (m) { return "<span>" + m + "</span>"; }).join("") + "</span>" : "") +
        "</div></li>";
    }).join("");

    var c = p.call || {};
    var callBtn = c.status === "open" ? btn(c.url || c.file, c.buttonLabel || "Submit a proposal") : "";
    var callFile = c.file && c.url ? textLink(c.file, "Read the full call (" + fileType(href(c.file)) + ")") : "";
    var callPanel =
      '<article class="panel">' + chip("call", c.status) +
        '<h3 class="sub">' + esc(c.title || "Call for contributions") + "</h3>" +
        (c.text ? "<p>" + esc(c.text) + "</p>" : "") +
        (c.deadline ? "<dl><dt>Deadline</dt><dd>" + esc(c.deadline) + "</dd></dl>" : "") +
        ((callBtn || callFile) ? '<div class="actions">' + callBtn + callFile + "</div>" : "") +
      "</article>";

    var s = p.livestream || {};
    var streamBtn = (s.status === "live" || s.status === "ended") ? btn(s.url, s.buttonLabel || "Watch the livestream") : "";
    var streamPanel =
      '<article class="panel">' + chip("stream", s.status) +
        '<h3 class="sub">' + esc(s.title || "Livestream") + "</h3>" +
        (s.text ? "<p>" + esc(s.text) + "</p>" : "") +
        (streamBtn ? '<div class="actions">' + streamBtn + "</div>" : "") +
      "</article>";

    var docs = arr(p.documents).map(function (d) {
      var u = href(d.file || d.url);
      if (!u) return "";
      return "<li><a " + linkAttrs(u) + '><span class="doc-title">' + esc(d.title || u) + "</span>" +
        '<span class="doc-type">' + esc(fileType(u)) + "</span>" +
        (d.description ? '<span class="doc-desc">' + esc(d.description) + "</span>" : "") + "</a></li>";
    }).join("");

    $("#programme-body").innerHTML =
      '<div class="block">' +
        '<p class="kicker">Theme</p>' +
        '<h3 class="sub theme-title">' + esc(p.themeTitle || "") + "</h3>" +
        (p.themeText ? '<div class="prose">' + rich(p.themeText) + "</div>" : "") +
      "</div>" +
      ((items || p.emptyText) ? '<div class="block"><h3 class="sub">' + esc(p.scheduleTitle || "Schedule") + "</h3>" +
        (items ? '<ol class="items">' + items + "</ol>" : '<p class="empty">' + esc(p.emptyText) + "</p>") +
      "</div>" : "") +
      '<div class="panels">' + callPanel + streamPanel + "</div>" +
      '<div class="block" id="documents"><h3 class="sub">' + esc(p.documentsTitle || "Documents") + "</h3>" +
        (docs ? '<ul class="docs">' + docs + "</ul>" : '<p class="empty">' + esc(p.documentsText || "Documents will be available here.") + "</p>") +
        (docs && p.documentsText ? '<p class="muted small">' + esc(p.documentsText) + "</p>" : "") +
      "</div>";
  }

  function renderRegistration(r) {
    var fees = arr(r.fees).map(function (f) {
      return "<tr><td>" + esc(f.category) + (f.detail ? "<small>" + esc(f.detail) + "</small>" : "") +
        '</td><td class="price">' + esc(f.price) + "</td></tr>";
    }).join("");
    var regBtn = btn(r.url, r.buttonLabel || "Register", r.status === "open" ? "" : "ghost");
    $("#registration-body").innerHTML =
      '<div class="block">' + chip("reg", r.status) +
        '<h3 class="sub">' + esc(r.title || "Registration") + "</h3>" +
        (r.text ? '<p class="lead">' + esc(r.text) + "</p>" : "") +
        (regBtn ? '<div class="actions">' + regBtn + "</div>" : "") +
      "</div>" +
      (fees ? '<div class="block"><h3 class="sub">' + esc(r.feesTitle || "Fees") + "</h3>" +
        '<div class="table-scroll"><table class="fees"><thead><tr><th scope="col">Category</th><th scope="col" class="price">Fee</th></tr></thead><tbody>' +
        fees + "</tbody></table></div>" +
        (r.note ? '<p class="muted small">' + esc(r.note) + "</p>" : "") + "</div>" : "");
  }

  function renderVenue(v) {
    var travel = arr(v.travel).map(function (t) {
      return "<div><dt>" + esc(t.from) + "</dt><dd>" + esc(t.time) + "</dd></div>";
    }).join("");
    var hotels = arr(v.hotels).map(function (h) {
      var meta = [h.area, h.note].filter(Boolean).map(esc).join(" · ");
      return '<li><span class="h-name">' + (h.url ? textLink(h.url, h.name) : esc(h.name)) + "</span>" +
        (meta ? '<span class="h-meta">' + meta + "</span>" : "") + "</li>";
    }).join("");
    $("#venue-body").innerHTML =
      '<div class="cols3">' +
        '<div class="block"><p class="kicker">' + esc(v.venueTitle || "Venue") + "</p>" +
          '<p class="venue-name">' + esc(v.venueName) + "</p>" +
          (v.venueAddress ? '<address class="address">' + lines(v.venueAddress) + "</address>" : "") +
          (v.venueText ? '<p class="muted">' + esc(v.venueText) + "</p>" : "") +
          (v.mapUrl ? "<p>" + textLink(v.mapUrl, "Open in map") + "</p>" : "") +
        "</div>" +
        '<div class="block"><p class="kicker">' + esc(v.travelTitle || "Getting there") + "</p>" +
          (v.travelText ? "<p>" + esc(v.travelText) + "</p>" : "") +
          (travel ? '<dl class="rows" aria-label="Train journey times to Bern">' + travel + "</dl>" : "") +
          (v.travelLinkUrl ? '<p class="small">' + textLink(v.travelLinkUrl, v.travelLinkLabel || "Timetable") + "</p>" : "") +
        "</div>" +
        '<div class="block"><p class="kicker">' + esc(v.hotelsTitle || "Hotels") + "</p>" +
          (v.hotelsText ? "<p>" + esc(v.hotelsText) + "</p>" : "") +
          (hotels ? '<ul class="hotels">' + hotels + "</ul>" : (v.hotelsEmpty ? '<p class="empty">' + esc(v.hotelsEmpty) + "</p>" : "")) +
          (v.bookingUrl ? '<p class="small">' + textLink(v.bookingUrl, v.bookingLabel || "Book accommodation") + "</p>" : "") +
          (v.bernTicket ? '<p class="callout">' + esc(v.bernTicket) + (v.bernTicketUrl ? " " + textLink(v.bernTicketUrl, "More about the Bern-Ticket") : "") + "</p>" : "") +
        "</div>" +
      "</div>";
  }

  var CATEGORY = { host: "Host", partner: "Partner", sponsor: "Sponsor", media: "Media partner", supporter: "Supported by" };

  function renderPartners(p) {
    var logos = arr(p.partners).map(function (x) {
      var u = href(x.url);
      var img = href(x.logo);
      var inner = (x.category ? '<span class="cat">' + esc(CATEGORY[x.category] || x.category) + "</span>" : "") +
        (img ? '<img src="' + esc(img) + '" alt="' + esc(x.name) + '" loading="lazy">' : '<span class="nm">' + esc(x.name) + "</span>");
      return u ? '<a class="logo" ' + linkAttrs(u) + ">" + inner + "</a>" : '<div class="logo">' + inner + "</div>";
    }).join("");
    $("#partners-body").innerHTML =
      '<div class="block"><h3 class="sub">' + esc(p.title || "Partners") + "</h3>" +
        (p.text ? '<p class="lead">' + esc(p.text) + "</p>" : "") + "</div>" +
      (logos ? '<div class="logos">' + logos + "</div>" : (p.emptyText ? '<p class="empty">' + esc(p.emptyText) + "</p>" : "")) +
      '<div class="become"><h3 class="sub">' + esc(p.becomeTitle || "Become a partner") + "</h3>" +
        (p.becomeText ? "<p>" + esc(p.becomeText) + "</p>" : "") +
        '<div class="actions"><a class="btn" href="#contact" data-subject="Partnership and sponsoring">' + esc(p.becomeButton || "Get in touch") + "</a></div>" +
      "</div>";
  }

  var formEndpoint = "";
  var contactEmail = "info@museums.ch";

  function renderContact(c) {
    formEndpoint = str(c.formEndpoint).trim();
    contactEmail = c.email || contactEmail;
    var orgs = arr(c.organisers).map(function (o) {
      return "<li><span>" + (o.url ? textLink(o.url, o.name) : esc(o.name)) + '</span><span class="role">' + esc(o.role) + "</span></li>";
    }).join("");
    var subjects = arr(c.subjects).map(function (s) { return "<option>" + esc(s) + "</option>"; }).join("");
    var mail = esc(contactEmail);

    $("#contact-body").innerHTML =
      '<div class="contact-grid">' +
        '<div class="block">' +
          '<h3 class="sub">' + esc(c.title || "Organisers") + "</h3>" +
          (c.text ? "<p>" + esc(c.text) + "</p>" : "") +
          (orgs ? '<ul class="orgs">' + orgs + "</ul>" : "") +
          '<div class="reach">' +
            '<p class="kicker">Secretariat</p>' +
            '<address class="address"><strong>' + esc(c.addressName) + "</strong><br>" + lines(c.address) + "</address>" +
            (c.phone ? "<p>" + esc(c.phone) + "</p>" : "") +
            '<p class="mailrow"><a id="mail-addr" href="mailto:' + mail + '">' + mail + '</a><button class="copy" type="button" id="copy-mail">Copy</button></p>' +
          "</div>" +
        "</div>" +
        '<div class="block">' +
          '<h3 class="sub">' + esc(c.formTitle || "Send us a message") + "</h3>" +
          (c.formText ? '<p class="muted">' + esc(c.formText) + "</p>" : "") +
          '<form class="contact" id="contact-form" novalidate>' +
            '<div class="two">' +
              '<div class="field"><label for="cf-name">Name</label><input id="cf-name" name="name" type="text" autocomplete="name" required></div>' +
              '<div class="field"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>' +
            "</div>" +
            '<div class="two">' +
              '<div class="field"><label for="cf-org">Organisation <span class="muted">(optional)</span></label><input id="cf-org" name="organisation" type="text" autocomplete="organization"></div>' +
              '<div class="field"><label for="cf-subject">Subject</label><select id="cf-subject" name="subject">' + subjects + "</select></div>" +
            "</div>" +
            '<div class="field"><label for="cf-message">Message</label><textarea id="cf-message" name="message" required></textarea></div>' +
            '<div class="hp" aria-hidden="true"><label for="cf-gotcha">Leave this field empty</label><input id="cf-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>' +
            '<label class="consent" for="cf-consent"><input id="cf-consent" type="checkbox" name="consent" value="yes" required><span>I agree that my details are used to answer my enquiry, as described in the <a href="#privacy">privacy policy</a>.</span></label>' +
            '<div class="actions"><button class="btn" type="submit" id="cf-submit">Send message</button></div>' +
            '<p class="form-status" id="cf-status" role="status" hidden></p>' +
          "</form>" +
        "</div>" +
      "</div>";
  }

  function renderLegal(l) {
    $("#legal-body").innerHTML =
      '<article class="prose"><h2 id="privacy-h">' + esc(l.privacyTitle || "Privacy policy") + "</h2>" + rich(l.privacy) +
        (l.updated ? '<p class="muted small updated">Last updated: ' + esc(l.updated) + "</p>" : "") + "</article>" +
      '<article class="prose"><h2 id="legal-notice-h">' + esc(l.imprintTitle || "Legal notice") + "</h2>" + rich(l.imprint) + "</article>";
  }

  /* ---------- Behaviour ---------- */

  function setStatus(text, kind) {
    var el = $("#cf-status");
    el.textContent = text;
    el.className = "form-status" + (kind ? " " + kind : "");
    el.hidden = false;
  }

  function wireForm() {
    var form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        var bad = form.querySelector(":invalid");
        setStatus(bad && bad.id === "cf-consent"
          ? "Please confirm that we may use your details to answer your enquiry."
          : "Please fill in your name, a valid email address and your message.", "err");
        if (bad) bad.focus();
        return;
      }
      if (!formEndpoint) {
        setStatus("The contact form is not connected yet. Please write to " + contactEmail + " in the meantime.", "err");
        return;
      }
      var submit = $("#cf-submit");
      submit.disabled = true;
      setStatus("Sending…");
      fetch(formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          form.reset();
          setStatus("Thank you. Your message has been sent to " + contactEmail + ". We will get back to you soon.", "ok");
        })
        .catch(function () {
          setStatus("Your message could not be sent. Please write to " + contactEmail + " directly.", "err");
        })
        .then(function () { submit.disabled = false; });
    });

    var copyBtn = $("#copy-mail");
    copyBtn.addEventListener("click", function () {
      var done = function () { copyBtn.textContent = "Copied"; setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800); };
      var fallback = function () {
        var r = document.createRange();
        r.selectNodeContents($("#mail-addr"));
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        copyBtn.textContent = "Selected";
      };
      try {
        navigator.clipboard.writeText(contactEmail).then(done, fallback);
      } catch (err) { fallback(); }
    });
  }

  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    var legal = h === "privacy" || h === "legal-notice";
    $("#main").hidden = legal;
    $("#legal").hidden = !legal;
    if (legal) {
      var t = document.getElementById(h + "-h");
      if (h === "privacy" || !t) window.scrollTo(0, 0);
      else t.scrollIntoView();
    } else if (h) {
      var el = document.getElementById(h);
      if (el) el.scrollIntoView();
    }
  }

  function wireNav() {
    var bar = $("#bar");
    var menu = $("#menu-btn");
    menu.addEventListener("click", function () {
      var open = bar.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
      menu.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      if (bar.classList.contains("open")) {
        bar.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.textContent = "Menu";
      }
      var subject = a.getAttribute("data-subject");
      if (subject) {
        var sel = $("#cf-subject");
        if (sel) sel.value = subject;
      }
      var id = a.getAttribute("href").slice(1);
      if (location.hash.slice(1) === id) { e.preventDefault(); route(); }
    });
    window.addEventListener("hashchange", route);
  }

  function load() {
    if (window.SITE_CONTENT) return Promise.resolve(window.SITE_CONTENT);
    return Promise.all(FILES.map(function (f) {
      return fetch("content/" + f + ".json", { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error(f);
        return r.json();
      });
    })).then(function (parts) {
      var out = {};
      FILES.forEach(function (f, i) { out[f] = parts[i] || {}; });
      return out;
    });
  }

  wireNav();
  load().then(function (d) {
    renderGeneral(d.general || {}, d.registration || {});
    renderProgramme(d.programme || {});
    renderRegistration(d.registration || {});
    renderVenue(d.venue || {});
    renderPartners(d.partners || {});
    renderContact(d.contact || {});
    renderLegal(d.legal || {});
    wireForm();
    route();
  }).catch(function () {
    $("#about-body").innerHTML = '<p class="load-error">The content of this page could not be loaded. Please reload the page or contact info@museums.ch.</p>';
  });
})();
