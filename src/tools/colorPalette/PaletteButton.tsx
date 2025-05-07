import { memo } from "react";
import { PaletteButtonStyles as useStyles } from "./paletteStyles";

type PaletteButtonProps = {
    color: string
    index: number
    isFirst: boolean
    isLast: boolean
    isLabelVisible: boolean
    onClick: (e: React.MouseEvent<HTMLButtonElement>, index: number, color: string) => void
};

const PaletteButton = ({ color, index, isFirst, isLast, isLabelVisible, onClick }: PaletteButtonProps) => {
    const classes = useStyles({ color })

    return (
        <button
            className={`${classes.button} ${isFirst ? classes.first : ''} ${isLast ? classes.last : ''}`}
            title={color}
            onClick={(e) => onClick(e, index, color)}
        >
            <span className={classes.label} style={{ opacity: isLabelVisible ? 0 : undefined }}>
                COPY
            </span>
        </button>
    )
}

export default memo(PaletteButton);
