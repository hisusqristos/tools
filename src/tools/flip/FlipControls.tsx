import React from "react";

interface FlipControlsProps {
    applyFlip: (direction: 'horizontal' | 'vertical') => void;
    applyRotate: (direction: 'left' | 'right') => void; 
}

const FlipControls: React.FC<FlipControlsProps> = ({ applyFlip, applyRotate }) => {
    return (
        <div className="flex flex-row flex-wrap justify-center gap-4">
            <button
                className="flex flex-row items-center rounded-md hover:border-purple-500 hover:shadow-sm transition-all"
                onClick={() => applyFlip('horizontal')}
            >
                <img
                    src="assets/flip-horizontal.svg"
                    alt="Flip Horizontally"
                    className="size-6 text-gray-400"
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
                    className="size-6 mx-1 text-gray-400"
                />
                <h6 className="text-small font-thin text-gray-700">Flip Vertically</h6>
            </button>

            <button
                className="flex flex-row items-center rounded-md hover:border-purple-500 hover:shadow-sm transition-all"
                onClick={() => applyRotate('left')}
            >
                <img
                    src="assets/rotate-left.svg"
                    alt="Rotate Left"
                    className="size-6 mx-1 text-gray-400"
                />
                <h6 className="text-small font-thin text-gray-700">Rotate Left</h6>
            </button>

            <button
                className="flex flex-row items-center rounded-md hover:border-purple-500 hover:shadow-sm transition-all"
                onClick={() => applyRotate('right')}
            >
                <img
                    src="assets/rotate-right.svg"
                    alt="Rotate Right"
                    className="size-6 mx-1 text-gray-400"
                />
                <h6 className="text-small font-thin text-gray-700">Rotate Right</h6>
            </button>
        </div>
    );
};

export default FlipControls;