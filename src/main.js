import "./style.css";
import GameController from "./GameController";
createGameBoard();

function createGameBoard() {
  const boards = document.querySelector(".boards");
  const playerBoard = document.createElement("div");
  playerBoard.classList.toggle("boardLeft");
  const AIBoard = document.createElement("div");
  AIBoard.classList.toggle("boardRight");
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.toggle("reset");
  resetButton.addEventListener("click", resetGame);
  const winnerStatus = document.createElement("h1");
  winnerStatus.classList.toggle("winner");
  boards.append(playerBoard, resetButton, AIBoard, winnerStatus);
  createCells(playerBoard, "player");
  createCells(AIBoard, "AI");
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
