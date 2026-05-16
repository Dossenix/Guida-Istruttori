const fs = require("fs");
const path = require("path");

const allowedSections = new Set([
  "introduzione",
  "prenotazione",
  "recluta-agente",
  "agente-agente-ii",
  "risultati",
  "firme",
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function getField(body, name) {
  const match = body.match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function getBodyContent(body) {
  const match = body.match(/^BODY:\s*\n([\s\S]*?)\n<!-- \/guida-update -->/m);
  return match ? match[1].trim() : "";
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function uniqueId(additions, date, title) {
  const existing = new Set(additions.map((item) => item.id));
  const base = `${date}-${slugify(title) || "aggiornamento"}`;
  let candidate = base;
  let suffix = 2;

  while (existing.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

const issueBody = process.env.ISSUE_BODY || "";
if (!issueBody.includes("<!-- guida-update:v1 -->")) {
  throw new Error("Issue body is not a guide update request.");
}

const title = getField(issueBody, "TITLE");
const date = getField(issueBody, "DATE");
const author = getField(issueBody, "AUTHOR");
const sectionId = getField(issueBody, "SECTION_ID");
const body = getBodyContent(issueBody);

if (!title || !date || !author || !sectionId || !body) {
  throw new Error("Missing one or more required update fields.");
}

if (!allowedSections.has(sectionId)) {
  throw new Error(`Invalid section id: ${sectionId}`);
}

const updatesPath = path.join("data", "updates.json");
const additionsPath = path.join("data", "guide-additions.json");
const updatesData = readJson(updatesPath);
const additionsData = readJson(additionsPath);

if (!Array.isArray(updatesData.updates)) {
  throw new Error("data/updates.json must contain an updates array.");
}

if (!Array.isArray(additionsData.additions)) {
  throw new Error("data/guide-additions.json must contain an additions array.");
}

const addition = {
  id: uniqueId(additionsData.additions, date, title),
  sectionId,
  title,
  date,
  author,
  body,
};

updatesData.updates.unshift({
  title,
  date,
  author,
  body,
});

additionsData.additions.unshift(addition);

writeJson(updatesPath, updatesData);
writeJson(additionsPath, additionsData);
