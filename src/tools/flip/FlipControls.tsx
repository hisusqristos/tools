import React from "react";

interface FlipControlsProps {
    applyFlip: (direction: 'horizontal' | 'vertical') => void;
    applyRotate: (direction: 'left' | 'right') => void;
}

const FlipControls: React.FC<FlipControlsProps> = ({ applyFlip, applyRotate }) => {
    return (
        <div className="flex flex-row justify-center whitespace-nowrap gap-4">
            <TransformButton icon="assets/flip-horizontal.svg" text="Flip Horizontally" onClickAction={() => applyFlip('horizontal')} />
            <TransformButton icon="assets/flip-vertical.svg" text="Flip Vertically" onClickAction={() => applyFlip('vertical')} />
            <TransformButton icon="assets/rotate-left.svg" text="Rotate Left" onClickAction={() => applyRotate('left')} />
            <TransformButton icon="assets/rotate-right.svg" text="Rotate Right" onClickAction={() => applyRotate('right')} />
        </div>
    );
};


type ControllerProps = {
    icon: string,
    text: string,
    onClickAction: () => void;
}

const TransformButton: React.FC<ControllerProps> = ({ icon, text, onClickAction }) => {
    return <button
        className="flex flex-row items-center rounded-md hover:border-purple-500 hover:shadow-sm transition-all"
        onClick={onClickAction}
    >
        <img
            src={icon}
            alt="Controller Icon"
            className="size-6 text-gray-400"
        />
        <h6 className="text-small mx-1 font-thin text-gray-700">{text}</h6>
    </button>
}

export default FlipControls;