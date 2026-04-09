import { v4 as uuidv4 } from 'uuid';
import { useProject } from '../context/ProjectContext';
import type { Project } from '../types';

export default function Dashboard() {
  const { state, dispatch } = useProject();

  const createNewProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: 'New Project',
      purpose: '',
      pages: [],
      routes: [],
      stateModel: {
        attributes: [],
        secondaryDataclasses: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject.id });
    dispatch({ type: 'SET_VIEW_MODE', payload: 'overview' });
  };

  const openProject = (projectId: string) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: projectId });
    dispatch({ type: 'SET_VIEW_MODE', payload: 'overview' });
  };

  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Drafter Drafter</h1>
        <p className="text-gray-600 mb-8">Plan and design your Drafter web applications</p>

        <button
          onClick={createNewProject}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-8 font-semibold"
        >
          New Project
        </button>

        <div className="grid gap-4">
          {state.projects.length === 0 ? (
            <div className="text-gray-500 text-center py-12">
              No projects yet. Create your first project to get started!
            </div>
          ) : (
            state.projects.map(project => (
              <div
                key={project.id}
                className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">{project.name}</h2>
                    <p className="text-gray-600 mb-2">{project.purpose || 'No purpose specified'}</p>
                    <p className="text-sm text-gray-500">
                      Last modified: {formatDate(project.updatedAt)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {project.pages.length} pages, {project.routes.length} routes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openProject(project.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
