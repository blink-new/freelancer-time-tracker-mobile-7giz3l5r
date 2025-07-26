import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectContext = createContext();

const initialState = {
  projects: [
    {
      id: '1',
      name: 'Website Redesign',
      clientName: 'Acme Corp',
      color: '#2563EB',
      hourlyRate: 75,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Mobile App Development',
      clientName: 'TechStart Inc',
      color: '#10B981',
      hourlyRate: 85,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Brand Identity',
      clientName: 'Creative Studio',
      color: '#F59E0B',
      hourlyRate: 65,
      createdAt: new Date().toISOString(),
    },
  ],
  clients: [
    { id: '1', name: 'Acme Corp', color: '#2563EB' },
    { id: '2', name: 'TechStart Inc', color: '#10B981' },
    { id: '3', name: 'Creative Studio', color: '#F59E0B' },
  ],
};

function projectReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Load saved state on app start
  useEffect(() => {
    loadProjectState();
  }, []);

  // Save state when it changes
  useEffect(() => {
    saveProjectState();
  }, [state]);

  const loadProjectState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('projectState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading project state:', error);
    }
  };

  const saveProjectState = async () => {
    try {
      await AsyncStorage.setItem('projectState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving project state:', error);
    }
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
  };

  const deleteProject = (projectId) => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
  };

  const addClient = (client) => {
    const newClient = {
      ...client,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
  };

  const updateClient = (client) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: client });
  };

  const deleteClient = (clientId) => {
    dispatch({ type: 'DELETE_CLIENT', payload: clientId });
  };

  const getProjectsByClient = (clientName) => {
    return state.projects.filter(project => project.clientName === clientName);
  };

  const value = {
    ...state,
    addProject,
    updateProject,
    deleteProject,
    addClient,
    updateClient,
    deleteClient,
    getProjectsByClient,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}