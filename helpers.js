const randomIndex = (max) => {
  return Math.floor(Math.random() * max);
};

const chooseRandomColor = () => {
  const colors = [pink, green, blue, orange];
  return colors[randomIndex(colors.length)];
};

const findTimeLocation = (time) => {
  const times = [
    "6:00",
    "6:30",
    "7:00",
    "7:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "24:00",
  ];
  const index = times.findIndex((x) => x == time);
  return index;
};

const loadItems = () => {
  const stringItems = localStorage.getItem("items");
  const parsedItems =
    stringItems !== null || stringItems !== undefined
      ? JSON.parse(stringItems)
      : [];
  return parsedItems;
};