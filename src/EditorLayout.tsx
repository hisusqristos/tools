import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EditorLayoutProps {
  children: ReactNode;
  toolIcon?: string; // Path to the SVG icon
  onDownload?: () => void;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  onDownload
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-row justify-center items-center text-center space-x-3">
        {/* download button */}
        <button
          className={`flex items-center space-x-2 px-3 py-1 rounded-md border ${onDownload ? 'border-purple-600  text-purple-600' : 'border-gray-300 text-gray-300'}`}
          onClick={onDownload}
          disabled={!onDownload}
        >
          <img className="size-3 text-white" src="assets/download.svg" alt="Download" />
          <span className="text-small font-sans">Download</span>
        </button>

        {/* try another tool */}
        <Link to="/" className="flex space-x-2 px-3 py-1 border rounded-md border-purple-600 bg-purple-600 hover:bg-purple-700">
          <span className="text-small font-sans text-white">Try In Editor</span>
        </Link>
      </div>
      <main className="flex-grow p-6 md:p-3 flex flex-col items-center space-y-1">
        {children}
      </main>
    </div>
  );
};

export default EditorLayout;