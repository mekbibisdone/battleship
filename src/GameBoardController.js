export default function GameBoardController() {
  function createGameBoard(height, length) {
    if (height === undefined || length === undefined)
      throw new Error("createGameBoard expects two arguments");
    const board = Array(height)
      .fill(null)
      .map(() => Array(length).fill(null));
    return board;
  }
  function placeShip(coordinates, ship, board) {
    if (coordinates === undefined || ship == undefined || board === undefined)
      throw new Error("placeShip expects three arguments");
    let beginning = coordinates.beginning;
    let end = coordinates.end;
    if (beginning > end) {
      const temp = beginning;
      beginning = end;
      end = temp;
    }
    if (beginning < 0 || end < 0) throw new Error("coordinates out of range");

    const boardCopy = JSON.parse(JSON.stringify(board));
    let length = ship.length;
    if (coordinates.vertical) {
      if (beginning >= boardCopy[0].length || end >= boardCopy[0].length)
        throw new Error("coordinates out of range");
      for (let i = beginning; i <= end; i++) {
        boardCopy[i][beginning] = ship;
        length = length - 1;
        if (length === 0) break;
      }
    } else {
      if (beginning >= boardCopy.length || end >= boardCopy.length)
        throw new Error("coordinates out of range");
      for (let i = beginning; i <= end; i++) {
        boardCopy[beginning][i] = ship;
      }
    }
    return boardCopy;
  }

  return { createGameBoard, placeShip };
}
