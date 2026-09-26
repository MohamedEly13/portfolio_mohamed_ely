/* Ce fichier donne vie à la page. Les informations sont dans profil.js. */
"use strict";

// 1. Petits outils : on écrit les données comme du texte, jamais comme du HTML.
const $ = (selector) => document.querySelector(selector);
const list = (value) => (Array.isArray(value) ? value : []);
const profile = typeof PROFIL === "object" ? PROFIL : {};
function node(tag, text = "", className = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}
function setText(selector, value, fallback = "") {
  $(selector).textContent = String(value || fallback);
}
// On accepte les liens web http(s), et les fichiers locaux si demandé.
function safeUrl(value, allowLocal = false) {
  if (typeof value !== "string" || !value.trim()) return "";
  const raw = value.trim();
  if (/^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw).href;
    } catch {
      return "";
    }
  }
  if (allowLocal && !raw.startsWith("/") && !/[\\:]/.test(raw)) {
    return raw;
  }
  return "";
}
function externalLink(label, url) {
  const a = node("a", label + " ↗", "text-link");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

// 2. Identité, photo, CV et coordonnées.
const firstName = String(profile.prenom || "Mohamed");
const fullName = [firstName, profile.nom].filter(Boolean).join(" ");
document.querySelectorAll("[data-name]").forEach((el) => {
  el.textContent = firstName;
});
$("meta[name='description']").content = String(
  profile.accroche || "Mon portfolio personnel.",
);
setText("#profile-title", profile.titre, "Étudiant en informatique à Epitech");
setText("#profile-hook", profile.accroche);
setText("#profile-description", profile.description);
setText("#card-name", fullName);
setText("#card-city", profile.ville);
setText("#availability", profile.disponibilite);
setText("#year", new Date().getFullYear());
const initials = [firstName, profile.nom]
  .filter(Boolean)
  .map((s) => s.trim()[0] || "")
  .join("")
  .toUpperCase();
$("#initials").replaceChildren(
  document.createTextNode(initials),
  node("span", "."),
);
const photoUrl = safeUrl(profile.photo, true);
if (photoUrl) {
  const photo = node("img");
  photo.id = "portrait";
  photo.hidden = true;
  photo.alt = `Portrait de ${fullName}`;
  photo.addEventListener("load", () => {
    photo.hidden = false;
    $("#initials").hidden = true;
  });
  photo.addEventListener("error", () => {
    photo.hidden = true;
    $("#initials").hidden = false;
  });
  photo.src = photoUrl;
  $(".portrait-frame").append(photo);
}
const cvUrl = safeUrl(profile.cv, true);
if (cvUrl) {
  const cv = $("#cv-link");
  cv.href = cvUrl;
  cv.download = "CV.pdf";
  cv.hidden = false;
}
const emailAddress = String(profile.email || "").trim();
const hasEmail = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(emailAddress);
if (hasEmail) {
  $("#email-link").href = `mailto:${emailAddress}`;
  setText("#email-link", emailAddress);
  $("#email-link").hidden = false;
  $("#copy-email").hidden = false;
}
[
  ["GitHub", profile.github],
  ["LinkedIn", profile.linkedin],
].forEach(([label, value]) => {
  const url = safeUrl(value);
  if (url) $("#social-links").append(externalLink(label, url));
});
$("#copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailAddress);
    setText("#copy-status", "Adresse copiée.");
  } catch {
    setText(
      "#copy-status",
      `Copie manuellement l'adresse affichée : ${emailAddress}`,
    );
  }
});

// 3. Formations, expériences.
function renderTimeline(selector, entries, emptyText) {
  const target = $(selector);
  list(entries).forEach((item) => {
    const li = node("li");
    li.append(
      node("span", item.periode || "", "period"),
      node("h4", item.titre || ""),
      node("p", item.detail || ""),
    );
    target.append(li);
  });
  if (!target.children.length) target.append(node("li", emptyText));
}
renderTimeline(
  "#formations-list",
  profile.formations,
  "Formation à renseigner.",
);
renderTimeline(
  "#experiences-list",
  profile.experiences,
  "Mon parcours professionnel débute. Retrouvez mes réalisations dans les projets.",
);
list(profile.competences).forEach((skill, index) => {
  const article = node("article", "", "skill reveal");
  article.append(
    node("span", String(index + 1).padStart(2, "0"), "skill-number"),
    node("h3", skill.nom || ""),
    node("p", skill.description || ""),
  );
  $("#skills-grid").append(article);
});
list(profile.softSkills).forEach((skill) => {
  const item = node("div");
  item.append(node("h4", skill.nom || ""), node("p", skill.description || ""));
  $("#soft-grid").append(item);
});
if (!list(profile.softSkills).length) $(".human-skills").hidden = true;
function details(section, selector, values, titleKey, detailKey) {
  const target = $(selector);
  list(values).forEach((value) => {
    const li = node("li");
    if (typeof value === "string") li.textContent = value;
    else {
      li.append(
        node("strong", value[titleKey] || ""),
        node("span", value[detailKey] || ""),
      );

      if (value.lien) {
        const lien = node("a", "Voir le dernier projet van");
        lien.href = value.lien;
        lien.className = "lien-projet";

        li.append(lien);
      }
    }
    target.append(li);
  });
  $(section).hidden = target.children.length === 0;
}
details(
  "#languages-section",
  "#languages-list",
  profile.langues,
  "nom",
  "niveau",
);
details(
  "#interests-section", 
  "#interests-list", 
  profile.interets,
  "titre",
  "detail"
);
details(
  "#certifications-section",
  "#certifications-list",
  profile.certifications,
  "titre",
  "detail",
);
details(
  "#engagements-section",
  "#engagements-list",
  profile.engagements,
  "titre",
  "detail",
);
$("#personnalite").hidden = !Array.from($(".extras-grid").children).some(
  (el) => !el.hidden,
);

