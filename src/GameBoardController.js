export default function createGameBoardController() {
  function createGameBoard(x, y) {
    if (x === undefined || y === undefined)
      throw new Error("createGameBoard expects two arguments");
    if (x < 1 || y < 1) throw new Error("parameters are below range");
    const board = Array(x)
      .fill(null)
      .map(() => Array(y).fill(null));

    const gameBoard = {
      board,
      ships: [],
    };

    return gameBoard;
  }
  function placeShip(coordinates, ship, gameBoard) {
    if (
      coordinates === undefined ||
      ship == undefined ||
      gameBoard === undefined
    )
      throw new Error("placeShip expects three arguments");
    let beginning = coordinates.beginning;
    let end = coordinates.end;
    if (beginning > end) {
      const temp = beginning;
      beginning = end;
      end = temp;
    }
    if (beginning < 0 || end < 0) throw new Error("coordinates out of range");

    const gameBoardCopy = JSON.parse(JSON.stringify(gameBoard));
    let length = ship.length;
    if (length > end - beginning && end - beginning !== 0)
      throw new Error("ship is too big to fit");
    if (end - beginning === 1 || end - beginning === 0) {
      if (gameBoardCopy.board[beginning][end] !== null)
        throw new Error("the place of the coordinates already has a ship");
      gameBoardCopy.board[beginning][end] = ship;
    } else if (coordinates.vertical) {
      if (
        beginning >= gameBoardCopy.board[0].length ||
        end > gameBoardCopy.board[0].length
      )
        throw new Error("coordinates out of range");
      for (let i = beginning; i < end; i++) {
        if (gameBoardCopy.board[beginning][i] !== null)
          throw new Error("the place of the coordinates already has a ship");
        gameBoardCopy.board[i][beginning] = ship;
        length = length - 1;
        if (length === 0) break;
      }
    } else {
      if (
        beginning >= gameBoardCopy.board.length ||
        end > gameBoardCopy.board.length
      )
        throw new Error("coordinates out of range");
      for (let i = beginning; i < end; i++) {
        if (gameBoardCopy.board[beginning][i] !== null)
          throw new Error("the place of the coordinates already has a ship");
        gameBoardCopy.board[beginning][i] = ship;
        length = length - 1;
        if (length === 0) break;
      }
    }
    ship.id = gameBoardCopy.ships.length;
    gameBoardCopy.ships.push(ship);
    return gameBoardCopy;
  }
  function receiveAttack(coordinates, gameBoard, shipController) {
    if (
      coordinates === undefined ||
      gameBoard === undefined ||
      shipController == undefined
    )
      throw new Error("receive attack expects three arguments");
    if (
      coordinates.x < 0 ||
      coordinates.y < 0 ||
      coordinates.x >= gameBoard.board.length ||
      coordinates.y >= gameBoard.board[0].length
    )
      throw new Error("coordinates our of range");

    const gameBoardCopy = JSON.parse(JSON.stringify(gameBoard));
    if (gameBoardCopy.board[coordinates.x][coordinates.y] === null) {
      gameBoardCopy.board[0][0] = 0;
      return gameBoardCopy;
    } else if (
      gameBoardCopy.board[coordinates.x][coordinates.y] !== null &&
      gameBoardCopy.board[coordinates.x][coordinates.y] !== 0 &&
      gameBoardCopy.board[coordinates.x][coordinates.y] !== 1
    ) {
      const hitShip = shipController.hit(
        gameBoardCopy.board[coordinates.x][coordinates.y],
      );

      gameBoardCopy.ships[hitShip.id] = hitShip;
      gameBoardCopy.board[coordinates.x][coordinates.y] = 1;
      return gameBoardCopy;
    }
    throw new Error("board has already received an attack at the coordinates");
  }

  return { createGameBoard, placeShip, receiveAttack };
}
