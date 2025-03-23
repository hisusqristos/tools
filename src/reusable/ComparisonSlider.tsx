import { useEffect, useRef, useState } from "react"
import './ComparisonSlider.css';

type ComparisonProps = {
    originalRef: React.RefObject<HTMLCanvasElement | null>,
    editedRef: React.RefObject<HTMLCanvasElement | null>
}

const ComparisonSlider = ({ originalRef, editedRef }: ComparisonProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [originalSrc, setOriginalSrc] = useState<string | null>(null);
    const [editedSrc, setEditedSrc] = useState<string | null>(null);

    useEffect(() => {
        const updateImages = () => {
            if (originalRef.current && editedRef.current) {
                setOriginalSrc(originalRef.current.toDataURL());
                setEditedSrc(editedRef.current.toDataURL());
            }
        };

        updateImages();

        const observer = new MutationObserver(updateImages);
        if (originalRef.current) observer.observe(originalRef.current, { attributes: true, childList: true, subtree: true });
        if (editedRef.current) observer.observe(editedRef.current, { attributes: true, childList: true, subtree: true });

        return () => observer.disconnect();
    }, [originalRef, editedRef]);


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
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {originalSrc && editedSrc && (
                <div className="comparison-image-wrapper">
                    <img src={editedSrc} className="comparison-image" />
                    <img src={originalSrc} className="comparison-image comparison-image-edited" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }} />
                </div>
            )}
            <div className="comparison-slider" style={{ left: `${sliderPos}%` }} />
        </div>
    );
};


export default ComparisonSlider;

