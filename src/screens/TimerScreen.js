import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { Play, Pause, Square, ChevronDown } from 'lucide-react-native';
import { useTimer } from '../context/TimerContext';
import { useProjects } from '../context/ProjectContext';

export default function TimerScreen() {
  const {
    isRunning,
    elapsedTime,
    currentProject,
    startTimer,
    stopTimer,
    resetTimer,
    setCurrentProject,
    formatTime,
  } = useTimer();

  const { projects } = useProjects();
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  const timeDisplay = formatTime(elapsedTime);

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setShowProjectSelector(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Project Selector */}
        <View style={styles.projectSection}>
          <Text style={styles.sectionTitle}>Current Project</Text>
          <TouchableOpacity
            style={[
              styles.projectSelector,
              { borderColor: currentProject?.color || '#E2E8F0' }
            ]}
            onPress={() => setShowProjectSelector(true)}
          >
            <View style={styles.projectInfo}>
              {currentProject ? (
                <>
                  <View
                    style={[
                      styles.projectColorDot,
                      { backgroundColor: currentProject.color }
                    ]}
                  />
                  <View style={styles.projectDetails}>
                    <Text style={styles.projectName}>{currentProject.name}</Text>
                    <Text style={styles.clientName}>{currentProject.clientName}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.selectProjectText}>Select a project</Text>
              )}
            </View>
            <ChevronDown size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Timer Display */}
        <View style={styles.timerSection}>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>
              {timeDisplay.hours}
            </Text>
            <Text style={styles.timerSeparator}>:</Text>
            <Text style={styles.timerText}>
              {timeDisplay.minutes}
            </Text>
            <Text style={styles.timerSeparator}>:</Text>
            <Text style={styles.timerText}>
              {timeDisplay.seconds}
            </Text>
          </View>
          <View style={styles.timerLabels}>
            <Text style={styles.timerLabel}>HOURS</Text>
            <Text style={styles.timerLabel}>MINS</Text>
            <Text style={styles.timerLabel}>SECS</Text>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: isRunning ? '#EF4444' : '#10B981',
              }
            ]}
            onPress={isRunning ? stopTimer : startTimer}
            disabled={!currentProject}
          >
            {isRunning ? (
              <Pause size={24} color="#FFFFFF" />
            ) : (
              <Play size={24} color="#FFFFFF" />
            )}
            <Text style={styles.primaryButtonText}>
              {isRunning ? 'Stop' : 'Start'}
            </Text>
          </TouchableOpacity>

          {elapsedTime > 0 && !isRunning && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={resetTimer}
            >
              <Square size={20} color="#64748B" />
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Current Session Info */}
        {currentProject && elapsedTime > 0 && (
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>Current Session</Text>
            <View style={styles.sessionDetails}>
              <Text style={styles.sessionText}>
                Duration: {timeDisplay.formatted}
              </Text>
              <Text style={styles.sessionText}>
                Estimated: ${((elapsedTime / 1000 / 3600) * currentProject.hourlyRate).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Project Selector Modal */}
      <Modal
        visible={showProjectSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Project</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowProjectSelector(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={styles.projectOption}
                onPress={() => handleProjectSelect(project)}
              >
                <View
                  style={[
                    styles.projectColorDot,
                    { backgroundColor: project.color }
                  ]}
                />
                <View style={styles.projectDetails}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.clientName}>{project.clientName}</Text>
                  <Text style={styles.hourlyRate}>${project.hourlyRate}/hr</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  projectSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  projectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  projectDetails: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  clientName: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectProjectText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 64,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'monospace',
    minWidth: 120,
    textAlign: 'center',
  },
  timerSeparator: {
    fontSize: 64,
    fontWeight: '300',
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  timerLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    paddingHorizontal: 20,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    letterSpacing: 1,
  },
  controlsSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginBottom: 16,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 6,
  },
  sessionInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
    color: '#374151',
    marginBottom: 12,
  },
  sessionDetails: {
    gap: 8,
  },
  sessionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  projectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  hourlyRate: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 2,
  },
});