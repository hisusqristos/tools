interface UploadButtonProps {
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
    return (<label className="flex justify-center items-center space-x-2 px-5 py-1 rounded-lg border border-purple-600 text-purple-600 cursor-pointer">
        <img className="size-6 text-white" src="assets/cloud-upload.svg" alt="Upload" />
        <span className="text-sm font-medium font-sans">Upload</span>
        <input
            type="file"
            className="hidden"
            onChange={e => onUpload(e)}
        />
    </label>)
};

export default UploadButton;