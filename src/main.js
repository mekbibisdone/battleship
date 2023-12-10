import "./style.css";
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
      cell.setAttribute("owner", boardOwner);
      cell.setAttribute("outer", i);
      cell.setAttribute("inner", j);
      board.append(cell);
    }
  }
}
