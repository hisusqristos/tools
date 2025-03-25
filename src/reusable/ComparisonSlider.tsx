import { useRef, useState } from "react"
import './ComparisonSlider.css';

type ComparisonProps = {
    originalSrc: string,
    editedSrc: string,
    dimensions: { width: number, height: number }
}

const ComparisonSlider = ({ originalSrc, editedSrc, dimensions }: ComparisonProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || !isDragging) return;
        const rect = containerRef.current.getBoundingClientRect();
        let newX = ((e.clientX - rect.left) / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, newX)));
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={containerRef}
            className="comparison-container"
            style={{ width: dimensions.width, height: dimensions.height }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {originalSrc && editedSrc && (
                <div className="comparison-image-wrapper">
                    <img src={editedSrc} alt="Edited image on the right side" className="comparison-image" />
                    <img src={originalSrc} alt="Original image on the left side" className="comparison-image comparison-image-edited" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }} />
                </div>
            )}
            <div className="comparison-slider" style={{ left: `${sliderPos}%` }} />
        </div>
    );
};


export default ComparisonSlider;

