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
    <div className="flex flex-col items-center justify-center gap-3 min-h-screen">
      <div id="editor" className="flex flex-col gap-3 w-full max-w-xl mx-auto">
        <main className="flex flex-col items-center gap-5">
          {children}
        </main>

        <div className="flex flex-row justify-between mx-3">
          <div className="flex gap-3">
            <UploadButton onUpload={onUpload} />
            <DownloadButton downloadAction={onDownload} />
          </div>

          <Link to="/" className="flex items-center justify-center py-2 border px-[5%] rounded-lg border-purple-600 bg-purple-600 hover:bg-purple-700">
            <h6 className="text-base font-sans font-medium text-white">Try In Editor</h6>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;