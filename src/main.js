import "./style.css";
import GameController from "./GameController";
createGameBoard();
displayGameStatus();
function createGameBoard() {
  const boards = document.querySelector(".boards");
  const playerBoard = document.createElement("div");
  playerBoard.classList.toggle("boardLeft");
  const AIBoard = document.createElement("div");
  AIBoard.classList.toggle("boardRight");
  boards.append(playerBoard, createButtonDiv(), AIBoard);
  createCells(playerBoard, "player");
  createCells(AIBoard, "AI");
}
function displayGameStatus(errorMessage = null, winner = null) {
  const instruction = document.querySelector(".gameStatus");
  if (errorMessage !== null) {
    instruction.textContent = errorMessage;
    setTimeout(displayGameStatus, 2000);
    return;
  }
  if (winner !== null) {
    if (winner === true) {
      instruction.textContent = "Congrats! you have won";
    } else {
      instruction.textContent = "Sorry, but you have lost";
      displayAIShips();
    }
    const AIBoardCells = document.querySelectorAll(`[owner="AI"]`);
    AIBoardCells.forEach((AIBoardCell) => {
      AIBoardCell.removeEventListener("click", attackAIShips);
    });
    return;
  }
  if (GameController.haveAllShipsBeenPlaced()) {
    instruction.textContent = "Click on the right board's cell to attack";
  } else {
    const size = GameController.getCurrentShipSize();
    instruction.textContent = `Hover and click on the left board to place a ship of size ${size}`;
  }
}
function createButtonDiv() {
  const buttonDiv = document.createElement("div");
  buttonDiv.classList.toggle("buttonContainer");
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.toggle("reset");
  resetButton.addEventListener("click", resetGame);

  const toggleAxis = document.createElement("button");
  toggleAxis.textContent = "Toggle Horizontal Placement";
  toggleAxis.addEventListener("click", changeAxis);
  toggleAxis.setAttribute("axis", "vertical");

  buttonDiv.append(toggleAxis, resetButton);
  return buttonDiv;
}
function createCells(board, boardOwner) {
  const width = board.offsetWidth;
  const height = board.offsetHeight;
  const cellHeight = height / 10;
  const cellWidth = width / 10;
  board.style.setProperty(
    "grid-template-columns",
    `repeat(10, ${cellHeight}px)`,
  );
  board.style.setProperty("grid-template-rows", `repeat(10, ${cellWidth}px)`);
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      cell.style.width == cellWidth;
      cell.style.height = cellHeight;
      cell.style.border = "1px solid black";
      cell.setAttribute("owner", boardOwner);
      cell.setAttribute("outer", i);
      cell.setAttribute("inner", j);
      if (boardOwner === "AI") {
        cell.setAttribute("isHit", false);
      } else {
        cell.addEventListener("mouseover", highLightShip);
        cell.addEventListener("click", placeShip);
      }
      board.append(cell);
    }
  }
}

function attackAIShips(e) {
  if (e.target.getAttribute("isHit") === "false") {
    const outer = Number(e.target.getAttribute("outer"));
    const inner = Number(e.target.getAttribute("inner"));
    GameController.attackAIShips({ outer, inner });
    let AIGameBoard = GameController.getAIGameBoard();
    if (AIGameBoard.board[outer][inner] === 1)
      e.target.style.background = `red`;
    else e.target.style.background = `blue`;

    e.target.setAttribute("isHit", true);
    if (GameController.isGameOver()) {
      displayGameStatus(null, true);
    } else {
      attackPlayerShips();
    }
  }
}

