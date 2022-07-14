// colors

const black = "#000";
const white = "#fff";
const pink = "#C952D9";
const green = "#03A65A";
const blue = "#04C4D9";
const orange = "#F2B705";
const gold = "#ffd700";

//GRID
// spacing
const horizSpacing = 100; //pixels
const vertSpacing = 30;

const numberofHalfHours = 37;
const maxNumOfTasks = 30;
let currentItemYPosition = 0;
// RAPHAEL JS
const paper = Raphael(0, 0, horizSpacing * numberofHalfHours, innerHeight);
paper.canvas.style.backgroundColor = black;

export default {
  colors: { black, white, pink, green, blue, orange, gold },
  
};
