export default function createAI() {
  return { choosePlaceCoordinates, chooseHitCoordinates };
}

function choosePlaceCoordinates(gameBoard, ship, gameBoardController) {
  if (
    gameBoard === undefined ||
    ship === undefined ||
    gameBoardController === undefined
  )
    throw new Error("choosePlaceCoordinates expects three arguments");
  let outer;
  let inner;
  let vertical = false;
  let chosenCoordinates = { outer, inner, vertical };

  const tried = [];
  while (true) {
    try {
      vertical = vertical ? false : true;
      outer = Math.floor(Math.random() * gameBoard.board.length);
      inner = Math.floor(Math.random() * gameBoard.board[0].length);
      chosenCoordinates = { outer, inner, vertical };
      let checkedAlready = false;
      for (let triedCoordinates of tried) {
        if (
          chosenCoordinates.outer === triedCoordinates.outer &&
          chosenCoordinates.inner === triedCoordinates.inner &&
          chosenCoordinates.vertical === triedCoordinates.vertical
        ) {
          checkedAlready = true;
          break;
        }
      }
      if (!checkedAlready) {
        gameBoardController.placeShip(chosenCoordinates, ship, gameBoard);
        break;
      }
    } catch (e) {
      if (
        e.message === "the place of the coordinates already has a ship" ||
        e.message === "ship is too big to fit"
      ) {
        tried.push(chosenCoordinates);
        continue;
      } else {
        throw e;
      }
    }
  }
  return chosenCoordinates;
}

function chooseHitCoordinates(gameBoard) {
  if (gameBoard === undefined)
    throw new Error("chooseHitCoordinates expects one arguments");
  let outer;
  let inner;
  let chosenCoordinates = { outer, inner };
  const tried = [];
  while (true) {
    outer = Math.floor(Math.random() * gameBoard.board.length);
    inner = Math.floor(Math.random() * gameBoard.board[0].length);
    chosenCoordinates = { outer, inner };
    let checkedAlready = false;
    for (let triedCoordinates of tried) {
      if (
        chosenCoordinates.outer === triedCoordinates.outer &&
        chosenCoordinates.inner === triedCoordinates.inner
      ) {
        checkedAlready = true;
        break;
      }
    }
    if (!checkedAlready) {
      if (
        gameBoard.board[chosenCoordinates.outer][chosenCoordinates.inner] !==
          0 &&
        gameBoard.board[chosenCoordinates.outer][chosenCoordinates.inner] !== 1
      )
        break;
    }
  }
  return chosenCoordinates;
}
