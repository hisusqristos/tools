import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EditorLayoutProps {
  children: ReactNode;
  title: string;
  toolIcon?: string; // Path to the SVG icon
  onDownload?: () => void;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  children,
  title,
  toolIcon,
  onDownload
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 md:p-6 bg-white shadow-sm">
        <div className="flex space-x-4">
          {/* download button */}
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-md border ${onDownload ? 'border-gray-200 text-purple-600 hover:border-purple-600' : 'border-gray-200 text-gray-400'}`}
            onClick={onDownload}
            disabled={!onDownload}
          >
            {/* download icon */}
            <img src="assets/download.svg" alt="Download" className="w-5 h-5" />
            <span className="font-medium">Download</span>
          </button>

          {/* try another tool */}
          <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">
            <span className="font-medium">Try Another Tool</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 px-4 py-2 border border-gray-200 rounded-md">
          {toolIcon && <img src={toolIcon} alt={title} className="w-5 h-5 text-gray-600" />}
          <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        </div>
      </header>

      <main className="flex-grow p-6 md:p-10 flex flex-col items-center space-y-6">
        {children}
      </main>
    </div>
  );
};

export default EditorLayout;