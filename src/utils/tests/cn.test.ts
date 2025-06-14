import { describe, expect, test } from "vitest";

import { cn } from "../cn";

describe("Merge tailwind function tests (cn)", () => {
  test("Merge multiple classes", () => {
    const result = cn("bg-red-500", "text-white", "p-4");

    expect(result).toBe("bg-red-500 text-white p-4");
  });

  test("Handle conditional classes", () => {
    /* eslint-disable-next-line no-constant-condition */
    const result = cn("bg-red-500", false ? "hidden" : null, "text-white");

    expect(result).toBe("bg-red-500 text-white");
  });

  test("Merge Tailwind classes correctly", () => {
    const result = cn("p-4", "p-6");

    expect(result).toBe("p-6");
  });

  test("Handle empty input", () => {
    const result = cn();

    expect(result).toBe("");
  });

  test("Handle undefined and null values", () => {
    const result = cn("text-white", undefined, null, "bg-blue-500");

    expect(result).toBe("text-white bg-blue-500");
  });
});
