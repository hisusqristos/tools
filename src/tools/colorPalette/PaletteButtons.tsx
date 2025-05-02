import { useState } from 'react'
import { PaletteStyles } from "./paletteStyles";
import PaletteButton from './PaletteButton';
import createRipple from "./helpers/createRipple"

const PaletteButtons = ({ colors }: { colors: string[] }) => {
    const [visibleIconIndex, setVisibleIconIndex] = useState<number | null>(null)
    const classes = PaletteStyles()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number, color: string) => {
        createRipple(e.currentTarget, classes.ripple)

        setVisibleIconIndex(index)
        setTimeout(() => setVisibleIconIndex(null), 600)

        navigator.clipboard.writeText(color)
    }

    return (
        <div className={classes.container}>
            {colors.map((color, index) => (
                <PaletteButton
                    key={index}
                    color={color}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === colors.length - 1}
                    isLabelVisible={visibleIconIndex === index}
                    onClick={handleClick}
                />
            ))}
        </div>
    )
}

export default PaletteButtons