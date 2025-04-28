import { useRef, useState } from "react"
import { dimensionsToFit } from "./drawScaledImage";
import { useStyles } from "./comparisonStyle";

type ComparisonProps = {
    originalSrc: string,
    editedSrc: string,
}

const ComparisonSlider = ({ originalSrc, editedSrc }: ComparisonProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const classes = useStyles({ sliderPos, imageSize });

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

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;

        const { width, height } = dimensionsToFit(
            img.naturalWidth,
            img.naturalHeight,
            600, 600);

        setImageSize({ width, height });
    };

    return (
        <div
            ref={containerRef}
            className={classes.container}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {originalSrc && editedSrc && (
                <div className={classes.imageWrapper}>
                    <img src={editedSrc} onLoad={handleImageLoad} alt="Edited version on the right side" className={classes.image} />
                    <img
                        src={originalSrc}
                        onLoad={handleImageLoad}
                        alt="Original version on the left side"
                        className={`${classes.image} ${classes.imageEdited}`}
                    />
                </div>
            )}
            <div className={classes.slider} />
        </div>
    );
};

export default ComparisonSlider;

