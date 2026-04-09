import { useCallback, useState, type MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ReactFlow,
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useProject } from '../context/ProjectContext';
import type { Page as PageType, Route } from '../types';

export default function PageGraph() {
  const { state, dispatch } = useProject();
  const project = state.projects.find(p => p.id === state.currentProjectId);

  const [pageName, setPageName] = useState('');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [edgeLabel, setEdgeLabel] = useState('');

  // Convert pages to nodes
  const initialNodes: Node[] = project?.pages.map(page => ({
    id: page.id,
    type: 'default',
    position: page.position,
    data: { label: page.name },
  })) || [];

  // Convert routes to edges
  const initialEdges: Edge[] = project?.routes.map(route => ({
    id: route.id,
    source: route.sourcePageId,
    target: route.targetPageId,
    label: route.name,
    type: 'smoothstep',
  })) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync nodes back to project pages
  const onNodeDragStop = useCallback(
    (_event: MouseEvent, node: Node) => {
      if (!project) return;
      const page = project.pages.find(p => p.id === node.id);
      if (page) {
        dispatch({
          type: 'UPDATE_PAGE',
          payload: {
            projectId: project.id,
            page: { ...page, position: node.position },
          },
        });
      }
    },
    [project, dispatch]
  );

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!project) return;
      if (connection.source && connection.target) {
        const newRoute: Route = {
          id: uuidv4(),
          sourcePageId: connection.source,
          targetPageId: connection.target,
          name: 'new_route',
          stateDescription: '',
          ifAnnotations: [],
          forAnnotations: [],
        };
        dispatch({
          type: 'ADD_ROUTE',
          payload: { projectId: project.id, route: newRoute },
        });
        setEdges((eds) => addEdge({ ...connection, id: newRoute.id, label: newRoute.name, type: 'smoothstep' }, eds));
      }
    },
    [project, dispatch, setEdges]
  );

  if (!project) {
    return <div className="p-8">No project selected</div>;
  }

  const addPage = () => {
    if (!pageName.trim()) {
      alert('Please enter a page name');
      return;
    }

    const newPage: PageType = {
      id: uuidv4(),
      name: pageName,
      components: [],
      style: {},
      stateDescription: '',
      ifAnnotations: [],
      forAnnotations: [],
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    dispatch({
      type: 'ADD_PAGE',
      payload: { projectId: project.id, page: newPage },
    });

    setNodes((nds) => [
      ...nds,
      {
        id: newPage.id,
        position: newPage.position,
        data: { label: newPage.name },
      },
    ]);

    setPageName('');
  };

  const deletePage = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      dispatch({
        type: 'DELETE_PAGE',
        payload: { projectId: project.id, pageId },
      });
      setNodes((nds) => nds.filter(n => n.id !== pageId));
      setEdges((eds) => eds.filter(e => e.source !== pageId && e.target !== pageId));
    }
  };

  const handleEdgeClick = (_event: MouseEvent, edge: Edge) => {
    const route = project.routes.find(r => r.id === edge.id);
    if (route) {
      setSelectedEdgeId(edge.id);
      setEdgeLabel(route.name);
    }
  };

  const updateEdgeLabel = () => {
    if (selectedEdgeId) {
      const route = project.routes.find(r => r.id === selectedEdgeId);
      if (route) {
        dispatch({
          type: 'UPDATE_ROUTE',
          payload: {
            projectId: project.id,
            route: { ...route, name: edgeLabel },
          },
        });
        setEdges((eds) =>
          eds.map(e =>
            e.id === selectedEdgeId ? { ...e, label: edgeLabel } : e
          )
        );
        setSelectedEdgeId(null);
        setEdgeLabel('');
      }
    }
  };

  const deleteRoute = (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      dispatch({
        type: 'DELETE_ROUTE',
        payload: { projectId: project.id, routeId },
      });
      setEdges((eds) => eds.filter(e => e.id !== routeId));
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold mb-4">Page Graph</h1>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold mb-1">Add Page</label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Page name"
              className="border border-gray-300 rounded px-3 py-2"
              onKeyPress={(e) => e.key === 'Enter' && addPage()}
            />
          </div>
          <button
            onClick={addPage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Page
          </button>
        </div>

        {selectedEdgeId && (
          <div className="mt-4 flex gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold mb-1">Edit Route Label</label>
              <input
                type="text"
                value={edgeLabel}
                onChange={(e) => setEdgeLabel(e.target.value)}
                placeholder="Route name"
                className="border border-gray-300 rounded px-3 py-2"
                onKeyPress={(e) => e.key === 'Enter' && updateEdgeLabel()}
              />
            </div>
            <button
              onClick={updateEdgeLabel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Label
            </button>
            <button
              onClick={() => {
                deleteRoute(selectedEdgeId);
                setSelectedEdgeId(null);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Route
            </button>
          </div>
        )}

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Pages:</h3>
          <div className="flex flex-wrap gap-2">
            {project.pages.map(page => (
              <div key={page.id} className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2">
                <span>{page.name}</span>
                <button
                  onClick={() => {
                    dispatch({ type: 'SET_CURRENT_PAGE', payload: page.id });
                    dispatch({ type: 'SET_VIEW_MODE', payload: 'page' });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePage(page.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onEdgeClick={handleEdgeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
