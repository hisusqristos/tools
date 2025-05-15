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
      className={`flex items-center space-x-2 px-5 py-1 rounded-lg border bg-gray-50 ${downloadAction ? 'border-purple-600  text-purple-600' : 'border-gray-300 text-gray-300'}`}
      onClick={downloadAction}
      disabled={!downloadAction}
    >
      <img className="size-6 text-white" src={`${downloadAction ? "assets/download.svg" : "assets/download-disabled.svg"}`} alt="Download" />
      <span className="text-base font-medium font-sans">Download</span>
    </button>
  );
};

export default DownloadButton;