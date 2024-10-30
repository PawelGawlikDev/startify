import { describe, expect, test } from "vitest"

import isValidUrl from "~utils/valudUrl"

describe("Valid url test", () => {
  test("should return true for a valid HTTP URL", () => {
    const url = "http://example.com"

    expect(isValidUrl(url)).toBe(true)
  })

  test("should return true for a valid HTTPS URL", () => {
    const url = "https://example.com"

    expect(isValidUrl(url)).toBe(true)
  })

  test("should return true for a URL with a path", () => {
    const url = "https://example.com/path/to/resource"

    expect(isValidUrl(url)).toBe(true)
  })

  test("should return true for a URL with query parameters", () => {
    const url = "https://example.com/path?name=value"

    expect(isValidUrl(url)).toBe(true)
  })

  test("should return true for a URL with a port number", () => {
    const url = "https://example.com:8080"

    expect(isValidUrl(url)).toBe(true)
  })

  test("should return false for an invalid URL without protocol", () => {
    const url = "example.com"

    expect(isValidUrl(url)).toBe(false)
  })

  test("should return false for an invalid URL with spaces", () => {
    const url = "https://exa mple.com"

    expect(isValidUrl(url)).toBe(false)
  })

  test("should return false for an empty string", () => {
    const url = ""

    expect(isValidUrl(url)).toBe(false)
  })

  test("should return false for a random string that is not a URL", () => {
    const url = "not a url"

    expect(isValidUrl(url)).toBe(false)
  })

  test("should return true for a string with special characters", () => {
    const url = "https://example.com/@@@!!!"

    expect(isValidUrl(url)).toBe(true)
  })

  test("should return true for a valid URL with special characters in the path", () => {
    const url = "https://example.com/path%20with%20spaces"

    expect(isValidUrl(url)).toBe(true)
  })

  test("should return false for a URL with only a protocol", () => {
    const url = "https://"

    expect(isValidUrl(url)).toBe(false)
  })
})
