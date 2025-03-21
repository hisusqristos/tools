import { useState } from "react";

type GrayscaleProps = { applyGS: (darkness: number) => void }


const GSControls = ({ applyGS }: GrayscaleProps) => {
    const [value, setValue] = useState(3);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setValue(newValue);
        applyGS(newValue);
    };

    return (
        <div>
            <input
                type="range"
                value={value}
                min="3"
                max="7"
                step="0.5"
                onChange={handleChange}
            />
        </div>
    );
};

export default GSControls