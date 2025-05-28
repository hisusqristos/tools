import { FC, memo, ReactNode, ChangeEvent } from 'react';
import { useRouteParams } from './hooks/useRouteParams';
import DownloadButton from './reusable/DownloadButton';
import UploadButton from './reusable/UploadButton';

interface EditorLayoutProps {
  children: ReactNode;
  toolIcon?: string; // Path to the SVG icon
  onDownload?: () => void;
  goToEditor?: () => void;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EditorLayout: FC<EditorLayoutProps> = ({
  children,
  onDownload,
  onUpload,
  goToEditor
}) => {
  const { color } = useRouteParams();
  console.log(color);
  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-screen"
      style={{ background: color }}>
      <div id="editor" className="flex flex-col gap-3 w-full max-w-xl mx-auto">
        <main className="flex flex-col items-center gap-5">
          {children}
        </main>

        <div className="flex flex-row justify-between mx-3">
          <div className="flex gap-3">
            <UploadButton onUpload={onUpload} />
            <DownloadButton downloadAction={onDownload} />
          </div>
          <div>
            <button
              style={ {display: 'none'}} 
              className="flex items-center justify-center py-2 border px-5 rounded-lg border-purple-600 bg-purple-600 hover:bg-purple-700"
              onClick={goToEditor}
            >
              <span className="text-base font-medium font-sans">Try In Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(EditorLayout);