import { createUseStyles } from 'react-jss'

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
        borderRadius: '16px',
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

export { useStyles }