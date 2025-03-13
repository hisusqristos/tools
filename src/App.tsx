import Crop from "./tools/Crop"

import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

const Flip = () => <div>Flip Tool</div>;
const BW = () => <div>Black & White Tool</div>;

const ToolSelector = ({ tool }: { tool?: string }) => {
  switch (tool) {
    case "crop":
      return <Crop />;
    case "flip":
      return <Flip />;
    case "bw":
      return <BW />;
    default:
      return <div>Tool Not Found</div>;
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
        <Route path="/" element={<div>Select a tool</div>} />
        <Route path="/:tool" element={<ToolRouter />} />
      </Routes>
    </Router>)
};

export default App;
