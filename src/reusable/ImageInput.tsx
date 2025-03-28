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
      className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-200 rounded-lg bg-white cursor-pointer hover:border-purple-500 transition-colors"
      onClick={handleContainerClick}
    >
      <div className="w-12 h-12 mb-4">
        <img src="assets/upload.svg" alt="Upload" className="w-full h-full text-gray-600" />
      </div>
      <h6 className="text-xl font-medium text-gray-700">Upload Image</h6>
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