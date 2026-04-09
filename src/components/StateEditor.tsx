import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProject } from '../context/ProjectContext';
import type { StateAttribute, SecondaryDataclass } from '../types';

interface DataclassEditorProps {
  dataclass: SecondaryDataclass;
  onDelete: () => void;
  onAddAttribute: (name: string, type: string, description: string) => void;
  onDeleteAttribute: (attrId: string) => void;
}

function DataclassEditor({ dataclass, onDelete, onAddAttribute, onDeleteAttribute }: DataclassEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [attrName, setAttrName] = useState('');
  const [attrType, setAttrType] = useState('str');
  const [attrDesc, setAttrDesc] = useState('');

  const handleAdd = () => {
    onAddAttribute(attrName, attrType, attrDesc);
    setAttrName('');
    setAttrType('str');
    setAttrDesc('');
  };

  return (
    <div className="border border-gray-300 rounded">
      <div className="bg-gray-200 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-600 hover:text-gray-800"
          >
            {expanded ? '▼' : '▶'}
          </button>
          <span className="font-semibold">{dataclass.name}</span>
          <span className="text-sm text-gray-600">({dataclass.attributes.length} attributes)</span>
        </div>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800">
          Delete
        </button>
      </div>

      {expanded && (
        <div className="p-3 space-y-3">
          <div className="space-y-2">
            <input
              type="text"
              value={attrName}
              onChange={(e) => setAttrName(e.target.value)}
              placeholder="Attribute name"
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <select
              value={attrType}
              onChange={(e) => setAttrType(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="str">str</option>
              <option value="int">int</option>
              <option value="float">float</option>
              <option value="bool">bool</option>
            </select>
            <input
              type="text"
              value={attrDesc}
              onChange={(e) => setAttrDesc(e.target.value)}
              placeholder="Description"
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm w-full"
            >
              Add Attribute
            </button>
          </div>

          <div className="space-y-1">
            {dataclass.attributes.map(attr => (
              <div key={attr.id} className="bg-gray-50 p-2 rounded flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold">{attr.name}</span>: {attr.type}
                  {attr.description && <span className="text-gray-600"> - {attr.description}</span>}
                </div>
                <button
                  onClick={() => onDeleteAttribute(attr.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StateEditor() {
  const { state, dispatch } = useProject();
  const project = state.projects.find(p => p.id === state.currentProjectId);

  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrType, setNewAttrType] = useState('str');
  const [newAttrDesc, setNewAttrDesc] = useState('');

  const [newClassName, setNewClassName] = useState('');

  if (!project) {
    return <div className="p-8">No project selected</div>;
  }

  const addAttribute = () => {
    if (!newAttrName.trim()) {
      alert('Please enter an attribute name');
      return;
    }

    const newAttr: StateAttribute = {
      id: uuidv4(),
      name: newAttrName,
      type: newAttrType,
      description: newAttrDesc,
    };

    const updatedStateModel = {
      ...project.stateModel,
      attributes: [...project.stateModel.attributes, newAttr],
    };

    dispatch({
      type: 'UPDATE_STATE_MODEL',
      payload: {
        projectId: project.id,
        stateModel: updatedStateModel,
      },
    });

    setNewAttrName('');
    setNewAttrType('str');
    setNewAttrDesc('');
  };

  const deleteAttribute = (attrId: string) => {
    const updatedStateModel = {
      ...project.stateModel,
      attributes: project.stateModel.attributes.filter(a => a.id !== attrId),
    };

    dispatch({
      type: 'UPDATE_STATE_MODEL',
      payload: {
        projectId: project.id,
        stateModel: updatedStateModel,
      },
    });
  };

  const addDataclass = () => {
    if (!newClassName.trim()) {
      alert('Please enter a class name');
      return;
    }

    const newDataclass: SecondaryDataclass = {
      id: uuidv4(),
      name: newClassName,
      attributes: [],
    };

    const updatedStateModel = {
      ...project.stateModel,
      secondaryDataclasses: [...project.stateModel.secondaryDataclasses, newDataclass],
    };

    dispatch({
      type: 'UPDATE_STATE_MODEL',
      payload: {
        projectId: project.id,
        stateModel: updatedStateModel,
      },
    });

    setNewClassName('');
  };

  const deleteDataclass = (dataclassId: string) => {
    const updatedStateModel = {
      ...project.stateModel,
      secondaryDataclasses: project.stateModel.secondaryDataclasses.filter(d => d.id !== dataclassId),
    };

    dispatch({
      type: 'UPDATE_STATE_MODEL',
      payload: {
        projectId: project.id,
        stateModel: updatedStateModel,
      },
    });
  };

  const addDataclassAttribute = (dataclassId: string, name: string, type: string, description: string) => {
    if (!name.trim()) {
      alert('Please enter an attribute name');
      return;
    }

    const newAttr: StateAttribute = {
      id: uuidv4(),
      name,
      type,
      description,
    };

    const updatedStateModel = {
      ...project.stateModel,
      secondaryDataclasses: project.stateModel.secondaryDataclasses.map(d => {
        if (d.id === dataclassId) {
          return {
            ...d,
            attributes: [...d.attributes, newAttr],
          };
        }
        return d;
      }),
    };

    dispatch({
      type: 'UPDATE_STATE_MODEL',
      payload: {
        projectId: project.id,
        stateModel: updatedStateModel,
      },
    });
  };

  const deleteDataclassAttribute = (dataclassId: string, attrId: string) => {
    const updatedStateModel = {
      ...project.stateModel,
      secondaryDataclasses: project.stateModel.secondaryDataclasses.map(d => {
        if (d.id === dataclassId) {
          return {
            ...d,
            attributes: d.attributes.filter(a => a.id !== attrId),
          };
        }
        return d;
      }),
    };

    dispatch({
      type: 'UPDATE_STATE_MODEL',
      payload: {
        projectId: project.id,
        stateModel: updatedStateModel,
      },
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">State Model Editor</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Main State */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Main State Attributes</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Type</label>
                <select
                  value={newAttrType}
                  onChange={(e) => setNewAttrType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="str">str</option>
                  <option value="int">int</option>
                  <option value="float">float</option>
                  <option value="bool">bool</option>
                  {project.stateModel.secondaryDataclasses.map(dc => (
                    <option key={dc.id} value={`list[${dc.name}]`}>list[{dc.name}]</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={newAttrDesc}
                  onChange={(e) => setNewAttrDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Optional description"
                />
              </div>
              <button
                onClick={addAttribute}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Add Attribute
              </button>
            </div>

            <div className="space-y-2">
              {project.stateModel.attributes.length === 0 ? (
                <div className="text-gray-500 py-4">No attributes yet</div>
              ) : (
                project.stateModel.attributes.map(attr => (
                  <div key={attr.id} className="bg-gray-100 p-3 rounded flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{attr.name}: {attr.type}</div>
                      {attr.description && <div className="text-sm text-gray-600">{attr.description}</div>}
                    </div>
                    <button
                      onClick={() => deleteAttribute(attr.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Secondary Dataclasses */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Secondary Dataclasses</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-1">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="e.g., Todo, Post"
                />
              </div>
              <button
                onClick={addDataclass}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Add Dataclass
              </button>
            </div>

            <div className="space-y-4">
              {project.stateModel.secondaryDataclasses.length === 0 ? (
                <div className="text-gray-500 py-4">No dataclasses yet</div>
              ) : (
                project.stateModel.secondaryDataclasses.map(dataclass => (
                  <DataclassEditor
                    key={dataclass.id}
                    dataclass={dataclass}
                    onDelete={() => deleteDataclass(dataclass.id)}
                    onAddAttribute={(name, type, description) =>
                      addDataclassAttribute(dataclass.id, name, type, description)
                    }
                    onDeleteAttribute={(attrId) => deleteDataclassAttribute(dataclass.id, attrId)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
