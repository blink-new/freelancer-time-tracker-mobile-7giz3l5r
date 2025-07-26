import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTimer } from '../src/context/TimerContext';
import { useProject } from '../src/context/ProjectContext';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function TimerScreen() {
  const { 
    isRunning, 
    elapsedTime, 
    currentSession, 
    startTimer, 
    stopTimer, 
    pauseTimer 
  } = useTimer();
  const { projects, selectedProject, setSelectedProject } = useProject();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!selectedProject) {
      Alert.alert('No Project Selected', 'Please select a project before starting the timer.');
      return;
    }

    if (isRunning) {
      stopTimer();
    } else {
      startTimer(selectedProject.id);
    }
  };

  const handleProjectSelect = () => {
    if (projects.length === 0) {
      Alert.alert('No Projects', 'Please create a project first in the Projects tab.');
      return;
    }
    
    // Simple project selection - cycle through projects
    const currentIndex = projects.findIndex(p => p.id === selectedProject?.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    setSelectedProject(projects[nextIndex]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Time Tracker</Text>
        <Text style={styles.subtitle}>Track your billable hours</Text>
      </View>

      {/* Project Selection */}
      <TouchableOpacity style={styles.projectSelector} onPress={handleProjectSelect}>
        <View style={styles.projectInfo}>
          {selectedProject ? (
            <>
              <View 
                style={[
                  styles.projectColor, 
                  { backgroundColor: selectedProject.color }
                ]} 
              />
              <View>
                <Text style={styles.projectName}>{selectedProject.name}</Text>
                <Text style={styles.clientName}>{selectedProject.client}</Text>
              </View>
            </>
          ) : (
            <View>
              <Text style={styles.projectName}>No Project Selected</Text>
              <Text style={styles.clientName}>Tap to select a project</Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-down" size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        <Text style={styles.timerLabel}>
          {isRunning ? 'Timer Running' : 'Timer Stopped'}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.mainButton,
            { backgroundColor: isRunning ? '#EF4444' : '#10B981' }
          ]}
          onPress={handleStartStop}
        >
          <Ionicons 
            name={isRunning ? 'stop' : 'play'} 
            size={32} 
            color="white" 
          />
          <Text style={styles.buttonText}>
            {isRunning ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>

        {isRunning && (
          <TouchableOpacity
            style={[styles.secondaryButton]}
            onPress={pauseTimer}
          >
            <Ionicons name="pause" size={24} color="#2563EB" />
            <Text style={styles.secondaryButtonText}>Pause</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Session Info */}
      {currentSession && (
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>Current Session</Text>
          <Text style={styles.sessionDetails}>
            Started: {new Date(currentSession.startTime).toLocaleTimeString()}
          </Text>
          {selectedProject && (
            <Text style={styles.sessionDetails}>
              Rate: ${selectedProject.hourlyRate}/hour
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  projectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clientName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  timerText: {
    fontSize: Math.min(width * 0.15, 72),
    fontWeight: 'bold',
    color: '#2563EB',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.6,
    height: 60,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.4,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  sessionInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sessionDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});