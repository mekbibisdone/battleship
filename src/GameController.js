import createShipController from "./ShipController";
import createGameBoardController from "./GameBoardController";
import createAI from "./AI";
export default (function GameController() {
  const shipController = createShipController();
  const gameBoardController = createGameBoardController();
  const AI = createAI();
  const ships = [
    shipController.createShip(5),
    shipController.createShip(4),
    shipController.createShip(3),
    shipController.createShip(3),
    shipController.createShip(2),
  ];
  let AIGameBoard = placeAIShips();
  let playerGameBoard = gameBoardController.createGameBoard(10, 10);
  playerGameBoard = placePlayerShips();
  function getAIGameBoard() {
    return AIGameBoard;
  }
  function getPlayerGameBoard() {
    return playerGameBoard;
  }
  function placePlayerShips() {
    for (let i = 0; i < ships.length; i++) {
      playerGameBoard = gameBoardController.placeShip(
        { outer: 0 + i, inner: 0 },
        ships[i],
        playerGameBoard,
      );
    }
    return playerGameBoard;
  }
  function placeAIShips() {
    let AIGameBoard = gameBoardController.createGameBoard(10, 10);
    for (let ship of ships) {
      AIGameBoard = gameBoardController.placeShip(
        AI.choosePlaceCoordinates(AIGameBoard, ship, gameBoardController),
        ship,
        AIGameBoard,
      );
    }
    return AIGameBoard;
  }
  function attackAIShips(coordinates) {
    AIGameBoard = gameBoardController.receiveAttack(
      coordinates,
      AIGameBoard,
      shipController,
    );
  }
  function attackPlayerShips() {
    const coordinates = AI.chooseHitCoordinates(playerGameBoard);
    playerGameBoard = gameBoardController.receiveAttack(
      coordinates,
      playerGameBoard,
      shipController,
    );
    return coordinates;
  }
  return {
    getAIGameBoard,
    getPlayerGameBoard,
    attackAIShips,
    attackPlayerShips,
  };
})();
