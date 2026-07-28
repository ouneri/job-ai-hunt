import { describe, expect, test } from "@jest/globals";
import { isRateLimited } from "./route";

describe("isRateLimited", () => {
  test("проверка нового айпишника с которого не банит", () => {
    expect(isRateLimited('1.2.3.4')).toBe(false);
  });
});
