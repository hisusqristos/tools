import React from "react";

interface DownloadButtonProps {
  onClickAction: () => void;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  onClickAction, 
  disabled = false 
}) => {
  return (
    <button 
      className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${disabled ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-purple-600 hover:border-purple-600 cursor-pointer'}`}
      onClick={onClickAction} 
      disabled={disabled}
    >
      <span className="w-5 h-5">
        <img src="assets/download.svg" alt="Download" className="w-full h-full" />
      </span>
      <span className="font-medium">Download</span>
    </button>
  );
};

export default DownloadButton;