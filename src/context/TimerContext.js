import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerContext = createContext();

const initialState = {
  isRunning: false,
  elapsedTime: 0,
  startTime: null,
  currentProject: null,
  sessions: [],
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        startTime: Date.now() - state.elapsedTime,
      };
    case 'STOP_TIMER':
      return {
        ...state,
        isRunning: false,
      };
    case 'RESET_TIMER':
      return {
        ...state,
        elapsedTime: 0,
        isRunning: false,
        startTime: null,
      };
    case 'UPDATE_ELAPSED_TIME':
      return {
        ...state,
        elapsedTime: action.payload,
      };
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
      };
    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
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

export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load saved state on app start
  useEffect(() => {
    loadTimerState();
  }, []);

  // Save state when it changes
  useEffect(() => {
    saveTimerState();
  }, [state]);

  // Update elapsed time when timer is running
  useEffect(() => {
    let interval;
    if (state.isRunning && state.startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - state.startTime;
        dispatch({ type: 'UPDATE_ELAPSED_TIME', payload: elapsed });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [state.isRunning, state.startTime]);

  const loadTimerState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('timerState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // If timer was running when app closed, calculate elapsed time
        if (parsedState.isRunning && parsedState.startTime) {
          const now = Date.now();
          const elapsed = now - parsedState.startTime;
          parsedState.elapsedTime = elapsed;
        }
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
  };

  const saveTimerState = async () => {
    try {
      await AsyncStorage.setItem('timerState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  };

  const startTimer = () => {
    if (!state.currentProject) {
      alert('Please select a project first');
      return;
    }
    dispatch({ type: 'START_TIMER' });
  };

  const stopTimer = () => {
    if (state.isRunning && state.elapsedTime > 0) {
      // Create a session record
      const session = {
        id: Date.now().toString(),
        projectId: state.currentProject.id,
        projectName: state.currentProject.name,
        clientName: state.currentProject.clientName,
        startTime: state.startTime,
        endTime: Date.now(),
        duration: state.elapsedTime,
        date: new Date().toISOString().split('T')[0],
      };
      
      dispatch({ type: 'ADD_SESSION', payload: session });
      dispatch({ type: 'STOP_TIMER' });
      dispatch({ type: 'RESET_TIMER' });
    } else {
      dispatch({ type: 'STOP_TIMER' });
    }
  };

  const resetTimer = () => {
    dispatch({ type: 'RESET_TIMER' });
  };

  const setCurrentProject = (project) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    };
  };

  const value = {
    ...state,
    startTimer,
    stopTimer,
    resetTimer,
    setCurrentProject,
    formatTime,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}