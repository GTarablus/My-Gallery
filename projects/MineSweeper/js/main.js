"use strict";

// CR: Hi Gil, I liked your project! It looks nice and you were creative with the sounds and the confetti. Here are a few things:
// DRY - Don't Repeat Yourself. If you see you're doing the same things in different places maybe think about writing a function or using a different approach.
// You did not follow the PDF global variable names. Pay close attention and read the whole PDF before you start coding, it will make your life easier.
// I noticed you can put a flag on the board even if the game didn't start yet. This leads to bugs when checking for victory.
// Could've been nicer if you kept the high scores somewhere on the page, in your case it disappears when we start a new game and only appears again when you finish a game.
// All in all you have good code, good variable names and good understanding of the concepts we've learned.
// Look for comments with "CR" in your code, i've added some comments.
// Good Luck!

const MINE = "💣"; // CR: We prefer using single quotes in JS
const FLAG = "🚩";
const FACE = "😀";
const DEAD = "🤯";
const EMPTY = "";
const HAPPY = "🥳";
const HEART = "💖";
const SHIELD = "🛡️";
const openColor = "rgb(180, 180, 180)";
const BGC = "rgb(100, 185, 200)";
const INITIALTEXT = "Click a cell to initialize the game 🎮";
const BOOMSOUND = new Audio("sounds/boom.mp3");
const PARTYSOUND = new Audio("sounds/party.mp3");
const LOSESOUND = new Audio("sounds/lose.mp3");

/****************** GLOBAL VARIABLES ******************/

var elFace = document.querySelector(".faceHolder");
var elBestScore = document.querySelector(".bestScore");
var elText = document.querySelector("h2");
var elClock = document.querySelector(".clock");
var elBody = document.querySelector("body");
var elLives = document.querySelector(".indications .lives");
var elShields = document.querySelector(".shields");
var gTime = 0;
var gBoard;
var numOfMines = 2;
var isGameOn = false;
var gPrevValue = "";
var gMineLocations = [];
var increaseTime;
var gFlagCount = 0;
var openCellCount = 0;
var gBoardSize = 4;
var gLives = 2;
var gShields = 2;
var gCurrLevel = "Easy";
/****************** LEVEL MODIFIER ******************/

