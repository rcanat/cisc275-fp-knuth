import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { importProjectFromJSON } from '../utils/storage';

export default function ProjectOverview() {
  const { state, dispatch } = useProject();
  const project = state.projects.find(p => p.id === state.currentProjectId);

  const [name, setName] = useState(project?.name || '');
  const [purpose, setPurpose] = useState(project?.purpose || '');

  if (!project) {
    return <div className="p-8">No project selected</div>;
  }

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_PROJECT',
      payload: { ...project, name, purpose },
    });
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          const imported = importProjectFromJSON(json);
          if (imported) {
            dispatch({ type: 'ADD_PROJECT', payload: imported });
            alert('Project imported successfully!');
          } else {
            alert('Failed to import project. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Project Overview</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Purpose</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 h-32"
              placeholder="Describe the purpose of your application"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Project Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-2xl font-bold">{project.pages.length}</div>
                <div className="text-gray-600">Pages</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-2xl font-bold">{project.routes.length}</div>
                <div className="text-gray-600">Routes</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-2xl font-bold">{project.stateModel.attributes.length}</div>
                <div className="text-gray-600">State Attributes</div>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <div className="text-2xl font-bold">{project.stateModel.secondaryDataclasses.length}</div>
                <div className="text-gray-600">Secondary Dataclasses</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Import/Export</h2>
            <button
              onClick={handleImportJSON}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
              Import Project from JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
