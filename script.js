"use strict";

const STORAGE_KEY = "weightLoggerRecords";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadRecords() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.date === "string" &&
        typeof item.weight === "number" &&
        Number.isFinite(item.weight)
    );
  } catch {
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function saveRecord(records, record) {
  const nextRecords = [...records, record];
  saveRecords(nextRecords);
  return nextRecords;
}

function renderRecords(records) {
  const recordsList = document.getElementById("records-list");

  if (!recordsList) {
    return;
  }

  if (!records.length) {
    recordsList.innerHTML = "<li>まだ記録はありません。</li>";
    return;
  }

  recordsList.innerHTML = records
    .map((record) => `<li>${record.date}: ${record.weight} kg</li>`)
    .join("");
}

function buildChatGPTReport(records) {
  if (!records.length) {
    return "記録がまだないため、報告文を作成できません。";
  }

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
  const latestRecord = sorted[sorted.length - 1];
  const firstRecord = sorted[0];

  return [
    "体重ログの報告です。",
    `記録件数: ${records.length} 件`,
    `最新: ${latestRecord.date} / ${latestRecord.weight} kg`,
    `開始: ${firstRecord.date} / ${firstRecord.weight} kg`,
    "この内容をもとに、次の1週間の改善提案をお願いします。",
  ].join("\n");
}

function updateReportOutput(reportOutput, records) {
  reportOutput.value = buildChatGPTReport(records);
}

function initializeApp() {
  const dateInput = document.getElementById("record-date");
  const form = document.getElementById("weight-form");
  const reportButton = document.getElementById("build-report-button");
  const reportOutput = document.getElementById("report-output");

  if (!dateInput || !form || !reportButton || !reportOutput) {
    return;
  }

  dateInput.value = getTodayDate();

  let records = loadRecords();
  renderRecords(records);
  updateReportOutput(reportOutput, records);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const date = String(formData.get("record-date") || "").trim();
    const weightText = String(formData.get("weight-value") || "").trim();

    if (!date || !weightText) {
      return;
    }

    const weight = Number(weightText);

    if (!Number.isFinite(weight) || weight <= 0) {
      return;
    }

    const record = { date, weight };
    records = saveRecord(records, record);

    renderRecords(records);
    updateReportOutput(reportOutput, records);

    form.reset();
    dateInput.value = getTodayDate();
  });

  reportButton.addEventListener("click", () => {
    updateReportOutput(reportOutput, records);
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);
