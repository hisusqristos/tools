import React from "react";

interface FlipControlsProps {
    applyFlip: (direction: 'horizontal' | 'vertical') => void;
}

const FlipControls: React.FC<FlipControlsProps> = ({ applyFlip }) => {
    return (
        <div className="flex flex-row flex-wrap justify-center gap-4">
            <button
                className="flex flex-row items-center rounded-md hover:border-purple-500 hover:shadow-sm transition-all"
                onClick={() => applyFlip('horizontal')}
            >
                <img
                    src="assets/flip-horizontal.svg"
                    alt="Flip Horizontally"
                    className="w-4 h-4 text-gray-400"
                />
                <h6 className="text-small mx-1 font-thin text-gray-700">Flip Horizontally</h6>

            </button>

            <button
                className="flex flex-row items-center rounded-md hover:border-purple-500 hover:shadow-sm transition-all"
                onClick={() => applyFlip('vertical')}
            >
                <img
                    src="assets/flip-vertical.svg"
                    alt="Flip Vertically"
                    className="w-4 h-4 mx-1 text-gray-400"
                />
                <h6 className="text-small font-thin text-gray-700">Flip Vertically</h6>
            </button>
        </div>
    );
};

export default FlipControls;