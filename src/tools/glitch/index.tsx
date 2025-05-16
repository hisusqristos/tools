import { useRef, useState, useEffect, useCallback } from "react";
import { adjustGlitch } from "./adjustGlitch";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import BasicButton from "../../reusable/BasicButton";

const Glitch = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canvas for preview (visible to user)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use the hook for image handling
  const { image, handleUpload, handleDownload: originalHandleDownload, goToEditor } = useHandleFile(canvasRef);
  useIframeResize()

  // Store adjustment values in refs to avoid rerenders
  const adjustmentValues = useRef({
    rgbShift: 0,
    scanlines: 0,
    noise: 0,
    blocks: 0
  });

  // State is only used for controlled inputs, not for rendering logic
  const [rgbShiftValue, setRgbShiftValue] = useState<number>(0);
  const [scanlinesValue, setScanlinesValue] = useState<number>(0);
  const [noiseValue, setNoiseValue] = useState<number>(0);
  const [blocksValue, setBlocksValue] = useState<number>(0);

  // Function to update the preview canvas
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;

    const { rgbShift, scanlines, noise, blocks } = adjustmentValues.current;

    adjustGlitch(
      image,
      previewCanvasRef.current,
      rgbShift,
      scanlines,
      noise,
      blocks
    );
  }, [image]);

  // Handlers for slider changes that update without causing rerenders
  const handleRgbShiftChange = useCallback((value: number) => {
    adjustmentValues.current.rgbShift = value;
    setRgbShiftValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  const handleScanlinesChange = useCallback((value: number) => {
    adjustmentValues.current.scanlines = value;
    setScanlinesValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  const handleNoiseChange = useCallback((value: number) => {
    adjustmentValues.current.noise = value;
    setNoiseValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  const handleBlocksChange = useCallback((value: number) => {
    adjustmentValues.current.blocks = value;
    setBlocksValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  // Create a custom download handler that applies adjustments before download
  const handleDownload = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const { rgbShift, scanlines, noise, blocks } = adjustmentValues.current;

    // Apply current adjustments to the download canvas
    adjustGlitch(
      image,
      canvasRef.current,
      rgbShift,
      scanlines,
      noise,
      blocks,
      true
    );

    // Use the original download function from the hook
    originalHandleDownload();
  }, [image, originalHandleDownload]);

  const handleReset = useCallback(() => {
    adjustmentValues.current = {
      rgbShift: 0,
      scanlines: 0,
      noise: 0,
      blocks: 0
    };
    setRgbShiftValue(0);
    setScanlinesValue(0);
    setNoiseValue(0);
    setBlocksValue(0);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Random glitch effect preset
  const handleRandomGlitch = useCallback(() => {
    const randomRgb = Math.floor(Math.random() * 80);
    const randomScanlines = Math.floor(Math.random() * 70);
    const randomNoise = Math.floor(Math.random() * 60);
    const randomBlocks = Math.floor(Math.random() * 50);

    adjustmentValues.current = {
      rgbShift: randomRgb,
      scanlines: randomScanlines,
      noise: randomNoise,
      blocks: randomBlocks
    };

    setRgbShiftValue(randomRgb);
    setScanlinesValue(randomScanlines);
    setNoiseValue(randomNoise);
    setBlocksValue(randomBlocks);

    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Update preview when image changes - placed after functions but before JSX
  useEffect(() => {
    if (image && previewCanvasRef.current) {
      updatePreview();
    }
  }, [image, updatePreview]);

  const sliders = [
    { id: "rgb-shift-slider", label: "RGB Shift", value: rgbShiftValue, onChange: handleRgbShiftChange, color: "red", },
    { id: "scanlines-slider", label: "Scanlines", value: scanlinesValue, onChange: handleScanlinesChange, color: "blue", },
    { id: "noise-slider", label: "Noise", value: noiseValue, onChange: handleNoiseChange, color: "green", },
    { id: "blocks-slider", label: "Block Glitch", value: blocksValue, onChange: handleBlocksChange, color: "purple", },
  ];

  return (
    <EditorLayout
      toolIcon="assets/glitch.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
      goToEditor={goToEditor}
    >
      {/* Hidden canvas used by useHandleFile hook for export */}
      <canvas ref={canvasRef} className="hidden" />

      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <div className="flex flex-col w-full max-w-4xl gap-6">
          {/* Controls section - horizontal layout */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            {/* First row of sliders */}
            <div className="flex items-center gap-4 mb-4">

              {sliders.map(({ id, label, value, onChange, color }) => (
                <div key={id} className="flex-1 min-w-[200px]">
                  <RangeSlider
                    id={id}
                    min={0}
                    max={100}
                    value={value}
                    onChange={onChange}
                    color={color}
                    label={label}
                    showTooltip={true}
                  />
                </div>
              ))}

              {/* Action buttons */}
              <div className="flex gap-2">
                <BasicButton children={"Random"} color={'purple'} handleClick={handleRandomGlitch} />
                <BasicButton children={"Reset"} color={'gray'} handleClick={handleReset} />
              </div>
            </div>
          </div>

          {/* Preview canvas - visible to user */}
          <div className="w-full flex justify-center">
            <canvas
              ref={previewCanvasRef}
              className="max-w-full rounded-lg shadow-md"
              style={{
                maxHeight: '600px',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}
    </EditorLayout>
  );
};

export default Glitch; 