import React from "react";

interface FlipControlsProps {
  applyFlip: (direction: 'horizontal' | 'vertical') => void;
}

const FlipControls: React.FC<FlipControlsProps> = ({ applyFlip }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <button 
        className="flex flex-col items-center p-4 border border-gray-200 rounded-md bg-white hover:border-purple-500 hover:shadow-sm transition-all"
        onClick={() => applyFlip('horizontal')}
      >
        <img 
          src="assets/flip-horizontal.svg" 
          alt="Flip Horizontally" 
          className="w-6 h-6 mb-2 text-gray-400"
        />
        <h6 className="text-sm font-medium text-gray-800">Flip Horizontally</h6>
      </button>
      
      <button 
        className="flex flex-col items-center p-4 border border-gray-200 rounded-md bg-white hover:border-purple-500 hover:shadow-sm transition-all"
        onClick={() => applyFlip('vertical')}
      >
        <img 
          src="assets/flip-vertical.svg" 
          alt="Flip Vertically" 
          className="w-6 h-6 mb-2 text-gray-400"
        />
        <h6 className="text-sm font-medium text-gray-800">Flip Vertically</h6>
      </button>
    </div>
  );
};

export default FlipControls;