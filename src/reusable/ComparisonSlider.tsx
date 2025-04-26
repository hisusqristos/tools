import { useRef, useState } from "react"
import { createUseStyles } from 'react-jss'

type ComparisonProps = {
    originalSrc: string,
    editedSrc: string,
}

const useStyles = createUseStyles({
    container: {
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        width: ({ imageSize }: { imageSize: { width: number; height: number } }) => `${imageSize.width}px`,
        height: ({ imageSize }: { imageSize: { width: number; height: number } }) => `${imageSize.height}px`,
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    image: {
        position: 'absolute',
        borderRadius: '30px',
        width: ({ imageSize }: { imageSize: { width: number; height: number } }) => `${imageSize.width}px`,
        height: ({ imageSize }: { imageSize: { width: number; height: number } }) => `${imageSize.height}px`,
    },
    imageEdited: {
        position: 'absolute',
        clipPath: ({ sliderPos }: { sliderPos: number, imageSize: { width: number, height: number } }) => `inset(0 ${100 - sliderPos}% 0 0)`,
    },
    slider: {
        position: 'absolute',
        top: 0,
        width: 4,
        height: ({ imageSize }: { imageSize: { width: number; height: number } }) => `${imageSize.height}px`,
        background: 'whitesmoke',
        cursor: 'ew-resize',
        transform: 'translateX(-50%)',
        left: ({ sliderPos }: { sliderPos: number }) => `${sliderPos}%`,
    },
});

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

function dimensionsToFit(
    imgWidth: number,
    imgHeight: number,
    containerWidth: number,
    containerHeight: number,
) {
    const imgRatio = imgWidth / imgHeight;
    const containerRatio = containerWidth / containerHeight;

    if (imgRatio > containerRatio) {
        const width = containerWidth;
        const height = containerWidth / imgRatio;
        return { width, height };
    } else {
        const height = containerHeight;
        const width = containerHeight * imgRatio;
        return { width, height };
    }
}

export default ComparisonSlider;

