# Image Editor Tools Refactoring Guide

This document outlines the plan to refactor all tools to use the shared canvas utilities from `src/utils/canvasUtils.ts`.

## Completed Refactorings

1. ✅ **ColorBalance**: Refactored to use `applyCanvasOperation` and other utilities.
   - `adjustColorBalance.ts` - Uses `applyCanvasOperation` and `processImageData`
   - `index.tsx` - Uses `createAnimationFrameUpdater`

2. ✅ **Brightness/Contrast**: Refactored to use `applyCanvasOperation` and other utilities.
   - `adjustBrightness.ts` - Uses `applyCanvasOperation` and `processImageData`
   - `index.tsx` - Uses `createAnimationFrameUpdater`

3. ✅ **Glitch Effects**: Refactored to use `applyCanvasOperation` and other utilities.
   - `adjustGlitch.ts` - Uses `applyCanvasOperation`, `getPixelData`, and `putPixelData`
   - `index.tsx` - Uses `createAnimationFrameUpdater`

4. ✅ **Grayscale**: Refactored to use `applyCanvasOperation` and other utilities.
   - `toGrayscale.ts` - Uses `applyCanvasOperation` and `processImageData`

5. ✅ **Filters**: Refactored to use `applyCanvasOperation` and other utilities.
   - `adjustFilters.ts` - Uses `applyCanvasOperation`, `getPixelData` and `putPixelData`

## Pending Refactorings

6. ⬜ **Flip/Rotate**: 
   - `FlipTransformer.tsx` - Should be refactored to use canvas utilities where applicable
   - `Flip.tsx` - Should use `createAnimationFrameUpdater`

7. ⬜ **Text Overlay**:
   - `adjustText.ts` - Should use `applyCanvasOperation` and canvas utilities
   - `index.tsx` - Should use `createAnimationFrameUpdater`

8. ⬜ **Watermark**:
   - `adjustWatermark.ts` - Should use `applyCanvasOperation` and canvas utilities
   - `index.tsx` - Should use `createAnimationFrameUpdater`

## Refactoring Pattern

For each tool, follow this pattern:

1. **Adjustment Functions**:
   - Import utility functions from `canvasUtils`
   - Replace canvas setup code with `setupCanvas`
   - Replace image drawing with `drawImage`
   - Replace pixel access with `getPixelData` and `putPixelData`
   - Use `processImageData` for pixel-by-pixel operations
   - Wrap core functionality in `applyCanvasOperation`

2. **Component Files**:
   - Import `createAnimationFrameUpdater` from `canvasUtils`
   - Replace direct `requestAnimationFrame` calls with the utility
   - Update any `useCallback` dependencies

## Benefits of Refactoring

- **Reduced Duplication**: Common canvas operations are centralized
- **Improved Performance**: Optimized canvas operations and animation frame scheduling
- **Better Maintainability**: Changes to canvas handling can be made in one place
- **Consistent Patterns**: All tools follow the same architecture
- **Better Type Safety**: Shared utilities have proper TypeScript typing

## Testing After Refactoring

After refactoring each tool, verify:
1. The tool functions as before
2. There are no regressions in UI behavior
3. Performance is maintained or improved 