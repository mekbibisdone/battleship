export default function createShip(length) {
  if (length !== undefined && length <= 0)
    throw new Error("passed length has to be greater than 0");
  if (length === undefined) throw new Error("createShip expects one argument");

  let hitCount = 0;
  const shipLength = length;

  function increaseHitCount() {
    if (hitCount === shipLength) throw new Error("Ship has already sunk");
    hitCount += 1;
    return hitCount;
  }
  function getHitCount() {
    return hitCount;
  }
  function isSunk() {
    if (hitCount === shipLength) return true;
    return false;
  }
  function getLength() {
    return length;
  }
  return { getLength, increaseHitCount, getHitCount, isSunk };
}
