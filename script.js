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

function replaceRecordByDate(records, record) {
  return records.map((item) => (item.date === record.date ? record : item));
}

function normalizeRecordsByDate(records) {
  const recordMap = new Map();

  records.forEach((record) => {
    recordMap.set(record.date, record);
  });

  return Array.from(recordMap.values());
}

function updateRecord(records, record) {
  const nextRecords = replaceRecordByDate(records, record);
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

function setFormMessage(messageElement, message, type) {
  messageElement.textContent = message;
  messageElement.className = `form-message ${type}`;
}

function hasRecordForDate(records, date) {
  return records.some((record) => record.date === date);
}

function validateFormInput(date, weightText) {
  if (!date) {
    return "日付を入力してください。";
  }

  if (!weightText) {
    return "体重を入力してください。";
  }

  const weight = Number(weightText);

  if (!Number.isFinite(weight)) {
    return "体重は数値で入力してください。";
  }

  if (weight <= 0) {
    return "体重は 0 より大きい値を入力してください。";
  }

  return "";
}

function updateSaveButtonState(form, saveButton) {
  const formData = new FormData(form);
  const date = String(formData.get("record-date") || "").trim();
  const weightText = String(formData.get("weight-value") || "").trim();
  const hasError = validateFormInput(date, weightText) !== "";
  saveButton.disabled = hasError;
}

function initializeApp() {
  const dateInput = document.getElementById("record-date");
  const weightInput = document.getElementById("weight-value");
  const form = document.getElementById("weight-form");
  const saveButton = document.getElementById("save-button");
  const formMessage = document.getElementById("form-message");
  const reportButton = document.getElementById("build-report-button");
  const reportOutput = document.getElementById("report-output");
  const recordsList = document.getElementById("records-list");

  if (
    !dateInput ||
    !weightInput ||
    !form ||
    !saveButton ||
    !formMessage ||
    !reportButton ||
    !reportOutput ||
    !recordsList
  ) {
    return;
  }

  dateInput.value = getTodayDate();

  let records = normalizeRecordsByDate(loadRecords());
  saveRecords(records);
  renderRecords(records);
  updateReportOutput(reportOutput, records);
  updateSaveButtonState(form, saveButton);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const date = String(formData.get("record-date") || "").trim();
    const weightText = String(formData.get("weight-value") || "").trim();

    const validationMessage = validateFormInput(date, weightText);

    if (validationMessage) {
      setFormMessage(formMessage, validationMessage, "error");
      updateSaveButtonState(form, saveButton);
      return;
    }

    const weight = Number(weightText);
    const record = { date, weight };
    const hasDuplicate = hasRecordForDate(records, date);

    if (hasDuplicate) {
      const confirmOverwrite = window.confirm(
        `${date} の記録はすでにあります。新しい体重 ${weight} kg で上書きしますか？`
      );

      if (!confirmOverwrite) {
        setFormMessage(formMessage, "保存を中止しました。既存の記録は変更していません。", "info");
        updateSaveButtonState(form, saveButton);
        return;
      }

      records = updateRecord(records, record);
      setFormMessage(formMessage, `${date} の記録を上書きして保存しました。`, "success");
    } else {
      records = saveRecord(records, record);
      setFormMessage(formMessage, `${date} の体重 ${weight} kg を保存しました。`, "success");
    }

    renderRecords(records);
    updateReportOutput(reportOutput, records);

    form.reset();
    dateInput.value = getTodayDate();
    weightInput.focus();
    updateSaveButtonState(form, saveButton);
  });

  form.addEventListener("input", () => {
    updateSaveButtonState(form, saveButton);
  });

  reportButton.addEventListener("click", () => {
    updateReportOutput(reportOutput, records);
    setFormMessage(formMessage, "保存済みデータから報告文を更新しました。", "info");
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
    setFormMessage(formMessage, "記録を削除しました。", "info");
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);
