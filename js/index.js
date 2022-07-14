// spacing
const horizSpacing = 100; //pixels
const vertSpacing = 30;

const numberofHalfHours = 37;
const maxNumOfTasks = 30;

let currentItemYPosition = 0;
// colors
const black = "#000";
const white = "#fff";
const pink = "#C952D9";
const green = "#03A65A";
const blue = "#04C4D9";
const orange = "#F2B705";
const gold = "#ffd700";

const paper = Raphael(
  0,
  0,
  horizSpacing * numberofHalfHours,
  window.innerHeight
);
paper.canvas.style.backgroundColor = black;

// HELPERS
//starts at 0 goes to max-1

// time:string

const saveItems = () => {
  const items = JSON.stringify(allItems);
  localStorage.setItem("items", items);
};

const deleteAllItems = () => {
  allItems = [];
  currentItemYPosition = 0;
  saveItems();
};

const chooseRandomColor = () => {
  const colors = [pink, green, blue];
  return colors[randomIndex(colors.length)];
};

// const allItems = [
//   { x: 0, y: 0, halfHours: 5, name: "Eat Breakfast", color: green },
//   { x: 200, y: vertSpacing, halfHours: 1, name: "Tea Part", color: blue },
//   { x: 400, y: vertSpacing * 2, halfHours: 1, name: "Test", color: orange },
//   { x: 600, y: vertSpacing * 3, halfHours: 1, name: "Eat Dinner", color: pink },
//   { x: 700, y: vertSpacing * 4, halfHours: 1, name: "study 1", color: green },
//   { x: 800, y: vertSpacing * 5, halfHours: 1, name: "study 2", color: blue },
//   { x: , y: vertSpacing * 6, halfHours: 1, name: "study 3", color: orange },
//   { x: 1000, y: vertSpacing * 7, halfHours: 1, name: "study 4", color: pink },
// ];
let allItems = loadItems() ?? [];
let oldItems = [];

const drawBottomLines = () => {
  let timeCounter = 6; //start time will start at 6:30

  // draw bottom lines with hours
  for (let i = 0; i < numberofHalfHours; i++) {
    const c = paper.rect(horizSpacing * i, window.innerHeight - 20, 3, 20);
    c.attr("fill", pink);
    let time = timeCounter.toString();
    if (i == 13) {
      timeCounter = 0;
    }
    if (i % 2 === 1) {
      time = time + ":30";
      timeCounter++;
    }
    paper
      .text(horizSpacing * i + 2, window.innerHeight - 27, time.toString())
      .attr({ fill: white });
  }
};

const drawGrid = () => {
  const yOffset = 6;
  for (let i = 0; i < horizSpacing; i++) {
    const l = paper
      .rect(horizSpacing * i, 0, 0.1, window.innerHeight - 30)
      .attr({ stroke: "#111" })
      .attr({ fill: "#111" });
  }
  for (let y = 0; y < vertSpacing; y++) {
    const l = paper.rect(
      0,
      vertSpacing * y - yOffset,
      window.innerWidth + 2500,
      3
    );
    l.attr({ fill: "#111" });
  }
};

const drawCurrentTimePinkLine = () => {
  const date = new Date();
  date.toLocaleString([], {
    hour12: false,
  });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  let minutesEdited = minutes;
  if (minutesEdited < 30) {
    minutesEdited = "00";
  } else {
    minutesEdited = "30";
  }

  const timeIndex = findTimeLocation(`${hours}:${minutesEdited}`);

  paper
    .rect(horizSpacing * timeIndex, 0, 2, window.innerHeight - 35)
    .attr({ fill: pink });
};

const drawAllItems = () => {
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    addItem(
      item.x,
      item.y,
      item.halfHours,
      item.name,
      item.color,
      item.width,
      false
    );
  }
};

const draw = () => {
  paper.clear();
  drawGrid();
  drawCurrentTimePinkLine();
  drawBottomLines();
  drawAllItems();
};

const arrageItems = () => {
  currentItemYPosition = 0;
  for (let i = 0; i < allItems.length; i++) {
    const element = allItems[i];
    element.y = currentItemYPosition;
    currentItemYPosition += vertSpacing;
    // console.log(allItems);
  }
};

const updateItem = (name, newx, newy, width, completed) => {
  if (newx < 0) {
    newx = 0;
  }
  const index = allItems.findIndex((m) => m.name == name);
  allItems[index].x = newx;
  allItems[index].y = newy;
  allItems[index].width = width;

  allItems.completed = completed;
  saveItems();
};

const deleteItem = (name) => {
  oldItems = [...allItems];
  const index = allItems.findIndex((m) => m.name == name);
  const oldItem = allItems.splice(index, 1);
  arrageItems();
  saveItems();

  return oldItem;
};

// goes with addItem->paper.text() opens modal and updates the values accordingly
let itemObjectName = "";
let editTaskModal = new bootstrap.Modal(
  document.getElementById("edit-task-name-modal"),
  () => {}
);

document
  .getElementById("submit-edit-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // console.log(editTaskModal);
    const taskName = document.getElementById("edittaskname").value;
    editTaskModal.hide();
    // console.log(editTaskModal);
    // console.log(itemObjectName);
    allItems[allItems.findIndex((x) => x.name == itemObjectName)].name =
      taskName;
    saveItems();
    draw();
  });

