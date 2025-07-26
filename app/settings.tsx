import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useProject } from '@/src/context/ProjectContext';
import { useTimer } from '@/src/context/TimerContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { projects, clearAllProjects } = useProject();
  const { sessions, clearAllSessions } = useTimer();

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all projects, time sessions, and settings. This action cannot be undone.',
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
      'This will permanently delete all time tracking sessions but keep your projects. This action cannot be undone.',
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

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export all your projects and time sessions to a file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export JSON', onPress: () => exportToJSON() },
      ]
    );
  };

  const exportToJSON = () => {
    // TODO: Implement JSON export
    Alert.alert('Export', 'Data export functionality will be implemented soon.');
  };

  const handleAbout = () => {
    Alert.alert(
      'About Freelancer Time Tracker',
      'Version 1.0.0\n\nA professional time tracking app for freelancers to log billable hours, manage projects, and generate reports.\n\nBuilt with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    color = '#1F2937',
    showArrow = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color }]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    color 
  }: {
    icon: string;
    title: string;
    value: string | number;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="folder-outline"
            title="Projects"
            value={projects.length}
            color="#2563EB"
          />
          <StatCard
            icon="time-outline"
            title="Sessions"
            value={sessions.length}
            color="#10B981"
          />
          <StatCard
            icon="calendar-outline"
            title="Days Active"
            value={sessions.length > 0 ? new Set(sessions.map(s => new Date(s.startTime).toDateString())).size : 0}
            color="#F59E0B"
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingItem
            icon="download-outline"
            title="Export Data"
            subtitle="Export projects and sessions to file"
            onPress={handleExportData}
            color="#2563EB"
          />
          
          <SettingItem
            icon="trash-outline"
            title="Clear Time Sessions"
            subtitle="Delete all time tracking data"
            onPress={handleClearSessions}
            color="#F59E0B"
          />
          
          <SettingItem
            icon="warning-outline"
            title="Clear All Data"
            subtitle="Reset app to initial state"
            onPress={handleClearAllData}
            color="#EF4444"
          />
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <SettingItem
            icon="information-circle-outline"
            title="About"
            subtitle="Version and app information"
            onPress={handleAbout}
            color="#6B7280"
          />
          
          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help using the app"
            onPress={() => Alert.alert('Help', 'Help documentation coming soon!')}
            color="#6B7280"
          />
          
          <SettingItem
            icon="star-outline"
            title="Rate App"
            subtitle="Rate us on the App Store"
            onPress={() => Alert.alert('Rate App', 'App Store rating coming soon!')}
            color="#6B7280"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Freelancer Time Tracker v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Built for professional freelancers
          </Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});