"use strict";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadRecords() {
  // TODO(Task 004): localStorage から記録を読み込む
  return [];
}

function saveRecord(record) {
  // TODO(Task 004): localStorage への保存ロジックを実装する
  console.log("saveRecord placeholder:", record);
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
  // TODO(Task 004): 実データから報告文を組み立てる
  if (!records.length) {
    return "記録がまだないため、報告文を作成できません。";
  }

  return `現在の記録件数は ${records.length} 件です。`;
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const record = {
      date: String(formData.get("record-date") || ""),
      weight: Number(formData.get("weight-value")),
    };

    saveRecord(record);

    // Task 003 は仮実装: 画面上ではメモリ配列に追加して表示確認だけ行う
    records = [...records, record];
    renderRecords(records);
  });

  reportButton.addEventListener("click", () => {
    reportOutput.value = buildChatGPTReport(records);
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);
