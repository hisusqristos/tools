import { useRef, useState, useEffect, useCallback } from "react";
import useHandleFile from "../../hooks/useHandleFile";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import Carousel from "../../reusable/Carousel";
import { adjustFilters, FilterType } from "./adjustFilters";
import { filterCatalogue } from "./FilterOptions";

const Filters = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { image, handleUpload, handleDownload: originalHandleDownload } = useHandleFile(canvasRef, previewCanvasRef, 600);

  const adjustmentValues = useRef<{ filterType: FilterType; intensity: number; }>({ filterType: 'none', intensity: 100 });

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [intensityValue, setIntensityValue] = useState<number>(100);

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


  const handleFilterSelect = useCallback((filterType: FilterType) => {
    adjustmentValues.current.filterType = filterType;
    setSelectedFilter(filterType);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);

  const handleIntensityChange = useCallback((value: number) => {
    adjustmentValues.current.intensity = value;
    setIntensityValue(value);
    requestAnimationFrame(updatePreview);
  }, [updatePreview]);


  const handleDownload = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const { filterType, intensity } = adjustmentValues.current;

    adjustFilters(
      image,
      canvasRef.current,
      filterType,
      intensity,
      true
    );

    originalHandleDownload();
  }, [image, originalHandleDownload]);

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
      <canvas ref={canvasRef} className="hidden" />

      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <div className="flex flex-col w-full max-w-4xl gap-6">
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
          {/* Filter options grid */}
          <Carousel visibleCount={5} label="Select Filter">
            {filterTypes.map((filter) =>
              filterCatalogue(filter, selectedFilter, handleFilterSelect)
            )}
          </Carousel>

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
        </div>
      )
      }
    </EditorLayout >
  );
};

export default Filters; 