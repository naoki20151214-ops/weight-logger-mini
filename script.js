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

function deleteRecord(records, index) {
  const nextRecords = records.filter((_, recordIndex) => recordIndex !== index);
  saveRecords(nextRecords);
  return nextRecords;
}

function getRecordsNewestFirst(records) {
  return records
    .map((record, index) => ({ record, index }))
    .sort((a, b) => b.record.date.localeCompare(a.record.date));
}

function renderRecords(records) {
  const recordsList = document.getElementById("records-list");

  if (!recordsList) {
    return;
  }

  if (!records.length) {
    recordsList.innerHTML = '<li class="empty-message">記録はまだありません。日付と体重を入力して保存してください。</li>';
    return;
  }

  recordsList.innerHTML = getRecordsNewestFirst(records)
    .map(
      ({ record, index }) =>
        `<li class="record-item"><span>${record.date}: ${record.weight} kg</span><button type="button" class="delete-button" data-record-index="${index}" aria-label="${record.date} ${record.weight}kg の記録を削除">削除</button></li>`
    )
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
  const recordsList = document.getElementById("records-list");

  if (!dateInput || !form || !reportButton || !reportOutput || !recordsList) {
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

  recordsList.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || !target.classList.contains("delete-button")) {
      return;
    }

    const rawIndex = target.dataset.recordIndex;
    const index = Number(rawIndex);

    if (!Number.isInteger(index) || index < 0 || index >= records.length) {
      return;
    }

    records = deleteRecord(records, index);
    renderRecords(records);
    updateReportOutput(reportOutput, records);
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);
