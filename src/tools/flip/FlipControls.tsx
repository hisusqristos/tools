import { MoveHorizontal, MoveVertical } from "lucide-react"

type FlipControlsProps = { applyFlip: (direction: 'horizontal' | 'vertical') => void };

const FlipControls = ({ applyFlip }: FlipControlsProps) => (
    <div>
        <button onClick={() => applyFlip('horizontal')}> <MoveHorizontal /> </button>
        <button onClick={() => applyFlip('vertical')}> <MoveVertical /> </button>
    </div>
);

export default FlipControls