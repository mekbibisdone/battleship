import "./style.css";
import GameController from "./GameController";
const playerBoard = document.querySelector(".boardLeft");
const AIBoard = document.querySelector(".boardRight");

createCells(playerBoard, "player");
createCells(AIBoard, "AI");
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
    attackPlayerShips();
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
}
