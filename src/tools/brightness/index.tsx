import { useRef, useState, useEffect, useCallback } from "react";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import { adjustBrightness } from "./adjustBrightness";
import BasicButton from "../../reusable/BasicButton";

const Brightness = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload: originalHandleDownload, goToEditor } = useHandleFile(canvasRef);
  useIframeResize()

  // Store adjustment values in refs to avoid rerenders
  const adjustmentValues = useRef({ brightness: 0, contrast: 0 });

  // State is only used for controlled inputs, not for rendering logic
  const [brightnessValue, setBrightnessValue] = useState<number>(0);
  const [contrastValue, setContrastValue] = useState<number>(0);

  // Function to update the preview canvas
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;

    const { brightness, contrast } = adjustmentValues.current;

    adjustBrightness(
      image,
      previewCanvasRef.current,
      brightness,
      contrast
    );
  }, [image]);

  // Handlers for slider changes that update without causing rerenders
  const handleBrightnessChange = useCallback((value: number) => {
    adjustmentValues.current.brightness = value;
    setBrightnessValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  const handleContrastChange = useCallback((value: number) => {
    adjustmentValues.current.contrast = value;
    setContrastValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  // Create a custom download handler that applies adjustments before download
  const handleDownload = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const { brightness, contrast } = adjustmentValues.current;

    // Apply current adjustments to the download canvas
    adjustBrightness(
      image,
      canvasRef.current,
      brightness,
      contrast,
      true
    );

    // Use the original download function from the hook
    originalHandleDownload();
  }, [image, originalHandleDownload]);

  const handleReset = useCallback(() => {
    adjustmentValues.current = { brightness: 0, contrast: 0 };
    setBrightnessValue(0);
    setContrastValue(0);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Update preview when image changes - placed after functions but before JSX
  useEffect(() => {
    if (image && previewCanvasRef.current) {
      updatePreview();
    }
  }, [image, updatePreview]);

  const sliders = [
    { id: "brightness-slider", label: "Brightness", min: -100, max: 100, value: brightnessValue, onChange: handleBrightnessChange, color: "purple", },
    { id: "contrast-slider", label: "Contrast", min: -100, max: 100, value: contrastValue, onChange: handleContrastChange, color: "gray", },
  ];

  return (
    <EditorLayout
      toolIcon="assets/brightness-contrast.svg"
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
            <div className="flex items-center gap-4">
              {sliders.map(({ id, label, min, max, value, onChange, color }) => (
                <div key={id} className="flex-1 min-w-[200px]">
                  <RangeSlider
                    id={id}
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    color={color}
                    label={label}
                    showTooltip={true}
                  />
                </div>
              ))}

              {/* Reset Button */}
              <BasicButton children={"Reset"} color={'gray'} handleClick={handleReset} />
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

export default Brightness; 