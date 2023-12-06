export default function ShipController() {
  function createShip(length) {
    if (length !== undefined && length <= 0)
      throw new Error("passed length has to be greater than 0");
    if (length === undefined)
      throw new Error("createShip expects one argument");
    let hitCount = 0;
    return {
      length,
      hitCount,
    };
  }
  function hit(ship) {
    if (ship.length === ship.hitCount) throw new Error("Ship has already sunk");
    const shipCopy = JSON.parse(JSON.stringify(ship));
    shipCopy.hitCount += 1;
    return shipCopy;
  }
  function isSunk(ship) {
    if (ship.length !== ship.hitCount) return false;
    return true;
  }
  return { createShip, hit, isSunk };
}
