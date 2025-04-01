import React from "react";

interface DownloadButtonProps {
  downloadAction?: () => void;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  downloadAction,
  disabled = false
}) => {
  return (
    <button
      className={`flex items-center space-x-2 px-3 py-1 rounded-md border ${downloadAction ? 'border-purple-600  text-purple-600' : 'border-gray-300 text-gray-300'}`}
      onClick={downloadAction}
      disabled={!downloadAction}
    >
      <img className="size-3 text-white" src="assets/download.svg" alt="Download" />
      <span className="text-small font-sans">Download</span>
    </button>
  );
};

export default DownloadButton;