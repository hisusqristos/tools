import { useRef, useState, useEffect, useCallback } from "react";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import { 
  adjustText, 
  TextOptions, 
  TextAlign, 
  fontOptions, 
  fontStyleOptions,
  defaultTextOptions 
} from "./adjustText";

const Text = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canvas for preview (visible to user)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Use the hook for image handling
  const { image, handleUpload, handleDownload: originalHandleDownload, goToEditor } = useHandleFile(canvasRef);

  useIframeResize()
  
  // Text input state
  const [textInput, setTextInput] = useState<string>('Add your text here');
  
  // Text styling options
  const [textOptions, setTextOptions] = useState<TextOptions>(defaultTextOptions);
  
  // Store the actual values in a ref to avoid rerenders
  const textValuesRef = useRef({
    text: textInput,
    options: textOptions
  });
  
  // Function to update the preview canvas
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;
    
    const { text, options } = textValuesRef.current;
    
    adjustText(
      image,
      previewCanvasRef.current,
      text,
      options
    );
  }, [image]);
  
  // Text input change handler
  const handleTextInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    textValuesRef.current.text = newText;
    setTextInput(newText);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);
  
  // Generic handler for updating text options
  const updateTextOption = useCallback(<K extends keyof TextOptions>(
    key: K, 
    value: TextOptions[K]
  ) => {
    textValuesRef.current.options = {
      ...textValuesRef.current.options,
      [key]: value
    };
    
    setTextOptions(prev => ({
      ...prev,
      [key]: value
    }));
    
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);
  
  // Position update handler (for x and y sliders)
  const updatePosition = useCallback((axis: 'x' | 'y', value: number) => {
    textValuesRef.current.options.position = {
      ...textValuesRef.current.options.position,
      [axis]: value
    };
    
    setTextOptions(prev => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: value
      }
    }));
    
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);
  
  // Effect update handler (for shadow and outline checkboxes)
  const updateEffect = useCallback((effect: keyof TextOptions['effects'], value: boolean | string | number) => {
    textValuesRef.current.options.effects = {
      ...textValuesRef.current.options.effects,
      [effect]: value
    };
    
    setTextOptions(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effect]: value
      }
    }));
    
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Create a custom download handler that applies text overlay before download
  const handleDownload = useCallback(() => {
    if (!image || !canvasRef.current) return;
    
    const { text, options } = textValuesRef.current;

    // Apply text overlay to the download canvas
    adjustText(
      image, 
      canvasRef.current, 
      text,
      options,
      true
    );
    
    // Use the original download function from the hook
    originalHandleDownload();
  }, [image, originalHandleDownload]);

  // Update preview when image changes or component mounts
  useEffect(() => {
    if (image && previewCanvasRef.current) {
      updatePreview();
    }
  }, [image, updatePreview]);
  
  return (
    <EditorLayout
      toolIcon="assets/text.svg"
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
          {/* Text controls */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            {/* Text input */}
            <div className="mb-4">
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                id="text-input"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={textInput}
                onChange={handleTextInputChange}
                placeholder="Enter your text here"
              />
            </div>
            
            {/* Font controls row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Font family */}
              <div>
                <label htmlFor="font-family" className="block text-sm font-medium text-gray-700 mb-1">
                  Font
                </label>
                <select
                  id="font-family"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={textOptions.fontFamily}
                  onChange={(e) => updateTextOption('fontFamily', e.target.value)}
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Font style */}
              <div>
                <label htmlFor="font-style" className="block text-sm font-medium text-gray-700 mb-1">
                  Style
                </label>
                <select
                  id="font-style"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={textOptions.fontStyle}
                  onChange={(e) => updateTextOption('fontStyle', e.target.value)}
                >
                  {fontStyleOptions.map(style => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Font size */}
              <div>
                <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="font-size"
                    className="w-20 p-2 border border-gray-300 rounded-md mr-2"
                    value={textOptions.fontSize}
                    onChange={(e) => updateTextOption('fontSize', parseInt(e.target.value))}
                    min="10"
                    max="100"
                  />
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={textOptions.fontSize}
                    onChange={(e) => updateTextOption('fontSize', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            </div>
            
            {/* Text alignment and color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Text alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alignment
                </label>
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  {(['left', 'center', 'right'] as TextAlign[]).map((align) => (
                    <button
                      key={align}
                      className={`flex-1 py-2 px-3 focus:outline-none ${
                        textOptions.textAlign === align 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => updateTextOption('textAlign', align)}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Text color */}
              <div>
                <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="text-color"
                    className="w-12 h-10 border-0 bg-transparent cursor-pointer"
                    value={textOptions.color}
                    onChange={(e) => updateTextOption('color', e.target.value)}
                  />
                  <input
                    type="text"
                    className="ml-2 flex-1 p-2 border border-gray-300 rounded-md"
                    value={textOptions.color}
                    onChange={(e) => updateTextOption('color', e.target.value)}
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>
            
            {/* Text effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Shadow effect */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="shadow-effect"
                  className="w-4 h-4 text-purple-600 rounded"
                  checked={textOptions.effects.shadow}
                  onChange={(e) => updateEffect('shadow', e.target.checked)}
                />
                <label htmlFor="shadow-effect" className="ml-2 text-sm font-medium text-gray-700">
                  Text Shadow
                </label>
              </div>
              
              {/* Outline effect */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="outline-effect"
                  className="w-4 h-4 text-purple-600 rounded"
                  checked={textOptions.effects.outline}
                  onChange={(e) => updateEffect('outline', e.target.checked)}
                />
                <label htmlFor="outline-effect" className="ml-2 text-sm font-medium text-gray-700">
                  Text Outline
                </label>
                
                {textOptions.effects.outline && (
                  <input
                    type="color"
                    className="ml-2 w-8 h-8 border-0 bg-transparent cursor-pointer"
                    value={textOptions.effects.outlineColor || '#000000'}
                    onChange={(e) => updateEffect('outlineColor', e.target.value)}
                  />
                )}
              </div>
              
              {/* Highlight effect */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highlight-effect"
                  className="w-4 h-4 text-purple-600 rounded"
                  checked={textOptions.effects.highlight}
                  onChange={(e) => updateEffect('highlight', e.target.checked)}
                />
                <label htmlFor="highlight-effect" className="ml-2 text-sm font-medium text-gray-700">
                  Text Highlight
                </label>
                
                {textOptions.effects.highlight && (
                  <input
                    type="color"
                    className="ml-2 w-8 h-8 border-0 bg-transparent cursor-pointer"
                    value={textOptions.effects.highlightColor || '#ffff00'}
                    onChange={(e) => updateEffect('highlightColor', e.target.value)}
                  />
                )}
              </div>
            </div>
            
            {/* Text position */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horizontal Position
              </label>
              <RangeSlider
                min={0}
                max={100}
                value={textOptions.position.x}
                onChange={(value) => updatePosition('x', value)}
                color="purple"
                showTooltip={true}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vertical Position
              </label>
              <RangeSlider
                min={0}
                max={100}
                value={textOptions.position.y}
                onChange={(value) => updatePosition('y', value)}
                color="purple"
                showTooltip={true}
              />
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

export default Text; 