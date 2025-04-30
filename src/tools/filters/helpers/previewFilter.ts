import { applySepia, applyVintage, applyNoir, applyCool, applyWarm, applyFaded, applyDramatic, applyPolaroid, applyEmerald, applyDusk } from "../applyFilter";
import { drawScaledImage } from "../../../reusable/drawScaledImage";
import { FilterType } from "../adjustFilters";

function previewFilter(filter: FilterType, image: HTMLImageElement): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return image.src;

    drawScaledImage(canvas, image, 100);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    const intensity = 0.7;
    switch (filter) {
        case "sepia":
            applySepia(data, intensity);
            break;
        case "vintage":
            applyVintage(data, intensity);
            break;
        case "noir":
            applyNoir(data, intensity);
            break;
        case "cool":
            applyCool(data, intensity);
            break;
        case "warm":
            applyWarm(data, intensity);
            break;
        case "faded":
            applyFaded(data, intensity);
            break;
        case "emerald":
            applyEmerald(data, intensity);
            break;
        case "dramatic":
            applyDramatic(data, intensity);
            break;
        case "polaroid":
            applyPolaroid(data, intensity, canvas.width, canvas.height);
            break;
        case "dusk":
            applyDusk(data, intensity);
            break;
        default:
            return image.src;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
}

export { previewFilter }