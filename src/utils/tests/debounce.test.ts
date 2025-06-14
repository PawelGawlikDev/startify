import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import debounce from "../debounce";

describe("Debounce tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Delay the callback execution", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced("hello");
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(199);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledWith("hello");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Reset the timer if called again before wait time", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced("first");
    vi.advanceTimersByTime(100);
    debounced("second");
    vi.advanceTimersByTime(100);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledWith("second");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Cancel the scheduled callback with .cancel()", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced("data");
    debounced.cancel();

    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();
  });
});
