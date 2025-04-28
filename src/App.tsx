import HomePage from "./HomePage";
import Crop from "./tools/crop/Crop";
import Flip from "./tools/flip/Flip";
import Grayscale from "./tools/grayscale/Grayscale";
import ColorBalance from "./tools/colorBalance";
import Brightness from "./tools/brightness";
import Glitch from "./tools/glitch";
import Filters from "./tools/filters";
import Text from "./tools/text";
import Watermark from "./tools/watermark";
import ColorPalette from "./tools/colorPalette/ColorPalette";
import Pixelize from "./tools/pixelize/Pixelize";

import { HashRouter as Router, Routes, Route, useParams, useSearchParams } from "react-router-dom";

const ToolSelector = ({ tool, size }: { tool?: string, size?: number }) => {
  switch (tool) {
    case "crop":
      return <Crop />;
    case "flip":
      return <Flip maxCanvasSize={size} />;
    case "grayscale":
      return <Grayscale />;
    case "colorBalance":
      return <ColorBalance />;
    case "brightness":
      return <Brightness />;
    case "glitch":
      return <Glitch />;
    case "filters":
      return <Filters />;
    case "text":
      return <Text />;
    case "watermark":
      return <Watermark />;
    case "color-palette":
      return <ColorPalette />;
    case "pixelize":
      return <Pixelize />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Tool Not Found</h1>
            <p className="text-gray-600 mb-6">The tool you're looking for doesn't exist.</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700"
            >
              Go Back Home
            </a>
          </div>
        </div>
      );
  }
};

const ToolRouter = () => {
  const { tool } = useParams();
  const [searchParams] = useSearchParams();
  const size = searchParams.get("size");
  return <ToolSelector tool={tool} size={size ? parseInt(size) : undefined} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:tool" element={<ToolRouter />} />
      </Routes>
    </Router>
  );
}

export default App;