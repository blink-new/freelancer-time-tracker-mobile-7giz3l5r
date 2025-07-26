import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Trash2, 
  Download, 
  Upload, 
  Info, 
  ChevronRight,
  Database,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react-native';
import { useTimer } from '../context/TimerContext';
import { useProjects } from '../context/ProjectContext';

export default function SettingsScreen() {
  const { sessions, clearAllSessions } = useTimer();
  const { projects, clearAllProjects } = useProjects();

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all projects, sessions, and time tracking data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllSessions();
            clearAllProjects();
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export all your time tracking data for backup or analysis.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export JSON', onPress: () => exportJSON() },
        { text: 'Export CSV', onPress: () => exportCSV() },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Import previously exported time tracking data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', onPress: () => importData() },
      ]
    );
  };

  const exportJSON = () => {
    // In a real app, this would generate and share a JSON file
    Alert.alert('Export JSON', 'JSON export functionality would be implemented here');
  };

  const exportCSV = () => {
    // In a real app, this would generate and share a CSV file
    Alert.alert('Export CSV', 'CSV export functionality would be implemented here');
  };

  const importData = () => {
    // In a real app, this would open a file picker and import data
    Alert.alert('Import Data', 'Data import functionality would be implemented here');
  };

  const showAppInfo = () => {
    Alert.alert(
      'Freelancer Time Tracker',
      'Version 1.0.0\n\nA professional time tracking app for freelancers to log billable hours, manage projects, and generate reports.\n\nBuilt with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };

  const dataStats = {
    projectCount: projects.length,
    sessionCount: sessions.length,
    totalTime: sessions.reduce((sum, session) => sum + session.duration, 0),
  };

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Data Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Database size={24} color="#2563EB" />
              <Text style={styles.statValue}>{dataStats.projectCount}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statCard}>
              <FileText size={24} color="#10B981" />
              <Text style={styles.statValue}>{dataStats.sessionCount}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <SettingsIcon size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{formatDuration(dataStats.totalTime)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingIcon}>
              <Download size={20} color="#2563EB" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Backup your projects and time tracking data
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleImportData}
          >
            <View style={styles.settingIcon}>
              <Upload size={20} color="#10B981" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Import Data</Text>
              <Text style={styles.settingDescription}>
                Restore data from a previous backup
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleClearAllData}
          >
            <View style={styles.settingIcon}>
              <Trash2 size={20} color="#EF4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Clear All Data</Text>
              <Text style={styles.settingDescription}>
                Permanently delete all projects and sessions
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={showAppInfo}
          >
            <View style={styles.settingIcon}>
              <Info size={20} color="#6366F1" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>App Information</Text>
              <Text style={styles.settingDescription}>
                Version, credits, and app details
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Pro Tip</Text>
            <Text style={styles.tipText}>
              Export your data regularly to keep a backup of your time tracking records. 
              This is especially useful for tax purposes and client invoicing.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>⏰ Time Tracking</Text>
            <Text style={styles.tipText}>
              For accurate billing, start the timer as soon as you begin work and 
              stop it during breaks. This ensures precise time tracking for your clients.
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
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
  dangerItem: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FFFBFB',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  dangerText: {
    color: '#EF4444',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipsSection: {
    marginTop: 20,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});