function levelModif(level) { // CR: This is a very long function. You are repeating code.
  gCurrLevel = level;
  elFace.innerHTML = FACE;
  elText.innerHTML = INITIALTEXT;

  elClock.innerHTML = 0;
  if (isGameOn) {
    faceBtn();
  }
  if (level === "Easy") {
    numOfMines = 2;
    gBoardSize = 4;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
    elLives.innerText = HEART + HEART;
    elShields.innerText = SHIELD + SHIELD;
    gLives = 2;
    gShields = 2;
    elBody.style.backgroundColor = BGC;
    confetti.stop();
    if (localStorage.Easy) {
      elBestScore.innerText = `Best time for this level is: ${localStorage.Easy} seconds`;
    } else elBestScore.style.display = "none";
  } else if (level === "Medium") {
    numOfMines = 12;
    gBoardSize = 8;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
    elLives.innerText = HEART + HEART + HEART;
    elShields.innerText = SHIELD + SHIELD + SHIELD;
    gLives = 3;
    gShields = 3;
    elBody.style.backgroundColor = BGC;
    confetti.stop();
    if (localStorage.Medium) {
      elBestScore.innerText = `Best time for this level is: ${localStorage.Medium} seconds`;
    } else elBestScore.style.display = "none";
  } else if (level === "Hard") {
    numOfMines = 30;
    gBoardSize = 12;
    gBoard = createBoard(gBoardSize);
    renderBoard(gBoard);
    elLives.innerText = HEART + HEART + HEART;
    elShields.innerText = SHIELD + SHIELD + SHIELD;
    gLives = 3;
    gShields = 3;
    elBody.style.backgroundColor = BGC;
    confetti.stop();
    if (localStorage.Hard) {
      elBestScore.innerText = `Best time for this level is: ${localStorage.Hard} seconds`;
    } else elBestScore.style.display = "none";
  }
}
/****************** INITIALIZING FUNCTION ******************/
function init() {
  gBoard = createBoard(gBoardSize);
  renderBoard(gBoard);
  elFace.innerHTML = FACE;
  document.querySelector("body").style.opacity = 1;
  if (!isGameOn) document.querySelector(`#${gCurrLevel}`).checked = true;
  levelModif(gCurrLevel);
  confetti.stop();
}
/****************** CREATE GAME BOARD ******************/
//Building the game board according to size
function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = { // CR: Good code but in the PDF we told you how a cell object should look and you didn't follow that.
        i,
        j,
        value: "",
        isHit: false,
      };
    }
  }
  return board;
}
/****************** PLACING MINES ******************/
//Placing mines on the board, using random inclusive function according to random number
function placeMines(board, mines) {
  for (var i = 0; i < mines; i++) {
    var position = {
      g: getRandomIntInclusive(0, board.length - 1), // CR: Why use g and j? The common letters are i, j, k etc... Remember you will work with other developers, don't reinvent the wheel here
      j: getRandomIntInclusive(0, board.length - 1),
    };
    var currValue = board[position.g][position.j].value;
    if (board[position.g][position.j].isHit || currValue === MINE) {
      i--;
    } else {
      board[position.g][position.j].value = MINE;
      gMineLocations[i] = position;
    }
  }
}
/****************** CHECKING ALL NEIGHBOURS ******************/
function checkAllNeighbours(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = board[i][j];
      if (cell.value === MINE) continue;
      cell.value = checkCellNeighbours(cell, board);
    }
  }
}
/****************** CHECK CELL NEIGHBOURS ******************/
function checkCellNeighbours(cell, board) {
  var neighCount = 0;
  for (var i = cell.i - 1; i <= cell.i + 1 && i < gBoard.length; i++) {
    for (var j = cell.j - 1; j <= cell.j + 1; j++) {
      if (i < 0 || j < 0 || i === board.length || j === board.length) continue;
      if (board[i][j].value === MINE) neighCount++;
    }
  }
  if (neighCount === 0) {
    neighCount = EMPTY;
  }
  return neighCount;
}
/****************** RENDERING BOARD ******************/
//Rendering board
function renderBoard(board) {
  var strHtml = "";
  for (var i = 0; i < board.length; i++) {
    var row = board[i];
    strHtml += "<tr>";
    for (var j = 0; j < row.length; j++) {
      var cell = board[i][j].value;

      strHtml += `<td data-i="${i}" data-j="${j}" id="cell${i}-${j}" onclick="cellClicked(this)" oncontextmenu="cellFlagged(this)">
                               <p> ${cell} </p>
                            </td>`;
    }
    strHtml += "</tr>";
  }
  var elMat = document.querySelector(".game-board");
  elMat.innerHTML = strHtml;
}
/****************** CELLCLICKED FUNCTION ******************/
/* cellClicked function
Returns if clicked cell is flagged, updates isHit to true
show content only if game is on, places mines (except for clicked pos)
check for neighbours according to mine position
Renders board, sends to loseGame function if mine is clicked
*/
function cellClicked(cell) {
  var cellPos = {
    g: +cell.dataset.i,
    j: +cell.dataset.j,
  };
  var cellValue = cell.children[0].innerText; // CR: You shouldn't be going this way to get the cell value
  if (cellValue === FLAG || gBoard[cellPos.g][cellPos.j].isHit === true) return;
  gBoard[cellPos.g][cellPos.j].isHit = true;
  if (isGameOn) cell.children[0].style.opacity = 1;
  if (!isGameOn && elFace.innerHTML === FACE) {
    isGameOn = true;
    gameClock();
    placeMines(gBoard, numOfMines);
    checkAllNeighbours(gBoard);
    renderBoard(gBoard);
    var newCell = document.querySelector(`#cell${cellPos.g}-${cellPos.j}`);
    newCell.children[0].style.opacity = 1; // Attempt to set opacity of first clicked cell in order  to show its value after first click and after board is rendered
    newCell.style.backgroundColor = openColor; //Attempt to set first click background
    if (gBoard[cellPos.g][cellPos.j].value === EMPTY)
      openRecur(cellPos, gBoard);
    openCellCount++;
    elText.innerHTML = "May the Force be with you 🐸";
    return;
  }
  if (cellValue === MINE && isGameOn && gLives === 1) {
    cell.style.backgroundColor = "red";
    BOOMSOUND.play();
    elLives.innerText = "";
    loseGame();
  } else if (cellValue === MINE && isGameOn && gLives > 1) {
    cell.style.backgroundColor = "red";
    BOOMSOUND.play();
    gLives--;
    gFlagCount++;
    if (gLives === 2) elLives.innerText = HEART + HEART;
    if (gLives === 1) {
      elLives.innerText = HEART;
      elBody.style.backgroundColor = "rgb(179, 21, 21)";
      elText.innerHTML = "DANGER";
    }
    checkVictory();
  } else if (cellValue === EMPTY && isGameOn) {
    cell.style.backgroundColor = openColor;
    openRecur(cellPos, gBoard);
    openCellCount++;
    checkVictory();
  } else {
    cell.style.backgroundColor = openColor;
    openCellCount++;
    checkVictory();
  } // CR: You are repeating code in this function too. If you see you're doing the same thing in many places, maybe think about writing a function or using a different approach
}
/****************** FLAGGING CELLS ******************/
function cellFlagged(cell) {
  gFlagCount++;
  var cellValue = cell.children[0].innerText;
  var i = +cell.dataset.i;
  var j = +cell.dataset.j;
  if (!isGameOn) {
    isGameOn = true;
    gameClock();
    placeMines(gBoard, numOfMines);
    checkAllNeighbours(gBoard);
    renderBoard(gBoard);
  }
  if (!gBoard[i][j].isHit) {
    if (cellValue !== FLAG) {
      gPrevValue = cellValue;
      cell.children[0].innerText = FLAG;
      cell.children[0].style.opacity = 1;
    } else {
      cell.children[0].innerText = gPrevValue;
      cell.children[0].style.opacity = 0;
      gFlagCount--;
    }
  }
  checkVictory();
}
/****************** FULL REVEAL ******************/
//Based on openNeighbours function:
// function openNeighbours(cell, board) {
//   for (var i = cell.g - 1; i <= cell.g + 1 && i < gBoard.length; i++) {
//     for (var j = cell.j - 1; j <= cell.j + 1; j++) {
//       if (i < 0 || j < 0 || i === board.length || j === board.length) continue;
//       if (board[i][j].isHit) continue;
//       var value = board[i][j].value;
//       var nextCell = {
//         g: i,
//         j,
//       };
//       board[i][j].isHit = true;
//       renderCell(nextCell, value);
//     }
//   }
// }
function openRecur(cell, board) {
  for (var i = cell.g - 1; i <= cell.g + 1 && i < gBoard.length; i++) {
    for (var j = cell.j - 1; j <= cell.j + 1; j++) {
      if (i < 0 || j < 0 || i === board.length || j === board.length) continue;
      if (board[i][j].isHit) continue;
      var value = board[i][j].value;
      var nextCell = {
        g: i,
        j,
      };
      board[i][j].isHit = true;
      renderCell(nextCell, value);
      if (value !== EMPTY) continue;
      openRecur(nextCell, board);
    }
  }
}
/****************** LOSE GAME ******************/
/* loseGame function
Reveals all mine locations using a mine array
stops the clock, changes player face, turns off game
*/
function loseGame() {
  for (var i = 0; i < gMineLocations.length; i++) {
    setTimeout(function () {
      LOSESOUND.play();
    }, 500);
    var currLocation = gMineLocations[i];
    renderCell(currLocation, MINE);
    clearInterval(increaseTime);
    elFace.innerHTML = DEAD;
    isGameOn = false;
    openCellCount = 0;
    gFlagCount = 0;
    elText.innerHTML = "🤯 You Died! 💀<br> NO CONFETTI FOR YOU";
  }
}
/****************** CHECK VICTORY ******************/
function checkVictory() {
  var notMineCount = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].value !== MINE) {
        notMineCount++;
      }
    }
  }
  if (gFlagCount >= numOfMines && openCellCount === notMineCount) {
    winGame();
  }
}
/****************** WIN GAME FUNCTION ******************/
function winGame() {
  confetti.start();
  PARTYSOUND.play();
  elFace.innerHTML = HAPPY;
  clearInterval(increaseTime);
  isGameOn = false;
  openCellCount = 0;
  gFlagCount = 0;
  winText(gCurrLevel);
}
/****************** EMOJI FACE BUTTON FUNCTION ******************/
function faceBtn() {
  isGameOn = false;
  document.querySelector(`#${gCurrLevel}`).checked = true;
  elClock.innerHTML = 0;
  clearInterval(increaseTime);
  init();
  elFace.innerHTML = FACE;
  openCellCount = 0;
  gFlagCount = 0;
  elText.innerHTML = INITIALTEXT;
  elBody.style.backgroundColor = BGC;
  confetti.stop();
}

