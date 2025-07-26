import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Calendar, Download, Clock, DollarSign, BarChart3, Filter } from 'lucide-react-native';
import { useTimer } from '../context/TimerContext';
import { useProjects } from '../context/ProjectContext';

export default function ReportsScreen() {
  const { sessions } = useTimer();
  const { projects } = useProjects();
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, all
  const [selectedClient, setSelectedClient] = useState('all');

  // Get unique clients from sessions
  const clients = useMemo(() => {
    const clientSet = new Set(sessions.map(session => session.clientName));
    return Array.from(clientSet);
  }, [sessions]);

  // Filter sessions based on selected period and client
  const filteredSessions = useMemo(() => {
    let filtered = sessions;

    // Filter by client
    if (selectedClient !== 'all') {
      filtered = filtered.filter(session => session.clientName === selectedClient);
    }

    // Filter by period
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (selectedPeriod === 'week') {
      filtered = filtered.filter(session => 
        new Date(session.date) >= startOfWeek
      );
    } else if (selectedPeriod === 'month') {
      filtered = filtered.filter(session => 
        new Date(session.date) >= startOfMonth
      );
    }

    return filtered;
  }, [sessions, selectedPeriod, selectedClient]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalDuration = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
    const totalHours = totalDuration / 1000 / 3600;
    
    let totalEarnings = 0;
    filteredSessions.forEach(session => {
      const project = projects.find(p => p.id === session.projectId);
      if (project) {
        const sessionHours = session.duration / 1000 / 3600;
        totalEarnings += sessionHours * project.hourlyRate;
      }
    });

    // Group by project
    const projectSummary = {};
    filteredSessions.forEach(session => {
      const project = projects.find(p => p.id === session.projectId);
      if (!project) return;

      if (!projectSummary[session.projectId]) {
        projectSummary[session.projectId] = {
          projectName: session.projectName,
          clientName: session.clientName,
          color: project.color,
          hourlyRate: project.hourlyRate,
          totalDuration: 0,
          sessionCount: 0,
        };
      }

      projectSummary[session.projectId].totalDuration += session.duration;
      projectSummary[session.projectId].sessionCount += 1;
    });

    // Group by client
    const clientSummary = {};
    filteredSessions.forEach(session => {
      if (!clientSummary[session.clientName]) {
        clientSummary[session.clientName] = {
          clientName: session.clientName,
          totalDuration: 0,
          sessionCount: 0,
          totalEarnings: 0,
        };
      }

      clientSummary[session.clientName].totalDuration += session.duration;
      clientSummary[session.clientName].sessionCount += 1;

      const project = projects.find(p => p.id === session.projectId);
      if (project) {
        const sessionHours = session.duration / 1000 / 3600;
        clientSummary[session.clientName].totalEarnings += sessionHours * project.hourlyRate;
      }
    });

    return {
      totalHours,
      totalEarnings,
      sessionCount: filteredSessions.length,
      projectSummary: Object.values(projectSummary),
      clientSummary: Object.values(clientSummary),
    };
  }, [filteredSessions, projects]);

  const formatDuration = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleExport = () => {
    // In a real app, this would generate and share a CSV/PDF file
    Alert.alert(
      'Export Data',
      'Export functionality would generate a CSV or PDF report with your time tracking data.',
      [
        { text: 'CSV Export', onPress: () => console.log('Export CSV') },
        { text: 'PDF Report', onPress: () => console.log('Export PDF') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const periodOptions = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all', label: 'All Time' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filter Controls */}
        <View style={styles.filterSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Period</Text>
            <View style={styles.filterButtons}>
              {periodOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterButton,
                    selectedPeriod === option.key && styles.activeFilterButton
                  ]}
                  onPress={() => setSelectedPeriod(option.key)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedPeriod === option.key && styles.activeFilterButtonText
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {clients.length > 0 && (
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Client</Text>
              <View style={styles.filterButtons}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    selectedClient === 'all' && styles.activeFilterButton
                  ]}
                  onPress={() => setSelectedClient('all')}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedClient === 'all' && styles.activeFilterButtonText
                    ]}
                  >
                    All Clients
                  </Text>
                </TouchableOpacity>
                {clients.map((client) => (
                  <TouchableOpacity
                    key={client}
                    style={[
                      styles.filterButton,
                      selectedClient === client && styles.activeFilterButton
                    ]}
                    onPress={() => setSelectedClient(client)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedClient === client && styles.activeFilterButtonText
                      ]}
                    >
                      {client}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Clock size={24} color="#2563EB" />
              </View>
              <Text style={styles.summaryValue}>
                {summary.totalHours.toFixed(1)}h
              </Text>
              <Text style={styles.summaryLabel}>Total Hours</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <DollarSign size={24} color="#10B981" />
              </View>
              <Text style={styles.summaryValue}>
                ${summary.totalEarnings.toFixed(2)}
              </Text>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <BarChart3 size={24} color="#F59E0B" />
              </View>
              <Text style={styles.summaryValue}>
                {summary.sessionCount}
              </Text>
              <Text style={styles.summaryLabel}>Sessions</Text>
            </View>
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Download size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Export Report</Text>
        </TouchableOpacity>

        {/* Project Breakdown */}
        {summary.projectSummary.length > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>By Project</Text>
            {summary.projectSummary.map((project, index) => {
              const hours = project.totalDuration / 1000 / 3600;
              const earnings = hours * project.hourlyRate;
              
              return (
                <View key={index} style={styles.breakdownCard}>
                  <View
                    style={[
                      styles.breakdownColorBar,
                      { backgroundColor: project.color }
                    ]}
                  />
                  <View style={styles.breakdownContent}>
                    <View style={styles.breakdownHeader}>
                      <Text style={styles.breakdownName}>{project.projectName}</Text>
                      <Text style={styles.breakdownEarnings}>
                        ${earnings.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.breakdownClient}>{project.clientName}</Text>
                    <View style={styles.breakdownStats}>
                      <Text style={styles.breakdownStat}>
                        {formatDuration(project.totalDuration)}
                      </Text>
                      <Text style={styles.breakdownStat}>
                        {project.sessionCount} session{project.sessionCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Client Breakdown */}
        {summary.clientSummary.length > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>By Client</Text>
            {summary.clientSummary.map((client, index) => (
              <View key={index} style={styles.breakdownCard}>
                <View style={styles.breakdownContent}>
                  <View style={styles.breakdownHeader}>
                    <Text style={styles.breakdownName}>{client.clientName}</Text>
                    <Text style={styles.breakdownEarnings}>
                      ${client.totalEarnings.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.breakdownStats}>
                    <Text style={styles.breakdownStat}>
                      {formatDuration(client.totalDuration)}
                    </Text>
                    <Text style={styles.breakdownStat}>
                      {client.sessionCount} session{client.sessionCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <View style={styles.emptyState}>
            <BarChart3 size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No data for selected period</Text>
            <Text style={styles.emptyStateSubtext}>
              Start tracking time to see your reports here
            </Text>
          </View>
        )}
      </ScrollView>
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
  filterSection: {
    marginBottom: 24,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  breakdownSection: {
    marginBottom: 32,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  breakdownColorBar: {
    height: 4,
  },
  breakdownContent: {
    padding: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  breakdownName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  breakdownEarnings: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  breakdownClient: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  breakdownStats: {
    flexDirection: 'row',
    gap: 16,
  },
  breakdownStat: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});