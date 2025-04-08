import React from "react";

interface ImageInputProps {
  onUploadAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const DragAndDrop: React.FC<ImageInputProps> = ({ onUploadAction }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleContainerClick = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      onUploadAction({ target: { files: event.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div
      className={`flex flex-row items-center justify-center px-[35%] py-[20%] border-2 border-dashed rounded-lg bg-beige-200 cursor-pointer hover:bg-beige-300 transition-colors ${isDragging ? "border-purple-700 bg-beige-300" : "border-purple-500 hover:border-purple-700"}`}
      onClick={handleContainerClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      <img className="size-[45%] mx-2 text-gray-600 gap-3" src="assets/cloud-upload.svg" alt="Upload" />
        <h6 className="text-[100%] font-medium text-gray-600 whitespace-nowrap"> Upload Image </h6>
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

export default DragAndDrop;