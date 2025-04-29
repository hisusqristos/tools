import { useRef, useState, useEffect, useCallback } from "react";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import { adjustFilters, FilterType, filterInfo } from "./adjustFilters";

const Filters = () => {
  // Canvas for download operations (hidden)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canvas for preview (visible to user)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use the hook for image handling
  const { image, handleUpload, handleDownload: originalHandleDownload } = useHandleFile(canvasRef);

  useIframeResize()

  // Store adjustment values in refs to avoid rerenders
  const adjustmentValues = useRef<{
    filterType: FilterType;
    intensity: number;
  }>({
    filterType: 'none',
    intensity: 100
  });

  // State for filter type and intensity slider (used for UI)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [intensityValue, setIntensityValue] = useState<number>(100);

  // All available filter types (excluding 'none' which is the default)
  const filterTypes: FilterType[] = [
    'none',
    'sepia',
    'vintage',
    'noir',
    'cool',
    'warm',
    'faded',
    'dramatic',
    'polaroid'
  ];

  // Function to update the preview canvas
  const updatePreview = useCallback(() => {
    if (!image || !previewCanvasRef.current) return;

    const { filterType, intensity } = adjustmentValues.current;

    adjustFilters(
      image,
      previewCanvasRef.current,
      filterType,
      intensity
    );
  }, [image]);

  // Handler for filter type selection
  const handleFilterSelect = useCallback((filterType: FilterType) => {
    adjustmentValues.current.filterType = filterType;
    setSelectedFilter(filterType);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Handler for intensity slider
  const handleIntensityChange = useCallback((value: number) => {
    adjustmentValues.current.intensity = value;
    setIntensityValue(value);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  // Create a custom download handler that applies adjustments before download
  const handleDownload = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const { filterType, intensity } = adjustmentValues.current;

    // Apply current adjustments to the download canvas
    adjustFilters(
      image,
      canvasRef.current,
      filterType,
      intensity,
      true
    );

    // Use the original download function from the hook
    originalHandleDownload();
  }, [image, originalHandleDownload]);

  // Update preview when image changes - placed after functions but before JSX
  useEffect(() => {
    if (image && previewCanvasRef.current) {
      updatePreview();
    }
  }, [image, updatePreview]);

  return (
    <EditorLayout
      toolIcon="assets/filters.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
    >
      {/* Hidden canvas used by useHandleFile hook for export */}
      <canvas ref={canvasRef} className="hidden" />

      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <div className="flex flex-col w-full max-w-4xl gap-6">
          {/* Filter options grid */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Filter</h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
              {filterTypes.map(filter => (
                <button
                  key={filter}
                  onClick={() => handleFilterSelect(filter)}
                  className={`flex flex-col items-center p-2 rounded-md border ${selectedFilter === filter
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-md mb-2">
                    {/* This would ideally be a thumbnail with the filter applied */}
                    <div className={`w-full h-full rounded-md ${filter === 'none' ? 'bg-white' :
                        filter === 'sepia' ? 'bg-amber-100' :
                          filter === 'vintage' ? 'bg-orange-50' :
                            filter === 'noir' ? 'bg-gray-800' :
                              filter === 'cool' ? 'bg-blue-100' :
                                filter === 'warm' ? 'bg-orange-100' :
                                  filter === 'faded' ? 'bg-gray-100' :
                                    filter === 'dramatic' ? 'bg-indigo-200' :
                                      'bg-yellow-50' // polaroid
                      }`}></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {filterInfo[filter].name}
                  </span>
                </button>
              ))}
            </div>

            {/* Intensity slider (only shown when a filter is selected) */}
            {selectedFilter !== 'none' && (
              <div className="mt-4">
                <RangeSlider
                  id="intensity-slider"
                  min={0}
                  max={100}
                  value={intensityValue}
                  onChange={handleIntensityChange}
                  color="purple"
                  label="Intensity"
                  showTooltip={true}
                />
              </div>
            )}

            {/* Filter description */}
            <div className="mt-4 text-sm text-gray-600">
              {filterInfo[selectedFilter].description}
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

export default Filters; 