type FlipControlsProps = { applyFlip: (direction: 'horizontal' | 'vertical') => void };

const FlipControls = ({ applyFlip }: FlipControlsProps) => (
    <div>
        <button onClick={() => applyFlip('horizontal')}>Flip Horizontally</button>
        <button onClick={() => applyFlip('vertical')}>Flip Vertically</button>
    </div>
);

export default FlipControls