import { memo, useCallback } from "react";
import { useStyles } from "./paletteStyles";
import classNames from "classnames";
import createRipple from "./helpers/createRipple";

type PaletteButtonProps = {
    color: string
    isFirst: boolean
    isLast: boolean
};

const PaletteButton = ({ color, isFirst, isLast }: PaletteButtonProps) => {
    const classes = useStyles({ color })

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, color: string) => {
        createRipple(e.currentTarget, classes.ripple)
        navigator.clipboard.writeText(color)

        const label = e.currentTarget.querySelector(`.${classes.label}`)
        if (label) {
            label.textContent = "COPIED"
            setTimeout(() => {
                label.textContent = "COPY"
            }, 600)
        }
    }, []);

    return (
        <button
            className={classNames(classes.button, {
                [classes.first]: isFirst,
                [classes.last]: isLast,
            })}
            title={color}
            onClick={(e) => handleClick(e, color)}
        >
            <span className={classes.label}>
                COPY
            </span>
        </button>
    )
}

export default memo(PaletteButton);
