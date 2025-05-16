import PaletteButton from './PaletteButton';

const PaletteButtons = ({ colors }: { colors: string[] }) => {
    return (
        <div className='flex overflow-hidden'>
            {colors.map((color, index) => (
                <PaletteButton
                    key={index}
                    color={color}
                    isFirst={index === 0}
                    isLast={index === colors.length - 1}
                />
            ))}
        </div>
    )
}

export default PaletteButtons