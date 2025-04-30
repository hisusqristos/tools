import { useRef, useState, useEffect, useCallback } from "react";
import { adjustFilters, FilterType, filterTypes } from "./adjustFilters";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import DragAndDrop from "../../reusable/DragAndDrop";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";
import Carousel from "../../reusable/Carousel";
import FilterCatalogue from "./helpers/FilterCatalogue";
import { drawScaledImage } from "../../reusable/drawScaledImage";

const Filters = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload: originalHandleDownload } = useHandleFile(canvasRef, previewCanvasRef, 600);

  useIframeResize()

  const adjustmentValues = useRef<{ filterType: FilterType; intensity: number; }>({ filterType: 'none', intensity: 50 });

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [intensityValue, setIntensityValue] = useState<number>(50);

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
      drawScaledImage(previewCanvasRef.current, image, 600)
      updatePreview();
    }
  }, [image, updatePreview]);

  return (
    <EditorLayout
      toolIcon="assets/filters.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
    >
      <div
        style={{ width: previewCanvasRef.current?.width, height: previewCanvasRef.current?.height }}
        className={`flex w-full items-center justify-center rounded-2xl ${!image ? "hidden" : "block"}`} >
        <canvas
          ref={previewCanvasRef}
          className="rounded-lg shadow-md max-w-full max-h-full"
        />
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <div className="flex flex-col w-full max-w-4xl gap-6">
          <Carousel visibleCount={5} label="Select Filter">
            {filterTypes.map((filter) =>
              <FilterCatalogue filter={filter} selectedFilter={selectedFilter} handleFilterSelect={handleFilterSelect} image={image} />
            )}
          </Carousel>

          {/* Intensity slider (only shown when a filter is selected) */}
          {selectedFilter !== 'none' && (
            <div className="px-12 mb-4">
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