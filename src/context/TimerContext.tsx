import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Session {
  id: string;
  projectId: string;
  startTime: string;
  endTime?: string;
  duration: number;
}

interface TimerContextType {
  isRunning: boolean;
  elapsedTime: number;
  currentSession: Session | null;
  sessions: Session[];
  startTimer: (projectId: string) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
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
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load sessions from storage on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Save sessions to storage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions();
    }
  }, [sessions]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
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

  const startTimer = (projectId: string) => {
    const now = new Date();
    const newSession: Session = {
      id: `session_${Date.now()}`,
      projectId,
      startTime: now.toISOString(),
      duration: 0,
    };

    setStartTime(now);
    setElapsedTime(0);
    setCurrentSession(newSession);
    setIsRunning(true);
  };

  const stopTimer = () => {
    if (!isRunning || !startTime || !currentSession) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const completedSession: Session = {
      ...currentSession,
      endTime: endTime.toISOString(),
      duration,
    };

    setSessions(prev => [...prev, completedSession]);
    setIsRunning(false);
    setStartTime(null);
    setCurrentSession(null);
    setElapsedTime(0);
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      setStartTime(null);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    setCurrentSession(null);
  };

  const clearAllSessions = async () => {
    setSessions([]);
    resetTimer();
    try {
      await AsyncStorage.removeItem('timer_sessions');
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  };

  const value: TimerContextType = {
    isRunning,
    elapsedTime,
    currentSession,
    sessions,
    startTimer,
    stopTimer,
    pauseTimer,
    resetTimer,
    clearAllSessions,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};