function attackPlayerShips() {
  const coordinates = GameController.attackPlayerShips();
  const hitCell = document.querySelector(
    `[outer="${coordinates.outer}"][inner="${coordinates.inner}"][owner="player"]`,
  );
  if (
    GameController.getPlayerGameBoard().board[coordinates.outer][
      coordinates.inner
    ] === 1
  )
    hitCell.style.background = `red`;
  else hitCell.style.background = `blue`;

  if (GameController.isGameOver()) {
    displayGameStatus(null, false);
  }
}
function placeShip(e) {
  removeHighLight();
  const outer = Number(e.target.getAttribute("outer"));
  const inner = Number(e.target.getAttribute("inner"));
  const axis = document.querySelector(`[axis]`).getAttribute("axis");
  const vertical = axis === "vertical" ? true : false;
  const coordinates = { outer, inner, vertical };
  try {
    const sizeBeforeMutation = GameController.getCurrentShipSize();
    GameController.placePlayerShips(coordinates);
    if (GameController.haveAllShipsBeenPlaced()) {
      const playerCells = document.querySelectorAll(`[owner="player"]`);
      playerCells.forEach((cell) => {
        cell.removeEventListener("mouseover", highLightShip);
        cell.removeEventListener("click", placeShip);
      });
      const AICells = document.querySelectorAll(`[owner="AI"]`);
      AICells.forEach((cell) => {
        cell.addEventListener("click", attackAIShips);
      });
    }
    displayGameStatus();
    colorCells(coordinates, sizeBeforeMutation);
  } catch (e) {
    displayGameStatus(e.message);
  }
}
function colorCells(coordinates, size) {
  removeHighLight();
  if (coordinates.vertical === true) {
    for (let i = 0; i < size; i++) {
      const cell = document.querySelector(
        `[outer="${coordinates.outer + i}"][inner="${
          coordinates.inner
        }"][owner="player"]`,
      );
      cell.style.setProperty("background-color", "green");
      cell.setAttribute("placed", "true");
      cell.removeEventListener("mouseover", highLightShip);
      cell.removeEventListener("click", placeShip);
    }
  } else {
    for (let i = 0; i < size; i++) {
      const cell = document.querySelector(
        `[outer="${coordinates.outer}"][inner="${
          coordinates.inner + i
        }"][owner="player"]`,
      );
      cell.style.setProperty("background-color", "green");
      cell.setAttribute("placed", "true");
      cell.removeEventListener("mouseover", highLightShip);
      cell.removeEventListener("click", placeShip);
    }
  }
}
function highLightShip(e) {
  removeHighLight();
  const outer = Number(e.target.getAttribute("outer"));
  const inner = Number(e.target.getAttribute("inner"));
  const playerGameBoard = GameController.getPlayerGameBoard();
  const size = GameController.getCurrentShipSize();
  const axis = document.querySelector(`[axis]`).getAttribute("axis");
  if (axis === "horizontal") {
    if (
      playerGameBoard.board[outer] !== undefined &&
      playerGameBoard.board[outer][inner + size - 1] !== undefined
    ) {
      for (let i = 0; i < size; i++) {
        const cell = document.querySelector(
          `[outer="${outer}"][inner="${inner + i}"][owner="player"]`,
        );
        if (cell.getAttribute("placed") !== "true") {
          cell.style.setProperty("background-color", "yellow");
          cell.setAttribute("onHold", true);
        }
      }
    }
  } else {
    if (playerGameBoard.board[outer + size - 1] !== undefined) {
      for (let i = 0; i < size; i++) {
        const cell = document.querySelector(
          `[outer="${outer + i}"][inner="${inner}"][owner="player"]`,
        );
        if (cell.getAttribute("placed") !== "true") {
          cell.style.setProperty("background-color", "yellow");
          cell.setAttribute("onHold", true);
        }
      }
    }
  }
}

function removeHighLight() {
  const highLightedCells = document.querySelectorAll(`[onHold="true"]`);
  highLightedCells.forEach((highLightedCell) => {
    highLightedCell.style.setProperty("background-color", "rgb(235, 235, 235)");
    highLightedCell.setAttribute("onHold", false);
  });
}

function changeAxis(e) {
  if (e.target.getAttribute("axis") === "vertical") {
    e.target.textContent = "Toggle Vertical Placement";
    e.target.setAttribute("axis", "horizontal");
  } else {
    e.target.textContent = "Toggle Horizontal Placement";
    e.target.setAttribute("axis", "vertical");
  }
}
function displayAIShips() {
  const AICells = document.querySelectorAll(`[isHit="false"][owner="AI"]`);
  const AIGameBoard = GameController.getAIGameBoard();
  AICells.forEach((AICell) => {
    const outer = Number(AICell.getAttribute("outer"));
    const inner = Number(AICell.getAttribute("inner"));
    if (
      AIGameBoard.board[outer][inner] !== 1 &&
      AIGameBoard.board[outer][inner] !== 0 &&
      AIGameBoard.board[outer][inner] !== null
    ) {
      AICell.style.setProperty("background-color", "green");
    }
  });
}
function resetGame() {
  const boards = document.querySelector(".boards");
  boards.textContent = "";
  GameController.resetGame();
  createGameBoard();
  displayGameStatus();
}
