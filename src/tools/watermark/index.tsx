import { useRef, useState, useEffect, useCallback } from "react";
import useHandleFile from "../../hooks/useHandleFile";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import useIframeResize from "../../hooks/useIframeResize";
import BasicButton from "../../reusable/BasicButton";

import {
  adjustWatermark,
  WatermarkOptions,
  WatermarkType,
  WatermarkPosition,
  TextAlign,
  fontOptions,
  fontStyleOptions,
  defaultWatermarkOptions
} from "./adjustWatermark";

const Watermark = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canvas for preview (visible to user)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use the hook for image handling
  const { image, handleUpload, handleDownload: originalHandleDownload } = useHandleFile(canvasRef, previewCanvasRef);

  useIframeResize()

  // Watermark image if uploading one
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);

  // Watermark options state
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>(defaultWatermarkOptions);

  // Store the actual values in a ref to avoid rerenders
  const watermarkValuesRef = useRef<WatermarkOptions>({ ...defaultWatermarkOptions });

  useIframeResize()
  // Positions for the dropdown
  const positions: { value: WatermarkPosition; label: string }[] = [
    { value: 'topLeft', label: 'Top Left' },
    { value: 'topCenter', label: 'Top Center' },
    { value: 'topRight', label: 'Top Right' },
    { value: 'centerLeft', label: 'Center Left' },
    { value: 'center', label: 'Center' },
    { value: 'centerRight', label: 'Center Right' },
    { value: 'bottomLeft', label: 'Bottom Left' },
    { value: 'bottomCenter', label: 'Bottom Center' },
    { value: 'bottomRight', label: 'Bottom Right' }
  ];

  // Watermark type options
  const watermarkTypes: { value: WatermarkType; label: string }[] = [
    { value: 'text', label: 'Text Watermark' },
    { value: 'image', label: 'Image Watermark' }
  ];

  // Text alignment options
  const textAlignOptions: { value: TextAlign; label: string }[] = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ];

  // Function to update the preview canvas
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;

    // If watermark type is 'image', make sure we have the image in options
    const options = { ...watermarkValuesRef.current };
    if (options.type === 'image') {
      options.image = watermarkImage || undefined;
    }

    adjustWatermark(
      image,
      previewCanvasRef.current,
      options
    );
  }, [image, watermarkImage]);

  // Generic option update handler
  const updateOption = useCallback((key: keyof WatermarkOptions, value: any) => {
    watermarkValuesRef.current = {
      ...watermarkValuesRef.current,
      [key]: value
    };

    setWatermarkOptions(prev => ({
      ...prev,
      [key]: value
    }));

    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Handle type change
  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as WatermarkType;
    updateOption('type', newType);
  }, [updateOption]);

  // Handle text input change
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateOption('text', e.target.value);
  }, [updateOption]);

  // Handle position change
  const handlePositionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOption('position', e.target.value as WatermarkPosition);
  }, [updateOption]);

  // Handle opacity change
  const handleOpacityChange = useCallback((value: number) => {
    updateOption('opacity', value);
  }, [updateOption]);

  // Handle padding change
  const handlePaddingChange = useCallback((value: number) => {
    updateOption('padding', value);
  }, [updateOption]);

  // Handle text font change
  const handleFontChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOption('textFont', e.target.value);
  }, [updateOption]);

  // Handle text size change
  const handleTextSizeChange = useCallback((value: number) => {
    updateOption('textSize', value);
  }, [updateOption]);

  // Handle text color change
  const handleTextColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateOption('textColor', e.target.value);
  }, [updateOption]);

  // Handle text style change
  const handleTextStyleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOption('textStyle', e.target.value);
  }, [updateOption]);

  // Handle text align change
  const handleTextAlignChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOption('textAlign', e.target.value as TextAlign);
  }, [updateOption]);

  // Handle image size change
  const handleImageSizeChange = useCallback((value: number) => {
    updateOption('imageSize', value);
  }, [updateOption]);

  // Handle watermark image upload
  const handleWatermarkImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.match('image.*')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setWatermarkImage(img);
        updateOption('image', img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [updateOption]);

  // Create a custom download handler that applies watermark before download
  const handleDownload = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const options = { ...watermarkValuesRef.current };
    if (options.type === 'image') {
      options.image = watermarkImage || undefined;
    }

    // Apply current watermark to the download canvas
    adjustWatermark(
      image,
      canvasRef.current,
      options,
      true
    );

    // Use the original download function from the hook
    originalHandleDownload();
  }, [image, originalHandleDownload, watermarkImage]);

  // Reset watermark options to default
  const handleReset = useCallback(() => {
    const defaultOptions = { ...defaultWatermarkOptions };
    watermarkValuesRef.current = defaultOptions;
    setWatermarkOptions(defaultOptions);
    setWatermarkImage(null);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Update preview when image changes
  useEffect(() => {
    if (image && previewCanvasRef.current) {
      updatePreview();
    }
  }, [image, updatePreview]);

  return (
    <EditorLayout
      toolIcon="assets/watermark.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
    >
      <canvas ref={canvasRef} className="hidden" />

      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4">
          {/* Preview canvas area */}
          <div className="w-full md:w-2/3 flex justify-center">
            <div>
              <canvas
                ref={previewCanvasRef}
                className="max-w-full max-h-full rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Controls area */}
          <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Watermark Settings</h3>

            {/* Reset button */}
            <div className="text-right mb-4">
              <BasicButton label={"Reset"} color={'gray'} handleClick={handleReset} />
            </div>

            {/* Watermark type selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Watermark Type
              </label>
              <select
                value={watermarkOptions.type}
                onChange={handleTypeChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {watermarkTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Watermark position selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                value={watermarkOptions.position}
                onChange={handlePositionChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {positions.map(pos => (
                  <option key={pos.value} value={pos.value}>{pos.label}</option>
                ))}
              </select>
            </div>

            {/* Opacity slider */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacity: {watermarkOptions.opacity}%
              </label>
              <RangeSlider
                min={10}
                max={100}
                step={5}
                value={watermarkOptions.opacity}
                onChange={handleOpacityChange}
              />
            </div>

            {/* Padding slider */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Padding: {watermarkOptions.padding}px
              </label>
              <RangeSlider
                min={0}
                max={50}
                step={2}
                value={watermarkOptions.padding}
                onChange={handlePaddingChange}
              />
            </div>

            {/* Text watermark options */}
            {watermarkOptions.type === 'text' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkOptions.text || ''}
                    onChange={handleTextChange}
                    placeholder="Enter watermark text"
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font
                  </label>
                  <select
                    value={watermarkOptions.textFont}
                    onChange={handleFontChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Style
                    </label>
                    <select
                      value={watermarkOptions.textStyle}
                      onChange={handleTextStyleChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {fontStyleOptions.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alignment
                    </label>
                    <select
                      value={watermarkOptions.textAlign}
                      onChange={handleTextAlignChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {textAlignOptions.map(align => (
                        <option key={align.value} value={align.value}>{align.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Size: {watermarkOptions.textSize}px
                  </label>
                  <RangeSlider
                    min={10}
                    max={72}
                    step={2}
                    value={watermarkOptions.textSize || 24}
                    onChange={handleTextSizeChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={watermarkOptions.textColor || '#ffffff'}
                      onChange={handleTextColorChange}
                      className="w-8 h-8 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {watermarkOptions.textColor || '#ffffff'}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Image watermark options */}
            {watermarkOptions.type === 'image' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Watermark Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      onChange={handleWatermarkImageUpload}
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                  {watermarkImage && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Image loaded ({watermarkImage.width}x{watermarkImage.height})</p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size: {watermarkOptions.imageSize}%
                  </label>
                  <RangeSlider
                    min={5}
                    max={50}
                    step={5}
                    value={watermarkOptions.imageSize || 20}
                    onChange={handleImageSizeChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </EditorLayout>
  );
};

export default Watermark; 