import { it, describe, expect, vi, beforeEach } from "vitest";

const mockSetItem = vi.fn();
const mockGetItem = vi.fn();

vi.stubGlobal("localStorage", {
  setItem: mockSetItem,
  getItem: mockGetItem,
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  get length() {
    return 0;
  }
});

import { getLocalStorageItem, setLocalStorageItem } from "../storage";

describe("storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLocalStorageItem", () => {
    it("should return default value if key does not exist", () => {
      mockGetItem.mockReturnValue(null);
      const result = getLocalStorageItem("nonExistingKey", "default");
      expect(result).toBe("default");
    });

    it("should return stored value", () => {
      mockGetItem.mockReturnValue(JSON.stringify({ a: 1 }));
      const result = getLocalStorageItem("testKey", { a: 0 });
      expect(result).toEqual({ a: 1 });
    });

    it("should return default value if stored value is invalid JSON", () => {
      mockGetItem.mockReturnValue("not a json");
      const result = getLocalStorageItem("invalidKey", { a: 0 });
      expect(result).toEqual({ a: 0 });
    });
  });

  describe("setLocalStorageItem", () => {
    it("should store string value", () => {
      mockSetItem.mockImplementation(() => {
        return undefined;
      });

      const success = setLocalStorageItem("stringKey", "stringValue");
      expect(success).toBe(true);
      expect(mockSetItem).toHaveBeenCalledWith("stringKey", "stringValue");
    });

    it("should store object value", () => {
      mockSetItem.mockImplementation(() => {
        return undefined;
      });

      const obj = { b: 2 };
      const success = setLocalStorageItem("objectKey", obj);
      expect(success).toBe(true);
      expect(mockSetItem).toHaveBeenCalledWith(
        "objectKey",
        JSON.stringify(obj)
      );
    });

    it("should return false if storage fails", () => {
      mockSetItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const success = setLocalStorageItem("failKey", "value");
      expect(success).toBe(false);
    });
  });
});
