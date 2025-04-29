import { useRef, useState, useEffect, useCallback } from "react";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import { adjustBrightness } from "./adjustBrightness";

const Brightness = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canvas for preview (visible to user)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Use the hook for image handling
  const { image, handleUpload, handleDownload: originalHandleDownload } = useHandleFile(canvasRef);

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
  
  return (
    <EditorLayout
      toolIcon="assets/brightness-contrast.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
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
              {/* Brightness Slider */}
              <div className="flex-1">
                <RangeSlider
                  id="brightness-slider"
                  min={-100}
                  max={100}
                  value={brightnessValue}
                  onChange={handleBrightnessChange}
                  color="purple"
                  showTooltip={true}
                />
              </div>
              
              {/* Contrast Slider */}
              <div className="flex-1">
                <RangeSlider
                  id="contrast-slider"
                  min={-100}
                  max={100}
                  value={contrastValue}
                  onChange={handleContrastChange}
                  color="gray"
                  showTooltip={true}
                />
              </div>
              
              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reset
              </button>
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