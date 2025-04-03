import React, { useState } from 'react';

interface RangeSliderProps {
  id?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  color?: string;
  label?: string;
  showValue?: boolean;
  showTooltip?: boolean;
  disabled?: boolean;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  id,
  min,
  max, 
  step = 1,
  value,
  onChange,
  color = 'purple',
  label,
  showValue = false,
  showTooltip = false,
  disabled = false
}) => {
  const [showingTooltip, setShowingTooltip] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const uniqueId = id || `range-slider-${Math.random().toString(36).substring(2, 9)}`;
  const colorClasses: Record<string, string> = {
    red: 'accent-red-600',
    green: 'accent-green-600',
    blue: 'accent-blue-600',
    purple: 'accent-purple-600',
    gray: 'accent-gray-600'
  };

  const colorClass = colorClasses[color] || 'accent-purple-600';
  
  // Calculate tooltip position as a percentage based on current value
  const tooltipPosition = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={uniqueId} className="text-sm font-medium text-gray-700 mb-1">
          {label} {showValue && `(${value})`}
        </label>
      )}
      
      <div className="relative">
        <input
          id={uniqueId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          onMouseEnter={() => setShowingTooltip(true)}
          onMouseLeave={() => setShowingTooltip(false)}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        
        {/* Tooltip */}
        {showTooltip && showingTooltip && (
          <div 
            className="absolute -top-8 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${tooltipPosition}%` }}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

export default RangeSlider;
