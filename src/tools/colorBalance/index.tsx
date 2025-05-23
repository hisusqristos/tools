import { useRef, useState, useEffect, useCallback } from "react";
import { adjustColorBalance } from "./adjustColorBalance";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import BasicButton from "../../reusable/BasicButton";

const ColorBalance = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canvas for preview (visible to user)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use the hook for image handling
  const { image, handleUpload, handleDownload: originalHandleDownload, goToEditor } = useHandleFile(canvasRef);

  useIframeResize()

  // Store adjustment values in refs to avoid rerenders
  const adjustmentValues = useRef({ red: 0, green: 0, blue: 0 });

  // State is only used for controlled inputs, not for rendering logic
  const [redValue, setRedValue] = useState<number>(0);
  const [greenValue, setGreenValue] = useState<number>(0);
  const [blueValue, setBlueValue] = useState<number>(0);

  // Function to update the preview canvas
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;

    const { red, green, blue } = adjustmentValues.current;

    adjustColorBalance(
      image,
      previewCanvasRef.current,
      red,
      green,
      blue
    );
  }, [image]);

  // Handlers for slider changes that update without causing rerenders
  const handleRedChange = useCallback((value: number) => {
    adjustmentValues.current.red = value;
    setRedValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  const handleGreenChange = useCallback((value: number) => {
    adjustmentValues.current.green = value;
    setGreenValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  const handleBlueChange = useCallback((value: number) => {
    adjustmentValues.current.blue = value;
    setBlueValue(value); // Update state for UI only
    requestAnimationFrame(updatePreview); // Schedule canvas update
  }, [updatePreview]);

  // Create a custom download handler that applies adjustments before download
  const handleDownload = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const { red, green, blue } = adjustmentValues.current;

    // Apply current adjustments to the download canvas
    adjustColorBalance(
      image,
      canvasRef.current,
      red,
      green,
      blue,
      true
    );

    // Use the original download function from the hook
    originalHandleDownload();
  }, [image, originalHandleDownload]);

  const handleReset = useCallback(() => {
    adjustmentValues.current = { red: 0, green: 0, blue: 0 };
    setRedValue(0);
    setGreenValue(0);
    setBlueValue(0);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Update preview when image changes - placed after functions but before JSX
  useEffect(() => {
    if (image && previewCanvasRef.current) {
      updatePreview();
    }
  }, [image, updatePreview]);

  const sliders = [
    { id: 'red-slider', color: 'red', value: redValue, onChange: handleRedChange },
    { id: 'green-slider', color: 'green', value: greenValue, onChange: handleGreenChange },
    { id: 'blue-slider', color: 'blue', value: blueValue, onChange: handleBlueChange },
  ];

  return (
    <EditorLayout
      toolIcon="assets/color-balance.svg"
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
          <div className="flex items-center gap-4">
            {/* Range silders */}
            {sliders.map(({ id, color, value, onChange }) => (
              <div key={id} className="flex-1">
                <RangeSlider
                  id={id}
                  min={-100}
                  max={100}
                  value={value}
                  onChange={onChange}
                  color={color}
                  showTooltip={true}
                />
              </div>
            ))}

            <BasicButton children={"Reset"} color={'gray'} handleClick={handleReset} />
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

export default ColorBalance;
