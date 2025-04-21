export function hslToHex(h: number, s: number, l: number): string {
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2

    let r = 0, g = 0, b = 0
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

export function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break
            case g: h = ((b - r) / d + 2); break
            case b: h = ((r - g) / d + 4); break
        }
        h *= 60
    }

    return { h, s: s * 100, l: l * 100 }
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = hexToRgb(hex)
    return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const n = parseInt(hex.slice(1), 16)
    return {
        r: (n >> 16) & 255,
        g: (n >> 8) & 255,
        b: n & 255,
    }
}

export function isProbablyBackground(
    { h, s, l }: { h: number; s: number; l: number },
    pixelCount: number,
    totalPixels: number
): boolean {
    const ratio = pixelCount / totalPixels

    const isLowSat = s < 15
    const isExtremeLight = l > 90 || l < 10
    const isVeryCommon = ratio > 0.2

    return (isLowSat && isVeryCommon) || isExtremeLight
}

export function isSameColorFamily(
    a: { h: number; s: number; l: number },
    b: { h: number; s: number; l: number },
    hThreshold = 20, sThreshold = 20, lThreshold = 20
): boolean {
    const hDiff = Math.abs(a.h - b.h)
    const sDiff = Math.abs(a.s - b.s)
    const lDiff = Math.abs(a.l - b.l)

    return hDiff < hThreshold && sDiff < sThreshold && lDiff < lThreshold
}
