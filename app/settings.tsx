import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useProject } from '../src/context/ProjectContext';
import { useTimer } from '../src/context/TimerContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { projects, clearAllProjects } = useProject();
  const { sessions, clearAllSessions } = useTimer();

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all projects and time sessions. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllProjects();
            clearAllSessions();
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleClearSessions = () => {
    Alert.alert(
      'Clear Time Sessions',
      'This will permanently delete all recorded time sessions. Projects will remain intact.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Sessions',
          style: 'destructive',
          onPress: () => {
            clearAllSessions();
            Alert.alert('Success', 'All time sessions have been cleared.');
          },
        },
      ]
    );
  };

  const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0) / 3600;
  const totalEarnings = sessions.reduce((sum, session) => {
    const project = projects.find(p => p.id === session.projectId);
    return sum + (project ? (session.duration / 3600) * project.hourlyRate : 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="folder-outline" size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{projects.length}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={24} color="#10B981" />
              <Text style={styles.statValue}>{Math.round(totalHours)}h</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="cash-outline" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>${totalEarnings.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="list-outline" size={24} color="#EF4444" />
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearSessions}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={20} color="#F59E0B" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Clear Time Sessions</Text>
                <Text style={styles.settingSubtitle}>
                  Remove all recorded time sessions
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearAllData}>
            <View style={styles.settingLeft}>
              <Ionicons name="warning-outline" size={20} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
                  Clear All Data
                </Text>
                <Text style={styles.settingSubtitle}>
                  Remove all projects and sessions
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Version</Text>
                <Text style={styles.settingSubtitle}>1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="code-outline" size={20} color="#6B7280" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Built with</Text>
                <Text style={styles.settingSubtitle}>React Native & Expo</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="heart-outline" size={20} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Made for Freelancers</Text>
                <Text style={styles.settingSubtitle}>
                  Track your time, grow your business
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Storage Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          
          <View style={styles.storageInfo}>
            <Text style={styles.storageText}>
              All data is stored locally on your device using AsyncStorage.
              Your time tracking data is private and secure.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  storageInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  storageText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});