/****************** EMOJI FACE BUTTON FUNCTION ******************/
function safeClick() {
  if (!isGameOn || gShields === 0) return;
  var safeCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (!gBoard[i][j].isHit && gBoard[i][j].value !== MINE) {
        var position = {
          i,
          j,
        };
        safeCells.push(position);
      }
    }
  }
  var safePos = safeCells[getRandomIntInclusive(0, safeCells.length - 1)];
  var safeCell = document.querySelector(`#cell${safePos.i}-${safePos.j}`);
  safeCell.style.backgroundColor = "green";
  setTimeout(function () {
    safeCell.style.backgroundColor = "rgb(144, 144, 144)";
  }, 500);
  gShields--;
  if (gShields === 2) elShields.innerHTML = SHIELD + SHIELD + " ";
  if (gShields === 1) elShields.innerHTML = SHIELD + " " + " ";
  if (gShields === 0) elShields.innerHTML = " " + " " + " ";
}

function winText(level) {
  if (level === "Easy") {
    if (localStorage.Easy) {
      if (gTime < localStorage.Easy) localStorage.Easy = gTime;
    } else {
      localStorage.setItem(gCurrLevel, gTime);
    }
    elText.innerHTML =
      "🎉🎊 You Win! 🎊🎉 <br> Your Time: " +
      gTime +
      " Seconds <br> Best time: " +
      localStorage.Easy +
      " seconds";
  } else if (level === "Medium") {
    if (localStorage.Medium) {
      if (gTime < localStorage.Medium) localStorage.Medium = gTime;
    } else {
      localStorage.setItem(gCurrLevel, gTime);
    }
    elText.innerHTML =
      "🎉🎊 You Win! 🎊🎉 <br> Your Time: " +
      gTime +
      " Seconds <br> Best time: " +
      localStorage.Medium +
      " seconds";
  } else if (level === "Hard") {
    if (localStorage.Hard) {
      if (gTime < localStorage.Hard) localStorage.Hard = gTime;
    } else {
      localStorage.setItem(gCurrLevel, gTime);
    }
    elText.innerHTML =
      "🎉🎊 You Win! 🎊🎉 <br> Your Time: " +
      gTime +
      " Seconds <br> Best time: " +
      localStorage.Hard +
      " seconds";
  }
}