// 4. Projets : filtres et fenêtre de détails.
const projects = list(profile.projets);
const categories = [
  "Tous",
  ...new Set(projects.map((p) => p.categorie).filter(Boolean)),
];
const covers = [
  "def charger_mots()\n    mots = []",
  ".projet {\n  display: grid;\n  gap: 24px;\n}",
  "const idée = 'créer';\n\nconstruire(idée);",
];
function openProject(project) {
  setText("#dialog-title", project.titre);
  setText("#dialog-category", project.categorie);
  setText("#dialog-description", project.description);
  $("#dialog-tags").replaceChildren(
    ...list(project.tags).map((tag) => node("li", tag)),
  );
  $("#dialog-links").replaceChildren();
  [
    ["Voir le projet", project.demo],
    ["Voir le code", project.code],
  ].forEach(([label, value]) => {
    const url = safeUrl(value);
    if (url) $("#dialog-links").append(externalLink(label, url));
  });
  if (!$("#dialog-links").children.length)
    $("#dialog-links").append(
      node(
        "p",
        "Les liens de ce projet ne sont pas encore renseignés.",
        "small-note",
      ),
    );
  $("#project-dialog").showModal();
}
function renderProjects(category) {
  const grid = $("#project-grid");
  grid.replaceChildren();
  const filtered = projects.filter(
    (p) => category === "Tous" || p.categorie === category,
  );
  filtered.forEach((project) => {
    const index = projects.indexOf(project);
    const article = node("article", "", "project-card");
    const cover = node("div", "", "project-cover");
    cover.setAttribute("aria-hidden", "true");
    const top = node("div", "", "cover-top");
    top.append(
      node("span", String(index + 1).padStart(2, "0")),
    );
    cover.append(
      top,
      node("pre", covers[index % covers.length], "cover-code"),
      node("span", list(project.tags).join(" / "), "cover-label"),
    );
    const button = node("button", "Découvrir le projet ↗", "text-link");
    button.type = "button";
    button.setAttribute("aria-label", `Découvrir ${project.titre}`);
    button.addEventListener("click", () => openProject(project));
    article.append(
      cover,
      node("div", project.categorie || "Projet", "project-meta"),
      node("h3", project.titre || "Projet"),
      node("p", project.description || ""),
      button,
    );
    grid.append(article);
  });
  if (!filtered.length)
    grid.append(
      node("p", ""),
    );
  setText(
    "#filter-status",
    `${filtered.length} projet${filtered.length > 1 ? "s" : ""} affiché${filtered.length > 1 ? "s" : ""}.`,
  );
}
categories.forEach((category) => {
  const button = node("button", category, "filter");
  button.type = "button";
  button.setAttribute("aria-pressed", String(category === "Tous"));
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".filter")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    renderProjects(category);
  });
  $("#filters").append(button);
});
renderProjects("Tous");
$(".dialog-close").addEventListener("click", () =>
  $("#project-dialog").close(),
);
$("#project-dialog").addEventListener("click", (event) => {
  if (event.target !== event.currentTarget) return;
  const rect = event.currentTarget.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    event.currentTarget.close();
});

// 5. Le formulaire prépare un email. Il n’envoie rien à un serveur.
$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  if (!hasEmail) {
    setText(
      "#form-status",
      "Ajoute ton adresse email dans profil.js pour activer le contact.",
    );
    return;
  }
  const data = new FormData(form);
  const subject = String(data.get("sujet")).trim();
  const body = `De : ${data.get("nom")}\nEmail : ${data.get("email")}\n\n${data.get("message")}`;
  const url = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $("#mail-fallback").href = url;
  $("#mail-fallback").hidden = false;
  setText(
    "#form-status",
    "Brouillon préparé. Vérifie ta messagerie et confirme l'envoi. Si rien ne s'ouvre, utilise le lien ci-dessous ou copie l'adresse email.",
  );
  window.location.href = url;
});

// 6. Menu mobile, navigation clavier et animations d’apparition.
document.documentElement.classList.add("js");
const menuButton = $(".menu-toggle");
const navigation = $("#navigation");
const mobile = window.matchMedia("(max-width: 760px)");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}
function syncMenu() {
  menuButton.hidden = !mobile.matches;
  closeMenu();
}
syncMenu();
mobile.addEventListener("change", syncMenu);
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
});
navigation
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !motion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("reveal-pending");
    observer.observe(el);
  });
  motion.addEventListener("change", () => {
    if (motion.matches)
      document
        .querySelectorAll(".reveal-pending")
        .forEach((el) => el.classList.add("is-visible"));
  });
}