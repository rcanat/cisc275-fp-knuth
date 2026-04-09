import { useState } from 'react';
import { saveAs } from 'file-saver';
import { useProject } from '../context/ProjectContext';
import { generatePythonCode } from '../utils/pythonGenerator';
import { generateDocx } from '../utils/docxGenerator';
import { exportProjectAsJSON } from '../utils/storage';

export default function ExportPanel() {
  const { state } = useProject();
  const project = state.projects.find(p => p.id === state.currentProjectId);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCode, setShowCode] = useState(false);

  if (!project) {
    return <div className="p-8">No project selected</div>;
  }

  const handleGeneratePython = () => {
    const code = generatePythonCode(project);
    setGeneratedCode(code);
    setShowCode(true);
  };

  const handleDownloadPython = () => {
    const code = generatePythonCode(project);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${project.name.replace(/\s+/g, '_')}.py`);
  };

  const handleDownloadDocx = () => {
    void generateDocx(project);
  };

  const handleDownloadJSON = () => {
    const json = exportProjectAsJSON(project);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `${project.name.replace(/\s+/g, '_')}.json`);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Export Project</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Python Code */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Python Code</h2>
            <p className="text-gray-600 mb-4">
              Generate Python code using the Drafter framework based on your design.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleGeneratePython}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Generate & Preview
              </button>
              <button
                onClick={handleDownloadPython}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download .py File
              </button>
            </div>
          </div>

          {/* DOCX Document */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Design Document</h2>
            <p className="text-gray-600 mb-4">
              Export a comprehensive Word document with your application design.
            </p>
            <button
              onClick={handleDownloadDocx}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Download .docx File
            </button>
          </div>

          {/* JSON Export */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">JSON Export</h2>
            <p className="text-gray-600 mb-4">
              Export your project as JSON to share or backup your work.
            </p>
            <button
              onClick={handleDownloadJSON}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Download .json File
            </button>
          </div>
        </div>

        {/* Code Preview */}
        {showCode && (
          <div className="border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Python Code</h2>
              <button
                onClick={() => setShowCode(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
              <code>{generatedCode}</code>
            </pre>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(generatedCode);
                  alert('Code copied to clipboard!');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleDownloadPython}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download as File
              </button>
            </div>
          </div>
        )}

        {/* Project Summary */}
        <div className="border border-gray-300 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-3xl font-bold text-blue-600">{project.pages.length}</div>
              <div className="text-gray-600">Pages</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-3xl font-bold text-green-600">{project.routes.length}</div>
              <div className="text-gray-600">Routes</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-3xl font-bold text-purple-600">
                {project.pages.reduce((sum, p) => sum + p.components.length, 0)}
              </div>
              <div className="text-gray-600">Components</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-3xl font-bold text-orange-600">
                {project.stateModel.attributes.length + 
                 project.stateModel.secondaryDataclasses.reduce((sum, dc) => sum + dc.attributes.length, 0)}
              </div>
              <div className="text-gray-600">State Attributes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
