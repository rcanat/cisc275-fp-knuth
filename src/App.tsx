
import { ProjectProvider, useProject } from './context/ProjectContext';
import Dashboard from './components/Dashboard';
import ProjectOverview from './components/ProjectOverview';
import PageGraph from './components/PageGraph';
import PageEditor from './components/PageEditor';
import StateEditor from './components/StateEditor';
import ExportPanel from './components/ExportPanel';
import './App.css';

function AppContent() {
  const { state, dispatch } = useProject();

  const renderView = () => {
    switch (state.viewMode) {
      case 'dashboard':
        return <Dashboard />;
      case 'overview':
        return <ProjectOverview />;
      case 'graph':
        return <PageGraph />;
      case 'page':
        return <PageEditor />;
      case 'state':
        return <StateEditor />;
      case 'export':
        return <ExportPanel />;
      default:
        return <Dashboard />;
    }
  };

  const currentProject = state.projects.find(p => p.id === state.currentProjectId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {currentProject && (
        <nav className="bg-white border-b border-gray-300 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
                  dispatch({ type: 'SET_VIEW_MODE', payload: 'dashboard' });
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back to Dashboard
              </button>
              <span className="text-gray-400">|</span>
              <span className="font-semibold text-gray-700">{currentProject.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'overview' })}
                className={`px-4 py-2 rounded ${
                  state.viewMode === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'graph' })}
                className={`px-4 py-2 rounded ${
                  state.viewMode === 'graph'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Page Graph
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'state' })}
                className={`px-4 py-2 rounded ${
                  state.viewMode === 'state'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                State Model
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'export' })}
                className={`px-4 py-2 rounded ${
                  state.viewMode === 'export'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Export
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main>{renderView()}</main>
    </div>
  );
}

export function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}

export default App;
