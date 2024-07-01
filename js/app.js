const form = document.querySelector(".form");
const taskList = document.querySelector(".list");
const input = document.querySelector(".form__input");
const deleteWrapper = document.querySelector(".delete");
let toDoList = [];

form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  if (input.value.trim() === "") {
    return;
  }

  const taskObj = {
    text: input.value,
    isDone: false,
    id: toDoList.length,
  };

  //добавление задач
  const taksNode = document.createElement("li");
  taksNode.className = "list__item";
  taksNode.id = taskObj.id;

  taksNode.innerHTML = ` 
<div class="list__wrapper">
    <input class="list__checkbox" type="checkbox">
    <p class="list__text">${input.value}</p> 
</div>
    <button class="list__cross">❌</button>
`;

  taskList.prepend(taksNode);

  input.value = "";
  toDoList.push(taskObj);
});

deleteWrapper.addEventListener("click", (ev) => {
  if (ev.target.className === "delete__all btn") {
    toDoList = [];
    taskList.innerHTML = "";
    input.value = "";
  }

  //удаление завершенных
  if (ev.target.className === "delete__done btn") {
    toDoList = toDoList.filter((el) => (el.isDone = false));
    console.log(toDoList);
  }
});

taskList.addEventListener("click", (ev) => {
  // перечеркивание задач
  const checkbox = document.querySelector(".list__checkbox");

  if (checkbox.checked) {
    ev.target.nextElementSibling.classList.add("crossed");
    const taskNode = ev.target.closest(".list__item");

    toDoList = toDoList.map((el) => {
      if (taskNode.id == el.id) {
        return {
          ...el,
          isDone: true,
        };
      }
      return el;
    });
  } else {
    ev.target.nextElementSibling.classList.remove("crossed");

    const taskNode = ev.target.closest(".list__item");

    toDoList = toDoList.map((el) => {
      if (taskNode.id == el.id) {
        return {
          ...el,
          isDone: false,
        };
      }
      return el;
    });
  }

  // if (ev.target.className === "list__checkbox") {
  //   ev.target.nextElementSibling.classList.toggle("crossed");
  //   const taskNode = ev.target.closest(".list__item");
  // }

  // удаление конкретной задачи
  if (ev.target.className === "list__cross") {
    const id = ev.target.parentNode.id;
    toDoList = toDoList.filter((task) => task.id != id);
    ev.target.parentNode.remove();
  }
});

// setInterval(() => {
//   console.log(toDoList);
// }, 4000);
