import { rgbToHsl, isProbablyBackground, hexToHsl, isSameColorFamily, hslToHex } from "./colorHelpers"

function extractPalette(image: HTMLImageElement, quantity = 5): string[] {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return []

  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0, image.width, image.height)

  const imageData = ctx.getImageData(0, 0, image.width, image.height)
  const pixels = imageData.data
  const totalPixels = pixels.length / 4

  const colorCount: Record<string, { h: number; s: number; l: number; count: number }> = {}
  const step = 4 * 10

  for (let i = 0; i < pixels.length; i += step) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const { h, s, l } = rgbToHsl(r, g, b)
    const hslKey = `${Math.round(h / 10) * 10},${Math.round(s / 10) * 10},${Math.round(l / 10) * 10}`

    if (!colorCount[hslKey]) {
      colorCount[hslKey] = { h, s, l, count: 0 }
    }

    colorCount[hslKey].count++
  }

  const sorted = Object.entries(colorCount)
    .sort((a, b) => b[1].count - a[1].count)

  const palette: string[] = []

  for (const entry of sorted) {
    const data = entry[1]
    const { h, s, l, count } = data

    if (isProbablyBackground({ h, s, l }, count, totalPixels)) continue

    const isSimilar = palette.some(existingHex => {
      const existingHsl = hexToHsl(existingHex)
      return isSameColorFamily({ h, s, l }, existingHsl)
    })

    if (!isSimilar) {
      palette.push(hslToHex(h, s, l))
    }

    if (palette.length >= quantity) break
  }

  palette.sort((a, b) => {
    const hslA = hexToHsl(a)
    const hslB = hexToHsl(b)
    return hslA.h - hslB.h
  })

  return palette
}


export default extractPalette