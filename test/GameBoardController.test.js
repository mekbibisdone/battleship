import GameBoardController from "../src/GameBoardController";

it("throws an error when no parameters are given", () => {
  expect(() => GameBoardController().createGameBoard()).toThrow(
    "createGameBoard expects two arguments",
  );
});
it("throws an error when only one argument is given", () => {
  expect(() => GameBoardController().createGameBoard(10)).toThrow(
    "createGameBoard expects two arguments",
  );
});
it("returns a board with the width and height of the given parameters", () => {
  const height = 20;
  const width = 20;
  const board = Array(height).fill(Array(width).fill(null));
  expect(GameBoardController().createGameBoard(width, height)).toEqual(board);
});
it("throws an error when board, coordinates and ship are not given", () => {
  expect(() => GameBoardController().placeShip()).toThrow(
    "placeShip expects three arguments",
  );
});
it("throws an error when one of the arguments is not given", () => {
  expect(() => GameBoardController().placeShip({}, {})).toThrow(
    "placeShip expects three arguments",
  );
});
it("return a deep copy of the given board", () => {
  const testBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
  const testShip = {};
  const coordinates = { beginning: 0, end: 0 };
  const boardWithShip = GameBoardController().placeShip(
    coordinates,
    testShip,
    testBoard,
  );
  expect(boardWithShip).not.toEqual(testBoard);
});
it("returns a board with a ship placed at the given coordinates", () => {
  const testBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
  const testShip = { length: 5 };
  testBoard[0][0] = testShip;
  testBoard[0][1] = testShip;
  testBoard[0][2] = testShip;
  testBoard[0][3] = testShip;
  testBoard[0][4] = testShip;

  const coordinates = { beginning: 0, end: 4 };
  const boardWithOutShip = GameBoardController().createGameBoard(10, 10);
  const boardWithShip = GameBoardController().placeShip(
    coordinates,
    testShip,
    boardWithOutShip,
  );
  expect(boardWithShip).toEqual(testBoard);
});
it("returns a board with a ship placed with the axis taken into consideration", () => {
  const testBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
  const testShip = { length: 5 };
  testBoard[4][4] = testShip;
  testBoard[5][4] = testShip;
  testBoard[6][4] = testShip;
  testBoard[7][4] = testShip;
  testBoard[8][4] = testShip;

  const coordinates = { beginning: 4, end: 8, vertical: true };
  const boardWithoutShip = GameBoardController().createGameBoard(10, 10);
  const boardWithShip = GameBoardController().placeShip(
    coordinates,
    testShip,
    boardWithoutShip,
  );
  expect(boardWithShip).toEqual(testBoard);
});
it("returns a board with a ship placed when the beginning is greater than end", () => {
  const testBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
  const testShip = { length: 5 };
  testBoard[4][4] = testShip;
  testBoard[5][4] = testShip;
  testBoard[6][4] = testShip;
  testBoard[7][4] = testShip;
  testBoard[8][4] = testShip;
  const coordinates = { beginning: 8, end: 4, vertical: true };
  const boardWithOutShip = GameBoardController().createGameBoard(10, 10);
  const boardWithShip = GameBoardController().placeShip(
    coordinates,
    testShip,
    boardWithOutShip,
  );
  expect(boardWithShip).toEqual(testBoard);
});
it("returns a board with a ship placed when the beginning is equal to the end", () => {
  const testBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
  const testShip = { length: 1 };
  testBoard[4][4] = testShip;
  const coordinates = { beginning: 4, end: 4, vertical: true };
  const boardWithOutShip = GameBoardController().createGameBoard(10, 10);
  const boardWithShip = GameBoardController().placeShip(
    coordinates,
    testShip,
    boardWithOutShip,
  );
  expect(boardWithShip).toEqual(testBoard);
});
it("returns a board with a ship placed as long as it's length is equal or smaller than the difference between the coordinates when vertical is true", () => {
  const testBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
  const testShip = { length: 1 };
  testBoard[4][4] = testShip;
  const coordinates = { beginning: 4, end: 6, vertical: true };
  const boardWithOutShip = GameBoardController().createGameBoard(10, 10);
  const boardWithShip = GameBoardController().placeShip(
    coordinates,
    testShip,
    boardWithOutShip,
  );
  expect(boardWithShip).toEqual(testBoard);
});
it("throws an error if the coordinates are below the range", () => {
  const testShip = {};
  const coordinates = { beginning: -2, end: -3, vertical: true };
  const boardWithOutShip = GameBoardController().createGameBoard(10, 10);
  expect(() =>
    GameBoardController().placeShip(coordinates, testShip, boardWithOutShip),
  ).toThrow("coordinates out of range");
});
it("throws an error if the coordinates are above the range of the width when vertical is false", () => {
  const testShip = {};
  const coordinates = { beginning: 10, end: 11, vertical: false };
  const boardWithOutShip = GameBoardController().createGameBoard(10, 10);
  expect(() =>
    GameBoardController().placeShip(coordinates, testShip, boardWithOutShip),
  ).toThrow("coordinates out of range");
});
it("throws an error if the coordinates are above the range of the height when vertical is true", () => {
  const ship = {};
  const coordinates = { beginning: 8, end: 10, vertical: true };
  const boardWithOutShip = GameBoardController().createGameBoard(10, 4);
  expect(() =>
    GameBoardController().placeShip(coordinates, ship, boardWithOutShip),
  ).toThrow("coordinates out of range");
});