const addItem = (
  x,
  y,
  halfHours,
  name,
  color,
  width = 0,
  completed = false
) => {
  if (width === 0) {
    width = horizSpacing * halfHours;
  }
  const buttonSpacing = 10;
  const height = 20;
  name = name.toString();
  const rect = paper.rect(x, y, width, height, 5);
  rect.attr("fill", color);
  //   add sound

  //   edit name

  const text = paper.text(x + 50, y + 10, name).attr({ fill: "#fff" });
  text.click(() => {
    //   alert("clicked");
    itemObjectName = name;
    editTaskModal.show();
  });

  //   BUTTONS
  // delete button
  paper
    .circle(x + width - buttonSpacing * 2, y + 10, 6)
    .attr({ fill: "#fff" })
    .click(() => {
      deleteItem(name);
      removeListChild(name);
      draw();
    });

  // make longer button
  const makeLongerButton = paper
    .rect(x + width - buttonSpacing, y + 1, 10, height - 2)
    .attr({ fill: white })
    .attr({ stroke: black });

  makeLongerButton.drag((dx, dy, mouseX, mouseY, e) => {
    updateItem(name, x, y, dx + width, completed);
    draw();
  });

  rect.drag(function (dx, dy, mouseX, mouseY, e) {
    // console.log(e.targetTouches[0].clientX);

    // this.attrs.x = mouseX;
    draw();
    updateItem(name, x + dx, y, width, completed);
  });
};

//___ADD NEW ITEM MODAL__
let myModal = new bootstrap.Modal(
  document.getElementById("exampleModal"),
  () => {}
);

// add new Item via dbl click
paper.raphael.dblclick((e) => {
  //   console.log(e.clientX);
  
  
  const name = "item";
  if (currentItemYPosition < 720) {
    allItems.push({
      x: e.clientX + window.scrollX,
      y: currentItemYPosition,
      halfHours: 1,
      name,
      color: chooseRandomColor(),
    });

    saveItems();
    myModal.show();
    draw();
    currentItemYPosition += vertSpacing;
  } else {
    alert("Hey no more room for tasks sorry.");
  }
});




var createItemModal = document.getElementById("exampleModal");
createItemModal.addEventListener("show.bs.modal", function (event) {
  document.getElementById("taskname").value="";
});

createItemModal.addEventListener('hidden.bs.modal', function (event) {
  const name = document.getElementById("taskname");
  if (name.value === "" || name.value == undefined || name.value===null) {
    allItems.pop();
    saveItems();
    draw();
  }
});

//after click submit in #exampleModal, modal closes and changes set the name in the modal
document
  .getElementById("submit-create-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // console.log(myModal);
    const taskName = document.getElementById("taskname");
    myModal.hide();
    const newlyAddedItem = allItems[allItems.length - 1];
    newlyAddedItem.name = taskName.value;

    addtoSideMenu(taskName.value);
    draw();
    
    
  });

// delete all items/tasks
document
  .getElementById("delete-all")
  .addEventListener("click", function (event) {
    const response = confirm("This action cannot be undone. Are you sure?");
    if (response === true) {
      deleteAllItems();
      draw();
    }
  });

//   undo functionality
document.addEventListener("keydown", (event) => {
  //   const platform = navigator.userAgentData.platform;
  //   alert(platform);
  //   if (platform === "macOS") {
  if (event.ctrlKey && event.key === "z") {
  }
});

// SIDE MENU

const updateCompleted = (name, completed) => {
  const index = allItems.findIndex((x) => x.name === name);
  allItems[index].completed = completed;
};

const removeListChild = (name) => {
  const item = document.getElementById(`${name}-row`);
  if (item !== null) {
    item.remove();
  }
};
const addtoSideMenu = (name, checked) => {
  const parent = document.getElementById("checklist-container");

  const row = document.createElement("div");
  row.classList.add("row");
  row.setAttribute("id", `${name}-row`);
  const col1 = document.createElement("div");
  col1.classList.add("col");
  col1.classList.add("border-bottom");

  const col2 = document.createElement("div");
  col2.classList.add("col");
  col2.classList.add("border-bottom");
  const p = document.createElement("p");

  // checkbox
  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `${name}-checkbox`);
  checkbox.checked = checked;

  // checkbox.classList.add(`${name}-checkbox`);
  //checkbox event listner
  checkbox.addEventListener("change", function (e) {
    // alert(this.checked);
    const name = e.target.id.replace("-checkbox", "");
    const item = allItems.find((x) => x.name == name);

    if (this.checked === true) {
      item.color = orange;
      updateCompleted(name, this.checked);
      saveItems();
    } else {
      item.color = chooseRandomColor();
      updateCompleted(name, this.checked);
      saveItems();
    }
    draw();
  });

  // attach
  p.innerHTML = name;
  col1.appendChild(checkbox);
  col2.appendChild(p);
  row.appendChild(col1);
  row.appendChild(col2);
  parent.appendChild(row);
};

const main = () => {
  saveItems();
  draw();
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];

    addtoSideMenu(item.name, item.completed);
    currentItemYPosition += vertSpacing;
  }
};

main();

// addItem(0, 0, 5, "Eat Breakfast");
// addItem(200, vertSpacing, 1, "TEst");
// addItem(400, vertSpacing * 2, 1, "TEst");

// const rect=paper.rect(0,0,horizSpacing*2,20,5);
// rect.attr("fill", "#000");
// paper.text(0+50,10,"Eat Breakfast").attr({fill:"#fff"});

// var circle = paper.circle(50, 40, 10);
// // Sets the fill attribute of the circle to red (#f00)
// circle.attr("fill", "#f00");
// // Sets the stroke attribute of the circle to white
// circle.attr("stroke", "#fff");