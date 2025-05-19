import { describe, expect, test } from "vitest";

import { calculateAnimationDuration } from "../calculateTimeout";

describe("Calculate animation duration", () => {
  test("should calculate duration for default speed and fps", () => {
    const duration = calculateAnimationDuration(800);

    expect(duration).toBeCloseTo(1666.67, 2);
  });

  test("should calculate duration for custom speed and fps", () => {
    const duration = calculateAnimationDuration(800, 10, 30);

    expect(duration).toBeCloseTo(2666.67, 2);
  });

  test("should return 0 for maxX equal to 0", () => {
    const duration = calculateAnimationDuration(0);

    expect(duration).toBe(0);
  });

  test("should return Infinity for speed equal to 0", () => {
    const duration = calculateAnimationDuration(800, 0);

    expect(duration).toBe(Infinity);
  });

  test("should return a very large number for fps equal to 0", () => {
    const duration = calculateAnimationDuration(800, 8, 0);

    expect(duration).toBe(Infinity);
  });
});
