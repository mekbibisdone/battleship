import "./style.css";
import GameController from "./GameController";
createGameBoard();

function createGameBoard() {
  const boards = document.querySelector(".boards");
  const playerBoard = document.createElement("div");
  playerBoard.classList.toggle("boardLeft");
  const AIBoard = document.createElement("div");
  AIBoard.classList.toggle("boardRight");

  const winnerStatus = document.createElement("h1");
  winnerStatus.classList.toggle("winner");
  boards.append(playerBoard, createButtonDiv(), AIBoard, winnerStatus);
  createCells(playerBoard, "player");
  createCells(AIBoard, "AI");
}

function createButtonDiv() {
  const buttonDiv = document.createElement("div");

  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.toggle("reset");
  resetButton.addEventListener("click", resetGame);

  const toggleAxis = document.createElement("button");
  toggleAxis.textContent = "Toggle Horizontal";
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
        cell.addEventListener("click", attackAIShips);
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
    e.target.textContent = AIGameBoard.board[outer][inner];
    console.table(AIGameBoard.board);
    console.table(GameController.getPlayerGameBoard().board);
    e.target.setAttribute("isHit", true);
    if (GameController.isGameOver()) {
      handleWinStatus(true);
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
  hitCell.textContent =
    GameController.getPlayerGameBoard().board[coordinates.outer][
      coordinates.inner
    ];
  if (GameController.isGameOver()) {
    handleWinStatus(false);
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
    const lengthBeforeMutation =
      GameController.getShips()[
        GameController.getPlayerGameBoard().ships.length
      ].length;
    GameController.placePlayerShips(coordinates);
    if (
      GameController.getPlayerGameBoard().ships.length ===
      GameController.getShips().length
    ) {
      const cells = document.querySelectorAll(`[owner="player"]`);
      cells.forEach((cell) => {
        cell.removeEventListener("mouseover", highLightShip);
        cell.removeEventListener("click", placeShip);
      });
    }
    colorCells(coordinates, lengthBeforeMutation);
  } catch (e) {
    console.log(e.message);
  }
}
function handleWinStatus(win) {
  if (win === true) {
    const winnerElement = document.querySelector(".winner");
    winnerElement.textContent = "Congrats! you have won";
  } else {
    const winnerElement = document.querySelector(".winner");
    winnerElement.textContent = "Sorry, but you have lost";
  }
  const AIBoardCells = document.querySelectorAll(`[owner="AI"]`);
  AIBoardCells.forEach((AIBoardCell) => {
    AIBoardCell.removeEventListener("click", attackAIShips);
  });
}

function resetGame() {
  const boards = document.querySelector(".boards");
  boards.textContent = "";
  GameController.resetGame();
  createGameBoard();
}
function colorCells(coordinates, length) {
  removeHighLight();
  if (coordinates.vertical === true) {
    for (let i = 0; i < length; i++) {
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
    for (let i = 0; i < length; i++) {
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
  const ships = GameController.getShips();
  const length = ships[playerGameBoard.ships.length].length;
  const axis = document.querySelector(`[axis]`).getAttribute("axis");
  if (axis === "horizontal") {
    if (
      playerGameBoard.board[outer] !== undefined &&
      playerGameBoard.board[outer][inner + length - 1] !== undefined
    ) {
      for (let i = 0; i < length; i++) {
        const cell = document.querySelector(
          `[outer="${outer}"][inner="${inner + i}"][owner="player"]`,
        );
        if (cell.getAttribute("placed") !== "true") {
          cell.style.setProperty("background-color", "blue");
          cell.setAttribute("onHold", true);
        }
      }
    }
  } else {
    if (playerGameBoard.board[outer + length - 1] !== undefined) {
      for (let i = 0; i < length; i++) {
        const cell = document.querySelector(
          `[outer="${outer + i}"][inner="${inner}"][owner="player"]`,
        );
        if (cell.getAttribute("placed") !== "true") {
          cell.style.setProperty("background-color", "blue");
          cell.setAttribute("onHold", true);
        }
      }
    }
  }
}

function removeHighLight() {
  const highLightedCells = document.querySelectorAll(`[onHold="true"]`);
  highLightedCells.forEach((highLightedCell) => {
    highLightedCell.style.setProperty("background-color", "white");
    highLightedCell.setAttribute("onHold", false);
  });
}

function changeAxis(e) {
  if (e.target.getAttribute("axis") === "vertical") {
    e.target.textContent = "Toggle Vertical";
    e.target.setAttribute("axis", "horizontal");
  } else {
    e.target.textContent = "Toggle Horizontal";
    e.target.setAttribute("axis", "vertical");
  }
}
