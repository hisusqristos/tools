import HomePage from "./HomePage";
import Crop from "./tools/crop/Crop";
import Flip from "./tools/flip/Flip";
import Grayscale from "./tools/grayscale/Grayscale";


import { HashRouter as Router, Routes, Route, useParams } from "react-router-dom";

const ToolSelector = ({ tool }: { tool?: string }) => {
  switch (tool) {
    case "crop":
      return <Crop />;
    case "flip":
      return <Flip />;
    case "grayscale":
      return <Grayscale />;
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
  return <ToolSelector tool={tool} />;
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