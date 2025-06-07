import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import debounce from "../debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should delay the callback execution", () => {
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

  it("should reset the timer if called again before wait time", () => {
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

  it("should cancel the scheduled callback with .cancel()", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced("data");
    debounced.cancel();

    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();
  });
});
