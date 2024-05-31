import { simpleMath } from "../controllers/user";

describe('testing math function', () => {
  test('empty string should result in zero', () => {
    expect(simpleMath(1,2)).toEqual(3)
  })
});