import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Download, Clock, DollarSign, BarChart3 } from 'lucide-react-native';
import { useTimer } from '../context/TimerContext';
import { useProjects } from '../context/ProjectContext';

const { width: screenWidth } = Dimensions.get('window');

export default function ReportsScreen() {
  const { sessions } = useTimer();
  const { projects } = useProjects();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Calculate date ranges
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Filter sessions based on selected period
  const filteredSessions = useMemo(() => {
    if (selectedPeriod === 'all') return sessions;
    
    const startDate = selectedPeriod === 'week' ? weekStart : monthStart;
    return sessions.filter(session => new Date(session.startTime) >= startDate);
  }, [sessions, selectedPeriod, weekStart, monthStart]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
    const totalEarnings = filteredSessions.reduce((sum, session) => {
      const project = projects.find(p => p.id === session.projectId);
      return sum + ((session.duration / 1000 / 3600) * (project?.hourlyRate || 0));
    }, 0);

    // Group by project
    const byProject = filteredSessions.reduce((acc: any, session) => {
      const project = projects.find(p => p.id === session.projectId);
      if (!project) return acc;

      if (!acc[project.id]) {
        acc[project.id] = {
          project,
          totalTime: 0,
          totalEarnings: 0,
          sessionCount: 0,
        };
      }

      acc[project.id].totalTime += session.duration;
      acc[project.id].totalEarnings += (session.duration / 1000 / 3600) * project.hourlyRate;
      acc[project.id].sessionCount += 1;

      return acc;
    }, {});

    // Group by client
    const byClient = Object.values(byProject).reduce((acc: any, projectData: any) => {
      const clientName = projectData.project.clientName;
      
      if (!acc[clientName]) {
        acc[clientName] = {
          clientName,
          totalTime: 0,
          totalEarnings: 0,
          projectCount: 0,
          projects: [],
        };
      }

      acc[clientName].totalTime += projectData.totalTime;
      acc[clientName].totalEarnings += projectData.totalEarnings;
      acc[clientName].projectCount += 1;
      acc[clientName].projects.push(projectData);

      return acc;
    }, {});

    return {
      totalTime,
      totalEarnings,
      sessionCount: filteredSessions.length,
      byProject: Object.values(byProject),
      byClient: Object.values(byClient),
    };
  }, [filteredSessions, projects]);

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleExport = () => {
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'CSV', onPress: () => exportCSV() },
        { text: 'PDF Report', onPress: () => exportPDF() },
      ]
    );
  };

  const exportCSV = () => {
    // In a real app, this would generate and share a CSV file
    Alert.alert('Export CSV', 'CSV export functionality would be implemented here');
  };

  const exportPDF = () => {
    // In a real app, this would generate and share a PDF report
    Alert.alert('Export PDF', 'PDF export functionality would be implemented here');
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Time';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExport}
        >
          <Download size={16} color="#2563EB" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'all'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.selectedPeriodButtonText,
                ]}
              >
                {period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <Text style={styles.sectionTitle}>{getPeriodLabel()} Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Clock size={20} color="#2563EB" />
            </View>
            <Text style={styles.summaryValue}>{formatDuration(summary.totalTime)}</Text>
            <Text style={styles.summaryLabel}>Total Time</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <DollarSign size={20} color="#10B981" />
            </View>
            <Text style={styles.summaryValue}>${summary.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <BarChart3 size={20} color="#F59E0B" />
            </View>
            <Text style={styles.summaryValue}>{summary.sessionCount}</Text>
            <Text style={styles.summaryLabel}>Sessions</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Calendar size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.summaryValue}>
              ${summary.totalTime > 0 ? (summary.totalEarnings / (summary.totalTime / 1000 / 3600)).toFixed(0) : '0'}
            </Text>
            <Text style={styles.summaryLabel}>Avg Rate</Text>
          </View>
        </View>

        {/* By Client */}
        {summary.byClient.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>By Client</Text>
            {summary.byClient.map((client: any) => (
              <View key={client.clientName} style={styles.clientCard}>
                <View style={styles.clientHeader}>
                  <Text style={styles.clientName}>{client.clientName}</Text>
                  <Text style={styles.clientEarnings}>${client.totalEarnings.toFixed(2)}</Text>
                </View>
                <View style={styles.clientStats}>
                  <Text style={styles.clientStat}>
                    {formatDuration(client.totalTime)} • {client.projectCount} project{client.projectCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                {client.projects.map((projectData: any) => (
                  <View key={projectData.project.id} style={styles.projectRow}>
                    <View style={styles.projectInfo}>
                      <View
                        style={[
                          styles.projectColorDot,
                          { backgroundColor: projectData.project.color }
                        ]}
                      />
                      <Text style={styles.projectName}>{projectData.project.name}</Text>
                    </View>
                    <View style={styles.projectStats}>
                      <Text style={styles.projectTime}>{formatDuration(projectData.totalTime)}</Text>
                      <Text style={styles.projectEarnings}>${projectData.totalEarnings.toFixed(2)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Empty State */}
        {summary.sessionCount === 0 && (
          <View style={styles.emptyState}>
            <BarChart3 size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Data Available</Text>
            <Text style={styles.emptyText}>
              Start tracking time to see your reports here
            </Text>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  exportButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: '#2563EB',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedPeriodButtonText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (screenWidth - 56) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clientEarnings: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  clientStats: {
    marginBottom: 12,
  },
  clientStat: {
    fontSize: 14,
    color: '#6B7280',
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  projectName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  projectStats: {
    alignItems: 'flex-end',
  },
  projectTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  projectEarnings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});