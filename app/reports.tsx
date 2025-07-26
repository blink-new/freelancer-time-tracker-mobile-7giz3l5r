import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { useProject } from '@/src/context/ProjectContext';
import { useTimer } from '@/src/context/TimerContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const { projects } = useProject();
  const { sessions } = useTimer();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const calculateProjectStats = () => {
    return projects.map(project => {
      const projectSessions = sessions.filter(session => session.projectId === project.id);
      const totalSeconds = projectSessions.reduce((sum, session) => sum + session.duration, 0);
      const totalHours = totalSeconds / 3600;
      const earnings = totalHours * project.hourlyRate;

      return {
        ...project,
        totalTime: totalSeconds,
        totalHours,
        earnings,
        sessionCount: projectSessions.length,
      };
    });
  };

  const getTotalStats = () => {
    const projectStats = calculateProjectStats();
    const totalTime = projectStats.reduce((sum, project) => sum + project.totalTime, 0);
    const totalEarnings = projectStats.reduce((sum, project) => sum + project.earnings, 0);
    const totalSessions = projectStats.reduce((sum, project) => sum + project.sessionCount, 0);

    return {
      totalTime,
      totalEarnings,
      totalSessions,
      totalHours: totalTime / 3600,
    };
  };

  const handleExport = () => {
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'CSV', onPress: () => exportToCSV() },
        { text: 'PDF', onPress: () => exportToPDF() },
      ]
    );
  };

  const exportToCSV = () => {
    // TODO: Implement CSV export
    Alert.alert('Export', 'CSV export functionality will be implemented soon.');
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export
    Alert.alert('Export', 'PDF export functionality will be implemented soon.');
  };

  const renderProjectReport = ({ item }: { item: any }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View style={styles.projectInfo}>
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
          <View>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.clientName}>{item.client}</Text>
          </View>
        </View>
        <View style={styles.projectStats}>
          <Text style={styles.earnings}>{formatCurrency(item.earnings)}</Text>
          <Text style={styles.timeText}>{formatTime(item.totalTime)}</Text>
        </View>
      </View>
      
      <View style={styles.projectDetails}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sessions</Text>
          <Text style={styles.statValue}>{item.sessionCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rate</Text>
          <Text style={styles.statValue}>${item.hourlyRate}/hr</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Hours</Text>
          <Text style={styles.statValue}>{item.totalHours.toFixed(1)}h</Text>
        </View>
      </View>
    </View>
  );

  const totalStats = getTotalStats();
  const projectStats = calculateProjectStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Ionicons name="download-outline" size={20} color="#2563EB" />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['week', 'month', 'year'].map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriod
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period && styles.selectedPeriodText
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="time-outline" size={24} color="#2563EB" />
          <Text style={styles.summaryValue}>{formatTime(totalStats.totalTime)}</Text>
          <Text style={styles.summaryLabel}>Total Time</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="cash-outline" size={24} color="#10B981" />
          <Text style={styles.summaryValue}>{formatCurrency(totalStats.totalEarnings)}</Text>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="play-circle-outline" size={24} color="#F59E0B" />
          <Text style={styles.summaryValue}>{totalStats.totalSessions}</Text>
          <Text style={styles.summaryLabel}>Sessions</Text>
        </View>
      </View>

      {/* Project Reports */}
      <View style={styles.projectsSection}>
        <Text style={styles.sectionTitle}>Project Breakdown</Text>
        
        {projectStats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bar-chart-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Data Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking time to see your reports
            </Text>
          </View>
        ) : (
          <FlatList
            data={projectStats}
            renderItem={renderProjectReport}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.projectsList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  exportText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedPeriod: {
    backgroundColor: '#2563EB',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedPeriodText: {
    color: 'white',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
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
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  projectsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  projectsList: {
    paddingBottom: 20,
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
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
  projectStats: {
    alignItems: 'flex-end',
  },
  earnings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});