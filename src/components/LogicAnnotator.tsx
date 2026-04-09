import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useProject } from '../context/ProjectContext';
import type { IfAnnotation, ForAnnotation } from '../types';

export default function LogicAnnotator() {
  const { state, dispatch } = useProject();
  const project = state.projects.find(p => p.id === state.currentProjectId);

  const [selectedType, setSelectedType] = useState<'page' | 'route'>('page');
  const [selectedId, setSelectedId] = useState<string>('');
  const [ifDescription, setIfDescription] = useState('');
  const [forDescription, setForDescription] = useState('');

  if (!project) {
    return <div className="p-8">No project selected</div>;
  }

  const selectedPage = selectedType === 'page' ? project.pages.find(p => p.id === selectedId) : null;
  const selectedRoute = selectedType === 'route' ? project.routes.find(r => r.id === selectedId) : null;

  const addIfAnnotation = () => {
    if (!ifDescription.trim()) {
      alert('Please enter a description');
      return;
    }

    const annotation: IfAnnotation = {
      id: uuidv4(),
      description: ifDescription,
    };

    if (selectedType === 'page' && selectedPage) {
      dispatch({
        type: 'ADD_PAGE_IF_ANNOTATION',
        payload: {
          projectId: project.id,
          pageId: selectedPage.id,
          annotation,
        },
      });
    } else if (selectedType === 'route' && selectedRoute) {
      dispatch({
        type: 'ADD_ROUTE_IF_ANNOTATION',
        payload: {
          projectId: project.id,
          routeId: selectedRoute.id,
          annotation,
        },
      });
    }

    setIfDescription('');
  };

  const addForAnnotation = () => {
    if (!forDescription.trim()) {
      alert('Please enter a description');
      return;
    }

    const annotation: ForAnnotation = {
      id: uuidv4(),
      description: forDescription,
    };

    if (selectedType === 'page' && selectedPage) {
      dispatch({
        type: 'ADD_PAGE_FOR_ANNOTATION',
        payload: {
          projectId: project.id,
          pageId: selectedPage.id,
          annotation,
        },
      });
    } else if (selectedType === 'route' && selectedRoute) {
      dispatch({
        type: 'ADD_ROUTE_FOR_ANNOTATION',
        payload: {
          projectId: project.id,
          routeId: selectedRoute.id,
          annotation,
        },
      });
    }

    setForDescription('');
  };

  const deleteIfAnnotation = (annotationId: string) => {
    if (selectedType === 'page' && selectedPage) {
      dispatch({
        type: 'DELETE_PAGE_IF_ANNOTATION',
        payload: {
          projectId: project.id,
          pageId: selectedPage.id,
          annotationId,
        },
      });
    } else if (selectedType === 'route' && selectedRoute) {
      dispatch({
        type: 'DELETE_ROUTE_IF_ANNOTATION',
        payload: {
          projectId: project.id,
          routeId: selectedRoute.id,
          annotationId,
        },
      });
    }
  };

  const deleteForAnnotation = (annotationId: string) => {
    if (selectedType === 'page' && selectedPage) {
      dispatch({
        type: 'DELETE_PAGE_FOR_ANNOTATION',
        payload: {
          projectId: project.id,
          pageId: selectedPage.id,
          annotationId,
        },
      });
    } else if (selectedType === 'route' && selectedRoute) {
      dispatch({
        type: 'DELETE_ROUTE_FOR_ANNOTATION',
        payload: {
          projectId: project.id,
          routeId: selectedRoute.id,
          annotationId,
        },
      });
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Logic Annotations</h1>

        <div className="space-y-6">
          {/* Selection */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Select Page or Route</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={selectedType === 'page'}
                    onChange={() => {
                      setSelectedType('page');
                      setSelectedId('');
                    }}
                  />
                  <span>Page</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={selectedType === 'route'}
                    onChange={() => {
                      setSelectedType('route');
                      setSelectedId('');
                    }}
                  />
                  <span>Route</span>
                </label>
              </div>

              <div>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select...</option>
                  {selectedType === 'page' ? (
                    project.pages.map(page => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))
                  ) : (
                    project.routes.map(route => {
                      const sourcePage = project.pages.find(p => p.id === route.sourcePageId);
                      const targetPage = project.pages.find(p => p.id === route.targetPageId);
                      return (
                        <option key={route.id} value={route.id}>
                          {sourcePage?.name || 'Unknown'} → {targetPage?.name || 'Unknown'} ({route.name})
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* If Annotations */}
          {selectedId && (
            <div className="border border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">If Statement Annotations</h2>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={ifDescription}
                    onChange={(e) => setIfDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={3}
                    placeholder="Describe an if statement (e.g., 'If user is logged in, show personalized content')"
                  />
                  <button
                    onClick={addIfAnnotation}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add If Statement
                  </button>
                </div>

                <div className="space-y-2">
                  {(selectedPage?.ifAnnotations || selectedRoute?.ifAnnotations || []).length === 0 ? (
                    <div className="text-gray-500">No if annotations yet</div>
                  ) : (
                    (selectedPage?.ifAnnotations || selectedRoute?.ifAnnotations || []).map(annotation => (
                      <div key={annotation.id} className="bg-gray-100 p-3 rounded flex justify-between items-start">
                        <div>{annotation.description}</div>
                        <button
                          onClick={() => deleteIfAnnotation(annotation.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* For Annotations */}
          {selectedId && (
            <div className="border border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">For Loop Annotations</h2>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={forDescription}
                    onChange={(e) => setForDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={3}
                    placeholder="Describe a for loop (e.g., 'Loop through all todos to display them')"
                  />
                  <button
                    onClick={addForAnnotation}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Add For Loop
                  </button>
                </div>

                <div className="space-y-2">
                  {(selectedPage?.forAnnotations || selectedRoute?.forAnnotations || []).length === 0 ? (
                    <div className="text-gray-500">No for loop annotations yet</div>
                  ) : (
                    (selectedPage?.forAnnotations || selectedRoute?.forAnnotations || []).map(annotation => (
                      <div key={annotation.id} className="bg-gray-100 p-3 rounded flex justify-between items-start">
                        <div>{annotation.description}</div>
                        <button
                          onClick={() => deleteForAnnotation(annotation.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
