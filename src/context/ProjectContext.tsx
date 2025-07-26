import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Project {
  id: string;
  name: string;
  client: string;
  hourlyRate: number;
  color: string;
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;
  clearAllProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load projects from storage on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Save projects to storage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      saveProjects();
    }
  }, [projects]);

  // Auto-select first project if none selected
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const loadProjects = async () => {
    try {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects(parsedProjects);
      } else {
        // Add some default projects for demo
        const defaultProjects: Project[] = [
          {
            id: 'project_1',
            name: 'Website Design',
            client: 'Acme Corp',
            hourlyRate: 75,
            color: '#3B82F6',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'project_2',
            name: 'Mobile App',
            client: 'Tech Startup',
            hourlyRate: 100,
            color: '#10B981',
            createdAt: new Date().toISOString(),
          },
        ];
        setProjects(defaultProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const saveProjects = async () => {
    try {
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const clearAllProjects = async () => {
    setProjects([]);
    setSelectedProject(null);
    try {
      await AsyncStorage.removeItem('projects');
    } catch (error) {
      console.error('Error clearing projects:', error);
    }
  };

  const value: ProjectContextType = {
    projects,
    selectedProject,
    setSelectedProject,
    addProject,
    updateProject,
    deleteProject,
    clearAllProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};