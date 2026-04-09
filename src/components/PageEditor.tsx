import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProject } from '../context/ProjectContext';
import type { PageComponent, ComponentType } from '../types';
import ComponentEditor from './ComponentEditor';
import PagePreview from './PagePreview';

export default function PageEditor() {
  const { state, dispatch } = useProject();
  const project = state.projects.find(p => p.id === state.currentProjectId);
  const page = project?.pages.find(p => p.id === state.currentPageId);

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  if (!project || !page) {
    return <div className="p-8">No page selected</div>;
  }

  const selectedComponent = page.components.find(c => c.id === selectedComponentId);
  const availableRoutes = project.pages.map(p => p.name);

  const addComponent = (type: ComponentType) => {
    let newComponent: PageComponent;

    switch (type) {
      case 'Header':
        newComponent = {
          id: uuidv4(),
          type: 'Header',
          content: 'New Header',
          level: 1,
          style: {},
        };
        break;
      case 'Text':
        newComponent = {
          id: uuidv4(),
          type: 'Text',
          content: 'New text',
          style: {},
        };
        break;
      case 'TextBox':
        newComponent = {
          id: uuidv4(),
          type: 'TextBox',
          name: 'new_field',
          defaultValue: '',
          style: {},
        };
        break;
      case 'TextArea':
        newComponent = {
          id: uuidv4(),
          type: 'TextArea',
          name: 'new_textarea',
          defaultValue: '',
          style: {},
        };
        break;
      case 'CheckBox':
        newComponent = {
          id: uuidv4(),
          type: 'CheckBox',
          name: 'new_checkbox',
          defaultValue: false,
          style: {},
        };
        break;
      case 'SelectBox':
        newComponent = {
          id: uuidv4(),
          type: 'SelectBox',
          name: 'new_select',
          options: ['Option 1', 'Option 2'],
          defaultValue: 'Option 1',
          style: {},
        };
        break;
      case 'Button':
        newComponent = {
          id: uuidv4(),
          type: 'Button',
          label: 'Click me',
          route: availableRoutes[0] || '',
          style: {},
        };
        break;
    }

    dispatch({
      type: 'ADD_COMPONENT',
      payload: {
        projectId: project.id,
        pageId: page.id,
        component: newComponent,
      },
    });
  };

  const saveComponent = (component: PageComponent) => {
    dispatch({
      type: 'UPDATE_COMPONENT',
      payload: {
        projectId: project.id,
        pageId: page.id,
        component,
      },
    });
    setSelectedComponentId(null);
  };

  const deleteComponent = (componentId: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      dispatch({
        type: 'DELETE_COMPONENT',
        payload: {
          projectId: project.id,
          pageId: page.id,
          componentId,
        },
      });
    }
  };

  const updatePageStyle = (styleProp: string, value: string) => {
    dispatch({
      type: 'UPDATE_PAGE',
      payload: {
        projectId: project.id,
        page: {
          ...page,
          style: { ...page.style, [styleProp]: value },
        },
      },
    });
  };

  const updatePageDescription = (description: string) => {
    dispatch({
      type: 'UPDATE_PAGE',
      payload: {
        projectId: project.id,
        page: {
          ...page,
          stateDescription: description,
        },
      },
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Page: {page.name}</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Left side - Component list and controls */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Components</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => addComponent('Header')}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  + Header
                </button>
                <button
                  onClick={() => addComponent('Text')}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  + Text
                </button>
                <button
                  onClick={() => addComponent('TextBox')}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  + TextBox
                </button>
                <button
                  onClick={() => addComponent('TextArea')}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  + TextArea
                </button>
                <button
                  onClick={() => addComponent('CheckBox')}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  + CheckBox
                </button>
                <button
                  onClick={() => addComponent('SelectBox')}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  + SelectBox
                </button>
                <button
                  onClick={() => addComponent('Button')}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  + Button
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Components List</h2>
              {page.components.length === 0 ? (
                <div className="text-gray-500 py-4">No components yet</div>
              ) : (
                <div className="space-y-2">
                  {page.components.map((comp, idx) => (
                    <div key={comp.id} className="border border-gray-300 rounded p-3 flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{idx + 1}. {comp.type}</span>
                        {comp.type === 'Header' && <span className="text-gray-600 ml-2">- {comp.content}</span>}
                        {comp.type === 'Text' && <span className="text-gray-600 ml-2">- {comp.content.substring(0, 30)}</span>}
                        {(comp.type === 'TextBox' || comp.type === 'TextArea' || comp.type === 'CheckBox' || comp.type === 'SelectBox') && (
                          <span className="text-gray-600 ml-2">- {comp.name}</span>
                        )}
                        {comp.type === 'Button' && <span className="text-gray-600 ml-2">- {comp.label}</span>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedComponentId(comp.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteComponent(comp.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedComponent && (
              <ComponentEditor
                component={selectedComponent}
                availableRoutes={availableRoutes}
                onSave={saveComponent}
                onCancel={() => setSelectedComponentId(null)}
              />
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Page Styling</h2>
              <button
                onClick={() => setShowStyleEditor(!showStyleEditor)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                {showStyleEditor ? 'Hide' : 'Show'} Style Editor
              </button>

              {showStyleEditor && (
                <div className="mt-4 border border-gray-300 rounded p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Background Color</label>
                      <input
                        type="text"
                        value={page.style.backgroundColor || ''}
                        onChange={(e) => updatePageStyle('backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Text Color</label>
                      <input
                        type="text"
                        value={page.style.color || ''}
                        onChange={(e) => updatePageStyle('color', e.target.value)}
                        placeholder="#000000"
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Padding</label>
                      <input
                        type="text"
                        value={page.style.padding || ''}
                        onChange={(e) => updatePageStyle('padding', e.target.value)}
                        placeholder="16px"
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Display</label>
                      <select
                        value={page.style.display || 'block'}
                        onChange={(e) => updatePageStyle('display', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="block">Block</option>
                        <option value="flex">Flex</option>
                        <option value="grid">Grid</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">State Description</h2>
              <textarea
                value={page.stateDescription}
                onChange={(e) => updatePageDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
                placeholder="Describe how this page modifies the state..."
              />
            </div>
          </div>

          {/* Right side - Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <PagePreview page={page} />
          </div>
        </div>
      </div>
    </div>
  );
}
