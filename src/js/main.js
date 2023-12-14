const textarea = document.querySelector(".input-field textarea");
const inputDate = document.querySelector("#datetimePicker");
const inputName = document.querySelector("#taskName");
const ulElement = document.querySelector(".todoList");
const spanDate = document.querySelector(".date");
const spanName = document.querySelector(".task");
const spanDescription = document.querySelector(".description");
const pendingNumber = document.querySelector(".pending-num");
const clearBtn = document.querySelector(".clear-all");
const addBtn = document.querySelector(".saveBtn");
const popup = document.querySelector("#popup");
const popupDescription = document.querySelector("#popupDescription");
const popupDate = document.querySelector("#popupDate");
const editText = document.querySelector("#editText");
const editDescription = document.querySelector("#editDescription");
const editDate = document.querySelector("#editDate");
const saveText = document.querySelector("#saveText");
const saveDescriptionBtn = document.querySelector("#saveDescriptionBtn");
const saveDateBtn = document.querySelector(".popupDateBtn");
const sortList = document.querySelector(".sortList");
const sortByDateBtn = document.querySelector(".sortByDate");
const cross = document.querySelector(".cross");
const notification = document.querySelector("#notification");
const dayRest = document.querySelector(".notification__hours");

const editPopup = (list, button, editValue, popup) => {
  list.forEach((item) => {
    item.addEventListener("click", () => {
      editValue.value = item.textContent;
      popup.style.display = "block";
    });

    button.addEventListener("click", () => {
      item.textContent = editValue.value;
      popup.style.display = "none";
    });
  });
};

const allTasks = () => {
  const checkboxes = document.querySelectorAll("#checkbox");
  const spanNameList = document.querySelectorAll(".task");
  const spanDescriptionList = document.querySelectorAll(".description");
  const spanDateList = document.querySelectorAll(".date");

  editPopup(spanNameList, saveText, editText, popup);
  editPopup(
    spanDescriptionList,
    saveDescriptionBtn,
    editDescription,
    popupDescription
  );

  spanDateList.forEach((date) => {
    date.addEventListener("click", () => {
      popupDate.style.display = "block";
    });

    saveDateBtn.addEventListener("click", () => {
      const selectedDate = new Date(editDate.value).toLocaleDateString();
      const selectedTime = new Date(editDate.value).toLocaleTimeString();

      date.textContent = selectedDate;
      date.parentElement.lastElementChild.textContent = selectedTime;

      popupDate.style.display = "none";
    });
  });

  const tasksStorage = JSON.parse(localStorage.getItem("tasks"));
  const tasksCount = tasksStorage ? tasksStorage.length : 0;

  pendingNumber.textContent = tasksCount === 0 ? "no" : tasksCount;

  if (tasksCount > 0) {
    clearBtn.disabled = false;
  } else {
    clearBtn.disabled = true;
  }

  checkboxes.forEach((box) => {
    box.addEventListener("change", function () {
      const sibling = this.nextElementSibling;

      if (this.checked) {
        sibling.style.textDecoration = "line-through";
      } else {
        sibling.style.textDecoration = "none";
      }
    });
  });
};

allTasks();

addBtn.addEventListener("click", () => {
  const inputNameValue = inputName.value.trim();
  const inputDateValue = inputDate.value;
  const inputDescriptionValue = textarea.value;

  const inputNameError =
    !inputNameValue.length > 0
      ? (inputName.style.borderColor = "red")
      : (inputName.style.borderColor = "#ccc");

  const inputDateError =
    !inputDateValue.length > 0
      ? (inputDate.style.borderColor = "red")
      : (inputDate.style.borderColor = "#ccc");

  const selectedTime = new Date(inputDateValue).toLocaleTimeString();
  const selectedDate = new Date(inputDateValue).toLocaleDateString();

  const taskObject = {
    title: inputNameValue,
    description: inputDescriptionValue,
    date: selectedDate,
    time: selectedTime,
  };

  if (inputDateValue.length > 0 && inputNameValue.length > 0) {
    let liTag = `
        <li class="list pending">
        <input type="checkbox" id="checkbox"/>
        <div class="span-wrap">
          <span class="task">${taskObject.title}</span>
          <span>To: 
          <span class="date">${taskObject.date}</span>
          <span>${taskObject.time}</span>
          </span>
          <span class="description">${taskObject.description}</span>
        </div>
        <i class="uil uil-trash" onclick="deleteTask(this)"></i>
        </li>
      `;

    ulElement.insertAdjacentHTML("beforeend", liTag);
    textarea.value = "";
    inputName.value = "";
    inputDate.value = "";

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskObject);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    if (daysDiff(selectedDate) > 0 && daysDiff(selectedDate) < 4) {
      notification.style.display = "block";
      dayRest.textContent = daysDiff(selectedDate);

      setTimeout(() => {
        notification.style.display = "none";
      }, 5000);
    }

    allTasks();
  } else {
    inputNameError;
    inputDateError;
  }
});

window.addEventListener("load", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Добавляем сохраненные карточки на страницу
  savedTasks.forEach((task) => {
    let taskHTML = `
    <li class="list pending">
    <input type="checkbox" id="checkbox"/>
    <div class="span-wrap">
      <span class="task">${task.title}</span>
      <span>To: 
      <span class="date">${task.date}</span>
      <span>${task.time}</span>
      </span>
      <span class="description">${task.description}</span>
    </div>
    <i class="uil uil-trash" onclick="deleteTask(this)"></i>
    </li>
  `;

    ulElement.insertAdjacentHTML("beforeend", taskHTML);
    allTasks();
  });
});

const daysDiff = (date) => {
  const parts = date.split(".");
  // Формирование нового формата "гггг-мм-дд"
  const newFormat = parts[2] + "-" + parts[1] + "-" + parts[0];

  const newSelectedDate = new Date(newFormat);

  const today = new Date();

  // Вычисление разницы в миллисекундах
  const timeDiff = newSelectedDate.getTime() - today.getTime();
  // Преобразование разницы в дни
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
};

const sortByDate = () => {
  const dateElements = [...document.querySelectorAll(".date")];
  const sortPopup = document.querySelector(".sortPopup");

  dateElements.sort((a, b) => {
    const dateA = new Date(a.textContent.split(".").reverse().join("-"));
    const dateB = new Date(b.textContent.split(".").reverse().join("-"));
    return dateA - dateB;
  });

  sortPopup.style.display = "block";

  dateElements.forEach((date, i) => {
    const title =
      date.parentElement.parentElement.firstElementChild.textContent;
    const time = date.textContent;

    let liItem = `
      <li class="sortItem">${
        i + 1
      }) ${title}<span class="timePopup">${time}</span></li>
    `;

    sortList.insertAdjacentHTML("beforeend", liItem);
  });
};

sortByDateBtn.addEventListener("click", sortByDate);
cross.addEventListener("click", () => {
  sortPopup.style.display = "none";
  sortList.innerHTML = "";
});

const deleteTask = (evt) => {
  const title = evt.parentElement.querySelector(".task");

  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const updatedTasks = tasks.filter((task) => task.title !== title.textContent);

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  evt.parentElement.remove();
  allTasks();
};

clearBtn.addEventListener("click", () => {
  ulElement.innerHTML = "";
  localStorage.clear();
  allTasks();
});
