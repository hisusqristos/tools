import React from "react";

interface ImageInputProps {
  onUploadAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ onUploadAction }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div 
      className="flex flex-row items-center justify-center px-40 py-24  border-2 border-dashed border-purple-500 rounded-lg bg-beige cursor-pointer hover:border-purple-700 transition-colors"
      onClick={handleContainerClick}
    >
      <div className="w-5 h-5 mx-1 text-gray-600 gap-1">
        <img src="assets/cloud-upload.svg" alt="Upload" />
      </div>
      <h6 className="text-sm font-medium text-gray-600">Upload Image</h6>
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        onChange={onUploadAction} 
        className="sr-only" // Tailwind's screen reader only class
      />
    </div>
  );
};

export default ImageInput;