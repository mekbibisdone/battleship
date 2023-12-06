import ShipController from "../src/ship";

it("throws an error when given no arguments", () => {
  expect(() => ShipController().createShip()).toThrow(
    "createShip expects one argument",
  );
});

it("throws an error when given a length of 0", () => {
  expect(() => ShipController().createShip(0)).toThrow(
    "passed length has to be greater than 0",
  );
});

it("returns a ship object with it's length equal to the passed length", () => {
  expect(ShipController().createShip(1).length).toBe(1);
});

it("increases the hit count and returns a ship", () => {
  const ship = ShipController().createShip(1);
  const hitShip = ShipController().hit(ship);
  expect(hitShip.hitCount).toBe(1);
});
it("doesn't mutate the passed ship", () => {
  const ship = ShipController().createShip(1);
  const hitShip = ShipController().hit(ship);
  expect(hitShip.hitCount).not.toBe(ship.hitCount);
});
it("throws an error if the hit count is equal to the length of the ship", () => {
  const ship = ShipController().createShip(1);
  const hitShip = ShipController().hit(ship);
  expect(() => ShipController().hit(hitShip)).toThrow("Ship has already sunk");
});

it("returns false if ship has not sunk", () => {
  const ship = ShipController().createShip(1);
  expect(ShipController().isSunk(ship)).toBe(false);
});

it("returns true if ship has sunk", () => {
  const ship = ShipController().createShip(1);
  const hitShip = ShipController().hit(ship);
  expect(ShipController().isSunk(hitShip)).toBe(true);
});
