interface UploadButtonProps {
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
    return (<label className="flex items-center space-x-2 px-3 py-1 rounded-md border border-purple-600 text-purple-600 cursor-pointer">
        <img className="size-[75%] text-white" src="assets/cloud-upload.svg" alt="Upload" />
        <span className="text-[85%] font-sans">Upload</span>
        <input
            type="file"
            className="hidden"
            onChange={e => onUpload(e)}
        />
    </label>)
};

export default UploadButton;