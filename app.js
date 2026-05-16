const sections = Array.from(document.querySelectorAll(".guide-section"));
const tocLinks = Array.from(document.querySelectorAll(".toc nav a"));
const searchInput = document.querySelector("#search");
const updatesList = document.querySelector("#updates-list");
const lastUpdated = document.querySelector("#last-updated");

function normalizeText(value) {
  return value.toLocaleLowerCase("it-IT").trim();
}

function filterSections() {
  const query = normalizeText(searchInput.value);

  sections.forEach((section) => {
    const haystack = normalizeText(`${section.textContent} ${section.dataset.searchText || ""}`);
    section.hidden = query.length > 0 && !haystack.includes(query);
  });
}

function setActiveLink() {
  const visibleSections = sections.filter((section) => !section.hidden);
  let active = visibleSections[0]?.id;

  visibleSections.forEach((section) => {
    if (section.getBoundingClientRect().top < 170) {
      active = section.id;
    }
  });

  tocLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${active}`);
  });
}

function formatDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function renderUpdates(items) {
  if (!Array.isArray(items) || items.length === 0) {
    updatesList.innerHTML = "<p>Nessun aggiornamento pubblicato.</p>";
    return;
  }

  updatesList.replaceChildren();

  items.forEach((item) => {
    const article = document.createElement("article");
    const header = document.createElement("header");
    const title = document.createElement("h3");
    const date = document.createElement("time");
    const body = document.createElement("p");
    const author = document.createElement("p");
    const authorLabel = document.createElement("strong");

    article.className = "update-card";
    title.textContent = item.title;
    date.dateTime = item.date;
    date.textContent = formatDate(item.date);
    body.textContent = item.body;
    authorLabel.textContent = "Firmato:";
    author.append(authorLabel, ` ${item.author}`);

    header.append(title, date);
    article.append(header, body, author);
    updatesList.append(article);
  });

  if (items[0]?.date) {
    lastUpdated.textContent = formatDate(items[0].date);
  }
}

async function loadUpdates() {
  try {
    const response = await fetch("data/updates.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    renderUpdates(data.updates);
  } catch (error) {
    updatesList.innerHTML = "<p>Gli aggiornamenti non sono disponibili in questo momento.</p>";
  }
}

searchInput?.addEventListener("input", () => {
  filterSections();
  setActiveLink();
});

window.addEventListener("scroll", setActiveLink, { passive: true });
document.querySelector("#print-guide")?.addEventListener("click", () => window.print());

filterSections();
setActiveLink();
loadUpdates();
