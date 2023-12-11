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
    shipController.createShip(2),
    shipController.createShip(1),
  ];
  function getShips() {
    return ships;
  }
  let AIGameBoard = placeAIShips();
  let playerGameBoard = gameBoardController.createGameBoard(10, 10);
  function getAIGameBoard() {
    return AIGameBoard;
  }
  function getPlayerGameBoard() {
    return playerGameBoard;
  }
  function placePlayerShips(coordinates) {
    playerGameBoard = gameBoardController.placeShip(
      coordinates,
      ships[playerGameBoard.ships.length],
      playerGameBoard,
    );
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
  function isGameOver() {
    if (
      gameBoardController.haveAllShipSunk(
        playerGameBoard.ships,
        shipController,
      ) ||
      gameBoardController.haveAllShipSunk(AIGameBoard.ships, shipController)
    )
      return true;
    return false;
  }
  function resetGame() {
    AIGameBoard = placeAIShips();
    playerGameBoard = gameBoardController.createGameBoard(10, 10);
  }
  return {
    getShips,
    getAIGameBoard,
    getPlayerGameBoard,
    placePlayerShips,
    attackAIShips,
    attackPlayerShips,
    isGameOver,
    resetGame,
  };
})();
