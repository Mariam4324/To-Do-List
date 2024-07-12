"use strict";
const form = document.querySelector(".form"),
  taskList = document.querySelector(".list"),
  input = document.querySelector(".form__input"),
  deleteWrapper = document.querySelector(".delete"),
  formLine = document.querySelector(".form__line"),
  mainWrapper = document.querySelector(".main__wrapper");

let toDoList = JSON.parse(localStorage.getItem("toDoList")) || [];

document.addEventListener("DOMContentLoaded", () => {
  if (toDoList.length) toggleVisibility(true);
  toDoList.forEach((task) => renderTask(task));
});

form.addEventListener("submit", addTaskHandler);
deleteWrapper.addEventListener("click", deleteHandler);
taskList.addEventListener("click", crossTaskHandler);

// добавление
function addTaskHandler(ev) {
  ev.preventDefault();
  if (!input.value.trim()) return;

  const taskObj = {
    text: input.value,
    isDone: false,
    id: new Date().getTime(),
  };

  toDoList.push(taskObj);
  renderTask(taskObj);
  saveToLocalStorage();
  toggleVisibility(true);
  input.value = "";
}

function renderTask(taskObj) {
  const taskNode = document.createElement("li");
  taskNode.className = "list__item";
  taskNode.id = taskObj.id;

  taskNode.innerHTML = `
    <div class="list__wrapper">
      <input class="list__checkbox" type="checkbox" ${
        taskObj.isDone ? "checked" : ""
      }>
      <p class="list__text ${taskObj.isDone ? "crossed" : ""}">${
    taskObj.text
  }</p>
    </div>
    <button class="list__cross">❌</button>
  `;

  taskList.prepend(taskNode);
}

function deleteHandler(ev) {
  if (ev.target.classList.contains("delete__all")) deleteAll();
  if (ev.target.classList.contains("delete__done")) deleteDone();
}

//удаление всех
function deleteAll() {
  toDoList = [];
  taskList.innerHTML = "";
  saveToLocalStorage();
  toggleVisibility(false);
}

// удаление завершенных
function deleteDone() {
  toDoList = toDoList.filter((task) => !task.isDone);

  document.querySelectorAll(".list__item").forEach((taskNode) => {
    if (taskNode.querySelector(".list__checkbox").checked) taskNode.remove();
  });

  saveToLocalStorage();
  if (!toDoList.length) toggleVisibility(false);
}

// зачеркивание
function crossTaskHandler(ev) {
  if (ev.target.matches(`input[type="checkbox"]`)) {
    const taskNode = ev.target.closest(".list__item");
    const task = toDoList.find((task) => task.id == taskNode.id);

    task.isDone = !task.isDone;

    taskNode.querySelector(".list__text").classList.toggle("crossed");

    saveToLocalStorage();
  }

  if (ev.target.classList.contains("list__cross")) {
    const id = ev.target.closest(".list__item").id;
    toDoList = toDoList.filter((task) => task.id != id);
    ev.target.closest(".list__item").remove();
    saveToLocalStorage();

    if (!toDoList.length) toggleVisibility(false);
  }
}

// сохранение
function saveToLocalStorage() {
  localStorage.setItem("toDoList", JSON.stringify(toDoList));
}

// скрытие нижних панелей
function toggleVisibility(isVisible) {
  mainWrapper.classList.toggle("active-wrapper", isVisible);
  formLine.style.display = isVisible ? "block" : "none";
  deleteWrapper.style.display = isVisible ? "flex" : "none";
  taskList.style.display = isVisible ? "flex" : "none";
}
