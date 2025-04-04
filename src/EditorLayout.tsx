import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import DownloadButton from './reusable/DownloadButton';
import UploadButton from './reusable/UploadButton';

interface EditorLayoutProps {
  children: ReactNode;
  toolIcon?: string; // Path to the SVG icon
  onDownload?: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  onDownload,
  onUpload
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-screen bg-gray-50">
      <main className="flex flex-col items-center gap-3">
        {children}

        <div className="flex flex-row justify-between w-full">

          <div className="flex gap-3">
            <UploadButton onUpload={onUpload} />
            <DownloadButton downloadAction={onDownload} />
          </div>

          <Link to="/" className="flex space-x-2 px-3 py-1 border rounded-md border-purple-600 bg-purple-600 hover:bg-purple-700">
            <span className="text-small font-sans text-white">Try In Editor</span>
          </Link>

        </div>
      </main>
    </div>
  );
};

export default EditorLayout;