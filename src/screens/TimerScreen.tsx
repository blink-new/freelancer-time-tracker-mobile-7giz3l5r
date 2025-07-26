import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, Square, ChevronDown } from 'lucide-react-native';
import { useTimer } from '../context/TimerContext';
import { useProjects } from '../context/ProjectContext';

const { width: screenWidth } = Dimensions.get('window');

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

  const handleProjectSelect = (project: any) => {
    setCurrentProject(project);
    setShowProjectSelector(false);
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <View style={styles.timeUnit}>
              <Text style={styles.timerText}>{timeDisplay.hours}</Text>
              <Text style={styles.timerLabel}>HOURS</Text>
            </View>
            <Text style={styles.timerSeparator}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timerText}>{timeDisplay.minutes}</Text>
              <Text style={styles.timerLabel}>MINS</Text>
            </View>
            <Text style={styles.timerSeparator}>:</Text>
            <View style={styles.timeUnit}>
              <Text style={styles.timerText}>{timeDisplay.seconds}</Text>
              <Text style={styles.timerLabel}>SECS</Text>
            </View>
          </View>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsSection}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: isRunning ? '#EF4444' : '#10B981',
                opacity: !currentProject ? 0.5 : 1,
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
              {isRunning ? 'Stop Timer' : 'Start Timer'}
            </Text>
          </TouchableOpacity>

          {elapsedTime > 0 && !isRunning && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={resetTimer}
            >
              <Square size={20} color="#64748B" />
              <Text style={styles.secondaryButtonText}>Reset Timer</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Current Session Info */}
        {currentProject && elapsedTime > 0 && (
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>Current Session</Text>
            <View style={styles.sessionDetails}>
              <View style={styles.sessionRow}>
                <Text style={styles.sessionLabel}>Duration:</Text>
                <Text style={styles.sessionValue}>{timeDisplay.formatted}</Text>
              </View>
              <View style={styles.sessionRow}>
                <Text style={styles.sessionLabel}>Estimated:</Text>
                <Text style={styles.sessionValue}>
                  ${((elapsedTime / 1000 / 3600) * (currentProject.hourlyRate || 0)).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* No Project Selected Message */}
        {!currentProject && (
          <View style={styles.noProjectMessage}>
            <Text style={styles.noProjectTitle}>No Project Selected</Text>
            <Text style={styles.noProjectText}>
              Select a project above to start tracking your time
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Project Selector Modal */}
      <Modal
        visible={showProjectSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
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
            {projects.length === 0 ? (
              <View style={styles.noProjectsMessage}>
                <Text style={styles.noProjectsTitle}>No Projects Yet</Text>
                <Text style={styles.noProjectsText}>
                  Go to the Projects tab to create your first project
                </Text>
              </View>
            ) : (
              projects.map((project) => (
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
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    minHeight: '100%',
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
    paddingVertical: 20,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: screenWidth * 0.2,
  },
  timerText: {
    fontSize: Math.min(screenWidth * 0.12, 48),
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 4,
  },
  timerSeparator: {
    fontSize: Math.min(screenWidth * 0.12, 48),
    fontWeight: '300',
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  timerLabel: {
    fontSize: 10,
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
    minWidth: screenWidth * 0.6,
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
    marginBottom: 20,
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
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  noProjectMessage: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noProjectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  noProjectText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  noProjectsMessage: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noProjectsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  noProjectsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});