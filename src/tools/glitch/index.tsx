import { useRef, useState, useEffect, useCallback } from "react";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import { adjustGlitch } from "./adjustGlitch";

const Glitch = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canvas for preview (visible to user)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Use the hook for image handling
  const { image, handleUpload, handleDownload: originalHandleDownload } = useHandleFile(canvasRef);
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
  
  return (
    <EditorLayout
      toolIcon="assets/glitch.svg"
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
            {/* First row of sliders */}
            <div className="flex items-center gap-4 mb-4">
              {/* RGB Shift Slider */}
              <div className="flex-1">
                <RangeSlider
                  id="rgb-shift-slider"
                  min={0}
                  max={100}
                  value={rgbShiftValue}
                  onChange={handleRgbShiftChange}
                  color="red"
                  label="RGB Shift"
                  showTooltip={true}
                />
              </div>
              
              {/* Scanlines Slider */}
              <div className="flex-1">
                <RangeSlider
                  id="scanlines-slider"
                  min={0}
                  max={100}
                  value={scanlinesValue}
                  onChange={handleScanlinesChange}
                  color="blue"
                  label="Scanlines"
                  showTooltip={true}
                />
              </div>
            </div>
            
            {/* Second row of sliders */}
            <div className="flex items-center gap-4">
              {/* Noise Slider */}
              <div className="flex-1">
                <RangeSlider
                  id="noise-slider"
                  min={0}
                  max={100}
                  value={noiseValue}
                  onChange={handleNoiseChange}
                  color="green"
                  label="Noise"
                  showTooltip={true}
                />
              </div>
              
              {/* Blocks Slider */}
              <div className="flex-1">
                <RangeSlider
                  id="blocks-slider"
                  min={0}
                  max={100}
                  value={blocksValue}
                  onChange={handleBlocksChange}
                  color="purple"
                  label="Block Glitch"
                  showTooltip={true}
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleRandomGlitch}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Random
                </button>
                
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reset
                </button>
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