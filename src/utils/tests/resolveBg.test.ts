import { describe, expect, test } from "vitest"

import { resolveBgType } from "~utils/backgroundMap"

describe("Resolve background types", () => {
  test("should return a function for a valid background type 'beams'", async () => {
    const beamsBg = resolveBgType("beams")
    expect(beamsBg).toBeInstanceOf(Function)

    const module = await beamsBg()
    expect(module).toHaveProperty("default")
  })

  test("should return a function for a valid background type 'lines'", async () => {
    const linesBg = resolveBgType("lines")
    expect(linesBg).toBeInstanceOf(Function)

    const module = await linesBg()
    expect(module).toHaveProperty("default")
  })

  test("should return a function for a valid background type 'gradient'", async () => {
    const gradientBg = resolveBgType("gradient")
    expect(gradientBg).toBeInstanceOf(Function)

    const module = await gradientBg()
    expect(module).toHaveProperty("default")
  })

  test("should return a function for a valid background type 'image'", async () => {
    const imageBg = resolveBgType("image")
    expect(imageBg).toBeInstanceOf(Function)

    const module = await imageBg()
    expect(module).toHaveProperty("default")
  })

  test("should return a function for a valid background type 'aurora'", async () => {
    const imageBg = resolveBgType("aurora")
    expect(imageBg).toBeInstanceOf(Function)

    const module = await imageBg()
    expect(module).toHaveProperty("default")
  })

  test("should return a function for a valid background type 'boxes'", async () => {
    const imageBg = resolveBgType("boxes")
    expect(imageBg).toBeInstanceOf(Function)

    const module = await imageBg()
    expect(module).toHaveProperty("default")
  })

  test("should return a function for a valid background type 'snakes'", async () => {
    const imageBg = resolveBgType("snakes")
    expect(imageBg).toBeInstanceOf(Function)

    const module = await imageBg()
    expect(module).toHaveProperty("default")
  })

  test("should return null for an invalid background type", () => {
    const invalidBg = resolveBgType("invalidType")
    expect(invalidBg).toBeNull()
  })

  test("should return null when type is not provided", () => {
    const noTypeBg = resolveBgType()
    expect(noTypeBg).toBeNull()
  })
})
