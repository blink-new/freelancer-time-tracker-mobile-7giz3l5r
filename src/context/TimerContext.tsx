import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Project {
  id: string;
  name: string;
  clientName: string;
  hourlyRate: number;
  color: string;
}

interface Session {
  id: string;
  projectId: string;
  startTime: string;
  endTime: string;
  duration: number;
}

interface TimerContextType {
  isRunning: boolean;
  elapsedTime: number;
  currentProject: Project | null;
  sessions: Session[];
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setCurrentProject: (project: Project | null) => void;
  formatTime: (milliseconds: number) => {
    hours: string;
    minutes: string;
    seconds: string;
    formatted: string;
  };
  clearAllSessions: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load sessions from storage on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Save sessions to storage whenever sessions change
  useEffect(() => {
    saveSessions();
  }, [sessions]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        setElapsedTime(now.getTime() - startTime.getTime());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime]);

  const loadSessions = async () => {
    try {
      const storedSessions = await AsyncStorage.getItem('timer_sessions');
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const saveSessions = async () => {
    try {
      await AsyncStorage.setItem('timer_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  const startTimer = () => {
    if (!currentProject) return;
    
    const now = new Date();
    setStartTime(now);
    setElapsedTime(0);
    setIsRunning(true);
  };

  const stopTimer = () => {
    if (!isRunning || !startTime || !currentProject) return;

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Create new session
    const newSession: Session = {
      id: `session_${Date.now()}`,
      projectId: currentProject.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
    };

    setSessions(prev => [...prev, newSession]);
    setIsRunning(false);
    setStartTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      formatted: `${hours}h ${minutes}m ${seconds}s`,
    };
  };

  const clearAllSessions = () => {
    setSessions([]);
    resetTimer();
  };

  const value: TimerContextType = {
    isRunning,
    elapsedTime,
    currentProject,
    sessions,
    startTimer,
    stopTimer,
    resetTimer,
    setCurrentProject,
    formatTime,
    clearAllSessions,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};