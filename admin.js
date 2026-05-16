const form = document.querySelector("#update-form");
const preview = document.querySelector("#json-preview");
const copyButton = document.querySelector("#copy-json");
const githubEditLink = document.querySelector("#github-edit-link");

function todayForInput() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
}

function inferGitHubEditUrl() {
  const host = window.location.hostname;
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  if (!host.endsWith("github.io") || pathParts.length === 0) {
    return "data/updates.json";
  }

  const owner = host.replace(".github.io", "");
  const repo = pathParts[0];
  return `https://github.com/${owner}/${repo}/edit/main/data/updates.json`;
}

function buildUpdateBlock(data) {
  return JSON.stringify(
    {
      title: data.get("title").trim(),
      date: data.get("date"),
      author: data.get("author").trim(),
      body: data.get("body").trim(),
    },
    null,
    2,
  );
}

document.querySelector('input[name="date"]').value = todayForInput();
githubEditLink.href = inferGitHubEditUrl();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  preview.textContent = buildUpdateBlock(new FormData(form));
});

copyButton.addEventListener("click", async () => {
  const text = preview.textContent;
  if (!text || text.startsWith("Compila")) {
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copiato";
    window.setTimeout(() => {
      copyButton.textContent = "Copia";
    }, 1600);
  } catch (error) {
    preview.focus();
  }
});
