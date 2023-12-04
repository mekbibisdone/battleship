import createShip from "../src/ship";

it("throws an error when given no arguments", () => {
  expect(() => createShip()).toThrow("createShip expects one argument");
});

it("throws an error when given a length of 0", () => {
  expect(() => createShip(0)).toThrow("passed length has to be greater than 0");
});

it("ship object's length is equal to the passed length", () => {
  expect(createShip(1).getLength()).toBe(1);
});

it("increases the hit count when hit method is called", () => {
  const ship = createShip(1);
  ship.increaseHitCount();
  expect(ship.getHitCount()).toBe(1);
});

it("throws an error if the hit count is equal to the length of the ship", () => {
  const ship = createShip(1);
  ship.increaseHitCount();
  expect(() => ship.increaseHitCount()).toThrow("Ship has already sunk");
});

it("returns false if ship has not sunk", () => {
  expect(createShip(1).isSunk()).toBe(false);
});

it("returns true if ship has sunk", () => {
  const ship = createShip(1);
  ship.increaseHitCount();
  expect(ship.isSunk()).toBe(true);
});
