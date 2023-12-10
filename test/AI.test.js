import createAI from "../src/AI";
import createGameBoardController from "../src/GameBoardController";
import createShipController from "../src/ShipController";
describe("Choose place coordinates", () => {
  it("throws an error if there are three arguments are not given", () => {
    expect(() => createAI().choosePlaceCoordinates()).toThrow(
      "choosePlaceCoordinates expects three arguments",
    );
  });
  it("throws an error if one of the arguments is missing", () => {
    expect(() => createAI().choosePlaceCoordinates()).toThrow(
      "choosePlaceCoordinates expects three arguments",
    );
  });
  it("chooses a valid coordinates when there is no cell occupied", () => {
    const gameBoardController = createGameBoardController();
    const gameBoardWithoutShip = gameBoardController.createGameBoard(1, 1);
    const ship = createShipController().createShip(1);
    const { outer, inner } = createAI().choosePlaceCoordinates(
      gameBoardWithoutShip,
      ship,
      gameBoardController,
    );
    expect({ outer, inner }).toEqual({ outer: 0, inner: 0 });
  });
  it("chooses a valid coordinates when one cell is occupied", () => {
    const gameBoardController = createGameBoardController();
    const gameBoardWithoutShip = gameBoardController.createGameBoard(1, 2);
    const ship = createShipController().createShip(1);
    const gameBoardWithShip = gameBoardController.placeShip(
      { outer: 0, inner: 0 },
      ship,
      gameBoardWithoutShip,
    );
    const { outer, inner } = createAI().choosePlaceCoordinates(
      gameBoardWithShip,
      ship,
      gameBoardController,
    );
    expect({ outer, inner }).toEqual({ outer: 0, inner: 1 });
  });
  it("chooses a valid coordinates when two cells are occupied", () => {
    const gameBoardController = createGameBoardController();
    const gameBoardWithoutShip = gameBoardController.createGameBoard(1, 3);
    const ship = createShipController().createShip(1);
    const gameBoardWithTwoShips = gameBoardController.placeShip(
      { outer: 0, inner: 1 },
      ship,
      gameBoardController.placeShip(
        { outer: 0, inner: 0 },
        ship,
        gameBoardWithoutShip,
      ),
    );
    const { outer, inner } = createAI().choosePlaceCoordinates(
      gameBoardWithTwoShips,
      ship,
      gameBoardController,
    );
    expect({ outer, inner }).toEqual({ outer: 0, inner: 2 });
  });
  it("chooses a valid coordinates when more than two cells are occupied", () => {
    const gameBoardController = createGameBoardController();
    const gameBoardWithoutShip = gameBoardController.createGameBoard(3, 4);
    const testShip = createShipController().createShip(4);
    const gameBoardWithShips = gameBoardController.placeShip(
      { outer: 2, inner: 0 },
      testShip,
      gameBoardController.placeShip(
        { outer: 0, inner: 0 },
        testShip,
        gameBoardWithoutShip,
      ),
    );
    gameBoardWithShips.board[1][0] = {};
    gameBoardWithShips.board[1][3] = {};
    const testShipTwo = createShipController().createShip(2);
    const { outer, inner } = createAI().choosePlaceCoordinates(
      gameBoardWithShips,
      testShipTwo,
      gameBoardController,
    );
    expect({ outer, inner }).toEqual({ outer: 1, inner: 1 });
  });
  it("chooses a valid coordinates when more than two cells are occupied and vertical is set to true", () => {
    const gameBoardController = createGameBoardController();
    const gameBoardWithoutShip = gameBoardController.createGameBoard(4, 3);
    const testShip = createShipController().createShip(4);
    const gameBoardWithShips = gameBoardController.placeShip(
      { outer: 0, inner: 0, vertical: true },
      testShip,
      gameBoardController.placeShip(
        { outer: 0, inner: 2, vertical: true },
        testShip,
        gameBoardWithoutShip,
      ),
    );
    gameBoardWithShips.board[0][1] = {};
    gameBoardWithShips.board[3][1] = {};
    const testShipTwo = createShipController().createShip(2);
    const chosenCoordinates = createAI().choosePlaceCoordinates(
      gameBoardWithShips,
      testShipTwo,
      gameBoardController,
    );
    expect(chosenCoordinates).toEqual({ outer: 1, inner: 1, vertical: true });
  });
});

describe("Choose hit coordinates", () => {
  it("throws an error if one argument is not given", () => {
    expect(() => createAI().chooseHitCoordinates()).toThrow(
      "chooseHitCoordinates expects one argument",
    );
  });
  it("returns a valid hit coordinates when the board only has one cell and it's empty", () => {
    const gameBoardController = createGameBoardController();
    expect(
      createAI().chooseHitCoordinates(
        gameBoardController.createGameBoard(1, 1),
      ),
    ).toEqual({ outer: 0, inner: 0 });
  });
  it("returns a valid hit coordinates when the board has two cells and one is empty and the other is occupied", () => {
    const gameBoardController = createGameBoardController();
    const testGameBoard = gameBoardController.createGameBoard(1, 2);
    testGameBoard.board[0][0] = 1;
    expect(createAI().chooseHitCoordinates(testGameBoard)).toEqual({
      outer: 0,
      inner: 1,
    });
  });
  it("returns a valid hit coordinates when the board has more than two cells and but only one of the cells is empty", () => {
    const gameBoardController = createGameBoardController();
    const testGameBoard = gameBoardController.createGameBoard(2, 3);
    testGameBoard.board[0][0] = 1;
    testGameBoard.board[0][1] = 1;
    testGameBoard.board[0][2] = 1;
    testGameBoard.board[1][0] = 1;
    testGameBoard.board[1][2] = 1;

    expect(createAI().chooseHitCoordinates(testGameBoard)).toEqual({
      outer: 1,
      inner: 1,
    });
  });
  it("returns a valid hit coordinates when the board has more than two cells and and only one of them has a ship", () => {
    const gameBoardController = createGameBoardController();
    const testGameBoard = gameBoardController.createGameBoard(2, 3);
    testGameBoard.board[0][0] = 0;
    testGameBoard.board[0][1] = 0;
    testGameBoard.board[0][2] = 0;
    testGameBoard.board[1][0] = 0;
    testGameBoard.board[1][1] = { length: 1 };
    testGameBoard.board[1][2] = 0;
    expect(createAI().chooseHitCoordinates(testGameBoard)).toEqual({
      outer: 1,
      inner: 1,
    });
  });
});
