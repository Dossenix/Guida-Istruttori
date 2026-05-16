const form = document.querySelector("#update-form");
const preview = document.querySelector("#json-preview");
const copyButton = document.querySelector("#copy-json");
const githubEditLink = document.querySelector("#github-edit-link");
const repoIssueUrl = "https://github.com/Dossenix/Guida-Istruttori/issues/new";

function todayForInput() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
}

function buildIssueBody(data) {
  return [
    "<!-- guida-update:v1 -->",
    `SECTION_ID: ${data.get("section")}`,
    `TITLE: ${data.get("title").trim()}`,
    `AUTHOR: ${data.get("author").trim()}`,
    `DATE: ${data.get("date")}`,
    "BODY:",
    data.get("body").trim(),
    "<!-- /guida-update -->",
  ].join("\n");
}

function buildIssueUrl(data, issueBody) {
  const title = `[Aggiornamento guida] ${data.get("title").trim()}`;
  const params = new URLSearchParams({
    title,
    body: issueBody,
  });
  const url = `${repoIssueUrl}?${params.toString()}`;

  return url.length < 7500 ? url : repoIssueUrl;
}

document.querySelector('input[name="date"]').value = todayForInput();
githubEditLink.href = repoIssueUrl;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const issueBody = buildIssueBody(data);

  preview.textContent = issueBody;
  githubEditLink.href = buildIssueUrl(data, issueBody);
});

copyButton.addEventListener("click", async () => {
  const text = preview.textContent;
  if (!text || text.startsWith("Compila")) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copiata";
    window.setTimeout(() => {
      copyButton.textContent = "Copia richiesta";
    }, 1600);
  } catch (error) {
    preview.focus();
  }
});
