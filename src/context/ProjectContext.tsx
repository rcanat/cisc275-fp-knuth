/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react';
import type { AppState, Action } from '../types';
import { loadProjects, saveProjects } from '../utils/storage';
import { demoProjects } from '../data/demoProjects';

const initialState: AppState = {
  projects: [],
  currentProjectId: null,
  currentPageId: null,
  viewMode: 'dashboard',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };

    case 'UPDATE_PROJECT': {
      const updatedProjects = state.projects.map(p =>
        p.id === action.payload.id ? { ...action.payload, updatedAt: new Date().toISOString() } : p
      );
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProjectId: state.currentProjectId === action.payload ? null : state.currentProjectId,
      };

    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProjectId: action.payload, currentPageId: null };

    case 'SET_CURRENT_PAGE':
      return { ...state, currentPageId: action.payload };

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    case 'ADD_PAGE': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: [...p.pages, action.payload.page],
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'UPDATE_PAGE': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page =>
              page.id === action.payload.page.id ? action.payload.page : page
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_PAGE': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.filter(page => page.id !== action.payload.pageId),
            routes: p.routes.filter(
              route =>
                route.sourcePageId !== action.payload.pageId &&
                route.targetPageId !== action.payload.pageId
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return {
        ...state,
        projects: updatedProjects,
        currentPageId: state.currentPageId === action.payload.pageId ? null : state.currentPageId,
      };
    }

    case 'ADD_ROUTE': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            routes: [...p.routes, action.payload.route],
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'UPDATE_ROUTE': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            routes: p.routes.map(route =>
              route.id === action.payload.route.id ? action.payload.route : route
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_ROUTE': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            routes: p.routes.filter(route => route.id !== action.payload.routeId),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'ADD_COMPONENT': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page => {
              if (page.id === action.payload.pageId) {
                return {
                  ...page,
                  components: [...page.components, action.payload.component],
                };
              }
              return page;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'UPDATE_COMPONENT': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page => {
              if (page.id === action.payload.pageId) {
                return {
                  ...page,
                  components: page.components.map(comp =>
                    comp.id === action.payload.component.id ? action.payload.component : comp
                  ),
                };
              }
              return page;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_COMPONENT': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page => {
              if (page.id === action.payload.pageId) {
                return {
                  ...page,
                  components: page.components.filter(comp => comp.id !== action.payload.componentId),
                };
              }
              return page;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'UPDATE_STATE_MODEL': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            stateModel: action.payload.stateModel,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'ADD_PAGE_IF_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page => {
              if (page.id === action.payload.pageId) {
                return {
                  ...page,
                  ifAnnotations: [...page.ifAnnotations, action.payload.annotation],
                };
              }
              return page;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_PAGE_IF_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page => {
              if (page.id === action.payload.pageId) {
                return {
                  ...page,
                  ifAnnotations: page.ifAnnotations.filter(a => a.id !== action.payload.annotationId),
                };
              }
              return page;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'ADD_PAGE_FOR_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page => {
              if (page.id === action.payload.pageId) {
                return {
                  ...page,
                  forAnnotations: [...page.forAnnotations, action.payload.annotation],
                };
              }
              return page;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_PAGE_FOR_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            pages: p.pages.map(page => {
              if (page.id === action.payload.pageId) {
                return {
                  ...page,
                  forAnnotations: page.forAnnotations.filter(a => a.id !== action.payload.annotationId),
                };
              }
              return page;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'ADD_ROUTE_IF_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            routes: p.routes.map(route => {
              if (route.id === action.payload.routeId) {
                return {
                  ...route,
                  ifAnnotations: [...route.ifAnnotations, action.payload.annotation],
                };
              }
              return route;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_ROUTE_IF_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            routes: p.routes.map(route => {
              if (route.id === action.payload.routeId) {
                return {
                  ...route,
                  ifAnnotations: route.ifAnnotations.filter(a => a.id !== action.payload.annotationId),
                };
              }
              return route;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'ADD_ROUTE_FOR_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            routes: p.routes.map(route => {
              if (route.id === action.payload.routeId) {
                return {
                  ...route,
                  forAnnotations: [...route.forAnnotations, action.payload.annotation],
                };
              }
              return route;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    case 'DELETE_ROUTE_FOR_ANNOTATION': {
      const updatedProjects = state.projects.map(p => {
        if (p.id === action.payload.projectId) {
          return {
            ...p,
            routes: p.routes.map(route => {
              if (route.id === action.payload.routeId) {
                return {
                  ...route,
                  forAnnotations: route.forAnnotations.filter(a => a.id !== action.payload.annotationId),
                };
              }
              return route;
            }),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      return { ...state, projects: updatedProjects };
    }

    default:
      return state;
  }
}

interface ProjectContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load projects on mount
  useEffect(() => {
    const stored = loadProjects();
    if (stored.length > 0) {
      dispatch({ type: 'SET_PROJECTS', payload: stored });
    } else {
      // Load demo projects if no stored projects
      dispatch({ type: 'SET_PROJECTS', payload: demoProjects });
    }
  }, []);

  // Save projects whenever they change
  useEffect(() => {
    if (state.projects.length > 0) {
      saveProjects(state.projects);
    }
  }, [state.projects]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
