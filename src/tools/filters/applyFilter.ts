function applySepia(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const newR = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
        const newG = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
        const newB = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);

        data[i] = r * (1 - intensity) + newR * intensity;
        data[i + 1] = g * (1 - intensity) + newG * intensity;
        data[i + 2] = b * (1 - intensity) + newB * intensity;
    }
}


function applyVintage(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const newR = Math.min(255, r * 1.1);
        const newG = g * 0.9;
        const newB = b * 0.9;

        const blendR = 0.8 * r + 0.2 * g;
        const blendG = 0.8 * g + 0.1 * r + 0.1 * b;
        const blendB = 0.8 * b + 0.2 * g;

        data[i] = r * (1 - intensity) + (newR * 0.7 + blendR * 0.3) * intensity;
        data[i + 1] = g * (1 - intensity) + (newG * 0.7 + blendG * 0.3) * intensity;
        data[i + 2] = b * (1 - intensity) + (newB * 0.7 + blendB * 0.3) * intensity;
    }
}


function applyNoir(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const gray = 0.3 * r + 0.59 * g + 0.11 * b;

        data[i] = r * (1 - intensity) + gray * intensity;
        data[i + 1] = g * (1 - intensity) + gray * intensity;
        data[i + 2] = b * (1 - intensity) + gray * intensity;
    }
}


function applyCool(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const newR = r * 0.9;
        const newG = g * 1.0;
        const newB = Math.min(255, b * 1.2);

        data[i] = r * (1 - intensity) + newR * intensity;
        data[i + 1] = g * (1 - intensity) + newG * intensity;
        data[i + 2] = b * (1 - intensity) + newB * intensity;
    }
}


function applyWarm(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const newR = Math.min(255, r * 1.2);
        const newG = Math.min(255, g * 1.1);
        const newB = b * 0.8;

        data[i] = r * (1 - intensity) + newR * intensity;
        data[i + 1] = g * (1 - intensity) + newG * intensity;
        data[i + 2] = b * (1 - intensity) + newB * intensity;
    }
}


function applyEmerald(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const newR = r * 0.9 + g * 0.1;
        const newG = Math.min(255, g * 1.2);
        const newB = b * 0.6 + g * 0.2;

        data[i] = r * (1 - intensity) + newR * intensity;
        data[i + 1] = g * (1 - intensity) + newG * intensity;
        data[i + 2] = b * (1 - intensity) + newB * intensity;
    }
}


function applyDusk(data: Uint8ClampedArray, intensity: number): void {
    applyFaded(data, 1)

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const newR = r * 0.5 + b * 0.1;
        const newG = g * 0.6 + b * 0.1;
        const newB = Math.min(255, b * 1.1);

        data[i] = r * (1 - intensity) + newR * intensity;
        data[i + 1] = g * (1 - intensity) + newG * intensity;
        data[i + 2] = b * (1 - intensity) + newB * intensity;
    }

}


function applyFaded(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const avgColor = (r + g + b) / 3;
        const newR = r * 0.7 + avgColor * 0.3;
        const newG = g * 0.7 + avgColor * 0.3;
        const newB = b * 0.7 + avgColor * 0.3;

        const finalR = Math.min(255, newR * 0.9 + 20);
        const finalG = Math.min(255, newG * 0.9 + 20);
        const finalB = Math.min(255, newB * 0.9 + 20);

        data[i] = r * (1 - intensity) + finalR * intensity;
        data[i + 1] = g * (1 - intensity) + finalG * intensity;
        data[i + 2] = b * (1 - intensity) + finalB * intensity;
    }
}

function applyDramatic(data: Uint8ClampedArray, intensity: number): void {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const enhanceContrast = (color: number) => {
            if (color < 128) {
                return color * (1 - 0.5 * intensity);
            } else {
                return color + (255 - color) * 0.5 * intensity;
            }
        };

        const newR = enhanceContrast(r);
        const newG = enhanceContrast(g);
        const newB = enhanceContrast(b);

        const avg = (newR + newG + newB) / 3;
        const finalR = Math.min(255, avg + (newR - avg) * 1.3);
        const finalG = Math.min(255, avg + (newG - avg) * 1.3);
        const finalB = Math.min(255, avg + (newB - avg) * 1.3);

        data[i] = r * (1 - intensity) + finalR * intensity;
        data[i + 1] = g * (1 - intensity) + finalG * intensity;
        data[i + 2] = b * (1 - intensity) + finalB * intensity;
    }
}


function applyPolaroid(data: Uint8ClampedArray, intensity: number, width?: number, height?: number): void {
    let w = width || Math.sqrt(data.length / 4);
    let h = height || (data.length / 4) / w;

    const centerX = w / 2;
    const centerY = h / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;

            if (i >= data.length) continue;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const newR = Math.min(255, r * 1.1);
            const newG = g * 1.0;
            const newB = b * 0.9;

            const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const vignetteAmount = Math.pow(1 - distanceFromCenter / maxDistance, 1.5) * 0.8 + 0.2;

            const finalR = newR * vignetteAmount;
            const finalG = newG * vignetteAmount;
            const finalB = newB * vignetteAmount;

            data[i] = r * (1 - intensity) + finalR * intensity;
            data[i + 1] = g * (1 - intensity) + finalG * intensity;
            data[i + 2] = b * (1 - intensity) + finalB * intensity;
        }
    }
}


export { applySepia, applyVintage, applyNoir, applyCool, applyWarm, applyEmerald, applyFaded, applyDusk, applyDramatic, applyPolaroid }