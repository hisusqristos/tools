import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const tools = [
    {
      id: "flip",
      name: "Flip",
      description: "Flip your images horizontally or vertically",
      icon: "assets/flip-horizontal.svg"
    },
    {
      id: "grayscale",
      name: "Grayscale",
      description: "Convert your images to grayscale",
      icon: "assets/grayscale.svg"
    },
    {
      id: "crop",
      name: "Crop",
      description: "Crop your images to the perfect size",
      icon: "assets/crop.svg"
    },
    // Add more tools as needed
  ];

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-10 bg-gray-50">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">Image Editor</h1>
        <p className="text-xl text-gray-600">Select a tool to get started</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {tools.map((tool) => (
          <Link 
            to={`/${tool.id}`} 
            className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all" 
            key={tool.id}
          >
            <div className="w-16 h-16 flex items-center justify-center mb-6 bg-gray-100 rounded-full p-4">
              <img src={tool.icon} alt={tool.name} className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{tool.name}</h2>
            <p className="text-gray-600 text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;