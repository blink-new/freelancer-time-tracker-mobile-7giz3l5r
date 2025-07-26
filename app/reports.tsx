import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useProject } from '../src/context/ProjectContext';
import { useTimer } from '../src/context/TimerContext';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const { projects } = useProject();
  const { sessions } = useTimer();

  const reportData = useMemo(() => {
    const projectStats = projects.map(project => {
      const projectSessions = sessions.filter(session => session.projectId === project.id);
      const totalSeconds = projectSessions.reduce((sum, session) => sum + session.duration, 0);
      const totalHours = totalSeconds / 3600;
      const earnings = totalHours * project.hourlyRate;

      return {
        project,
        totalSeconds,
        totalHours,
        earnings,
        sessionCount: projectSessions.length,
      };
    });

    const totalEarnings = projectStats.reduce((sum, stat) => sum + stat.earnings, 0);
    const totalHours = projectStats.reduce((sum, stat) => sum + stat.totalHours, 0);
    const totalSessions = projectStats.reduce((sum, stat) => sum + stat.sessionCount, 0);

    return {
      projectStats,
      totalEarnings,
      totalHours,
      totalSessions,
    };
  }, [projects, sessions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download-outline" size={20} color="#2563EB" />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="cash-outline" size={24} color="#10B981" />
            <Text style={styles.summaryValue}>{formatCurrency(reportData.totalEarnings)}</Text>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="time-outline" size={24} color="#3B82F6" />
            <Text style={styles.summaryValue}>{formatTime(reportData.totalHours * 3600)}</Text>
            <Text style={styles.summaryLabel}>Total Hours</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="list-outline" size={24} color="#F59E0B" />
            <Text style={styles.summaryValue}>{reportData.totalSessions}</Text>
            <Text style={styles.summaryLabel}>Sessions</Text>
          </View>
        </View>

        {/* Project Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Breakdown</Text>
          
          {reportData.projectStats.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Data Yet</Text>
              <Text style={styles.emptySubtitle}>
                Start tracking time to see your reports
              </Text>
            </View>
          ) : (
            reportData.projectStats.map((stat) => (
              <View key={stat.project.id} style={styles.projectCard}>
                <View style={styles.projectHeader}>
                  <View style={styles.projectInfo}>
                    <View
                      style={[styles.projectColor, { backgroundColor: stat.project.color }]}
                    />
                    <View>
                      <Text style={styles.projectName}>{stat.project.name}</Text>
                      <Text style={styles.clientName}>{stat.project.client}</Text>
                    </View>
                  </View>
                  <View style={styles.projectEarnings}>
                    <Text style={styles.earningsAmount}>{formatCurrency(stat.earnings)}</Text>
                    <Text style={styles.hourlyRate}>${stat.project.hourlyRate}/hr</Text>
                  </View>
                </View>

                <View style={styles.projectStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{formatTime(stat.totalSeconds)}</Text>
                    <Text style={styles.statLabel}>Time Logged</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stat.sessionCount}</Text>
                    <Text style={styles.statLabel}>Sessions</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {stat.sessionCount > 0 ? formatTime(stat.totalSeconds / stat.sessionCount) : '0h 0m'}
                    </Text>
                    <Text style={styles.statLabel}>Avg Session</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          
          {sessions.length === 0 ? (
            <View style={styles.emptySessionsState}>
              <Text style={styles.emptySessionsText}>No sessions recorded yet</Text>
            </View>
          ) : (
            sessions
              .slice(-10) // Show last 10 sessions
              .reverse()
              .map((session) => {
                const project = projects.find(p => p.id === session.projectId);
                return (
                  <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <View style={styles.sessionInfo}>
                        {project && (
                          <View
                            style={[styles.sessionColor, { backgroundColor: project.color }]}
                          />
                        )}
                        <View>
                          <Text style={styles.sessionProject}>
                            {project ? project.name : 'Unknown Project'}
                          </Text>
                          <Text style={styles.sessionDate}>
                            {new Date(session.startTime).toLocaleDateString()} at{' '}
                            {new Date(session.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.sessionDuration}>
                        <Text style={styles.durationText}>{formatTime(session.duration)}</Text>
                        {project && (
                          <Text style={styles.sessionEarnings}>
                            {formatCurrency((session.duration / 3600) * project.hourlyRate)}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
          )}
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
  exportButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 20,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
    marginBottom: 16,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
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
  projectEarnings: {
    alignItems: 'flex-end',
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 2,
  },
  hourlyRate: {
    fontSize: 12,
    color: '#6B7280',
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptySessionsState: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptySessionsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  sessionProject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  sessionDuration: {
    alignItems: 'flex-end',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  sessionEarnings: {
    fontSize: 12,
    color: '#10B981',
  },
});