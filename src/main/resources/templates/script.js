"use strict";

const storage = localStorage;

const table = document.querySelector("table");
const todo = document.getElementById("todo"); // TODO
const priority = document.querySelector("select"); // 優先度
const deadline = document.querySelector('input[type="date"]'); // 締切
const submit = document.getElementById("submit"); // 登録ボタン

let list = []; // TODOリストのデータ.定数配列から変数配列へ

document.addEventListener("DOMContentLoaded", () => {
  //DOMContentLoaded…HTMLの読み込みが読み込みを終えるや否や
  // 1. ストレージデータ（JSON）の読み込み
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }
  // 2. JSONをオブジェクトの配列に変換して配列listに代入
  list = JSON.parse(json);
  // 3. 配列listのデータを元にテーブルに要素を追加
  for (const item of list) {
    addItem(item);
  }
});

//addItem関数を作っていく
const addItem = (item) => {
  const tr = document.createElement("tr");
  //itemの中から1つずつpropを取り出していく
  for (const prop in item) {
    const td = document.createElement("td");
    if (prop == "done") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener("change", checkBoxListener); // 追加
    } else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }
  table.append(tr);
};

//登録ボタンを作る
submit.addEventListener("click", () => {
  const item = {};

  if (todo.value != "") {
    item.todo = todo.value;
  } else {
    item.todo = "ちんこ";
  }
  item.priority = priority.value;
  if (deadline.value) {
    item.deadline = deadline.value;
  } else {
    const date = new Date(); // 本日の日付情報を取得
    item.deadline = date.toLocaleDateString(); // 日付の体裁を変更
  }
  item.done = false; // 完了はひとまずBoolean値で設定

  // 「submit継続中」
  todo.value = "";
  priority.value = "普";
  deadline.value = "";

  addItem(item);

  list.push(item);
  storage.todoList = JSON.stringify(list);
});

const filterButton = document.createElement("button"); // ボタン要素を生成
filterButton.textContent = "優先度（高）で絞り込み";
filterButton.id = "priority"; // CSSでの装飾用
const main = document.querySelector("main");
main.appendChild(filterButton);

const remove = document.createElement("button");
remove.textContent = "完了したTODOを削除する";
remove.id = "remove"; // CSS装飾用
const br = document.createElement("br"); // 改行したい
main.appendChild(br);
main.appendChild(remove);

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName("tr"));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

filterButton.addEventListener("click", () => {
  clearTable();

  for (const item of list) {
    if (item.priority == "高") {
      addItem(item);
    }
  }
});

remove.addEventListener("click", () => {
  clearTable();
  // 1. 未完了のTODOを抽出して定数listを置き換え
  list = list.filter((item) => item.done == false);

  // 2. TODOデータをテーブルに追加
  for (const item of list) {
    addItem(item);
  }
  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
});

const checkBoxListener = (ev) => {
  // 1-1. テーブルの全tr要素のリストを取得（＆配列に変換）
  const trList = Array.from(document.getElementsByTagName("tr"));

  // 1-2. チェックボックスの親（td）の親（tr）を取得
  const currentTr = ev.currentTarget.parentElement.parentElement;

  // 1-3. 配列.indexOfメソッドで何番目（インデックス）かを取得
  const idx = trList.indexOf(currentTr) - 1;

  // 2. 配列listにそのインデックスでアクセスしてdoneを更新
  list[idx].done = ev.currentTarget.checked;

  // 3. ストレージデータを更新
  storage.todoList = JSON.stringify(list);
};
