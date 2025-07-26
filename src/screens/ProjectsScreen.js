import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { Plus, Edit3, Trash2, Users, FolderOpen } from 'lucide-react-native';
import { useProjects } from '../context/ProjectContext';

const CLIENT_COLORS = [
  '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#F97316', '#EC4899', '#84CC16', '#6366F1'
];

export default function ProjectsScreen() {
  const {
    projects,
    clients,
    addProject,
    updateProject,
    deleteProject,
    addClient,
    updateClient,
    deleteClient,
  } = useProjects();

  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  // Form states
  const [projectForm, setProjectForm] = useState({
    name: '',
    clientName: '',
    hourlyRate: '',
    color: CLIENT_COLORS[0],
  });

  const [clientForm, setClientForm] = useState({
    name: '',
    color: CLIENT_COLORS[0],
  });

  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      clientName: '',
      hourlyRate: '',
      color: CLIENT_COLORS[0],
    });
    setEditingProject(null);
  };

  const resetClientForm = () => {
    setClientForm({
      name: '',
      color: CLIENT_COLORS[0],
    });
    setEditingClient(null);
  };

  const handleAddProject = () => {
    if (!projectForm.name.trim() || !projectForm.clientName.trim() || !projectForm.hourlyRate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const projectData = {
      name: projectForm.name.trim(),
      clientName: projectForm.clientName.trim(),
      hourlyRate: parseFloat(projectForm.hourlyRate),
      color: projectForm.color,
    };

    if (editingProject) {
      updateProject({ ...editingProject, ...projectData });
    } else {
      addProject(projectData);
    }

    resetProjectForm();
    setShowAddProject(false);
  };

  const handleEditProject = (project) => {
    setProjectForm({
      name: project.name,
      clientName: project.clientName,
      hourlyRate: project.hourlyRate.toString(),
      color: project.color,
    });
    setEditingProject(project);
    setShowAddProject(true);
  };

  const handleDeleteProject = (project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProject(project.id),
        },
      ]
    );
  };

  const handleAddClient = () => {
    if (!clientForm.name.trim()) {
      Alert.alert('Error', 'Please enter a client name');
      return;
    }

    const clientData = {
      name: clientForm.name.trim(),
      color: clientForm.color,
    };

    if (editingClient) {
      updateClient({ ...editingClient, ...clientData });
    } else {
      addClient(clientData);
    }

    resetClientForm();
    setShowAddClient(false);
  };

  const handleEditClient = (client) => {
    setClientForm({
      name: client.name,
      color: client.color,
    });
    setEditingClient(client);
    setShowAddClient(true);
  };

  const handleDeleteClient = (client) => {
    const clientProjects = projects.filter(p => p.clientName === client.name);
    if (clientProjects.length > 0) {
      Alert.alert(
        'Cannot Delete Client',
        `This client has ${clientProjects.length} active project(s). Please delete or reassign the projects first.`
      );
      return;
    }

    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete "${client.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteClient(client.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Projects Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <FolderOpen size={20} color="#374151" />
              <Text style={styles.sectionTitle}>Projects ({projects.length})</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddProject(true)}
            >
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {projects.length === 0 ? (
            <View style={styles.emptyState}>
              <FolderOpen size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No projects yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first project to start tracking time
              </Text>
            </View>
          ) : (
            <View style={styles.projectGrid}>
              {projects.map((project) => (
                <View key={project.id} style={styles.projectCard}>
                  <View
                    style={[
                      styles.projectColorBar,
                      { backgroundColor: project.color }
                    ]}
                  />
                  <View style={styles.projectContent}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectClient}>{project.clientName}</Text>
                    <Text style={styles.projectRate}>${project.hourlyRate}/hr</Text>
                  </View>
                  <View style={styles.projectActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditProject(project)}
                    >
                      <Edit3 size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteProject(project)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Clients Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Users size={20} color="#374151" />
              <Text style={styles.sectionTitle}>Clients ({clients.length})</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddClient(true)}
            >
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {clients.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No clients yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add clients to organize your projects
              </Text>
            </View>
          ) : (
            <View style={styles.clientList}>
              {clients.map((client) => {
                const clientProjects = projects.filter(p => p.clientName === client.name);
                return (
                  <View key={client.id} style={styles.clientCard}>
                    <View style={styles.clientInfo}>
                      <View
                        style={[
                          styles.clientColorDot,
                          { backgroundColor: client.color }
                        ]}
                      />
                      <View style={styles.clientDetails}>
                        <Text style={styles.clientName}>{client.name}</Text>
                        <Text style={styles.clientProjectCount}>
                          {clientProjects.length} project{clientProjects.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.clientActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditClient(client)}
                      >
                        <Edit3 size={16} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteClient(client)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Project Modal */}
      <Modal
        visible={showAddProject}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingProject ? 'Edit Project' : 'New Project'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowAddProject(false);
                resetProjectForm();
              }}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Project Name</Text>
              <TextInput
                style={styles.formInput}
                value={projectForm.name}
                onChangeText={(text) => setProjectForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter project name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Client Name</Text>
              <TextInput
                style={styles.formInput}
                value={projectForm.clientName}
                onChangeText={(text) => setProjectForm(prev => ({ ...prev, clientName: text }))}
                placeholder="Enter client name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hourly Rate ($)</Text>
              <TextInput
                style={styles.formInput}
                value={projectForm.hourlyRate}
                onChangeText={(text) => setProjectForm(prev => ({ ...prev, hourlyRate: text }))}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Color</Text>
              <View style={styles.colorPicker}>
                {CLIENT_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      projectForm.color === color && styles.selectedColor
                    ]}
                    onPress={() => setProjectForm(prev => ({ ...prev, color }))}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddProject}
            >
              <Text style={styles.submitButtonText}>
                {editingProject ? 'Update Project' : 'Create Project'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Add/Edit Client Modal */}
      <Modal
        visible={showAddClient}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingClient ? 'Edit Client' : 'New Client'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowAddClient(false);
                resetClientForm();
              }}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Client Name</Text>
              <TextInput
                style={styles.formInput}
                value={clientForm.name}
                onChangeText={(text) => setClientForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter client name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Color</Text>
              <View style={styles.colorPicker}>
                {CLIENT_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      clientForm.color === color && styles.selectedColor
                    ]}
                    onPress={() => setClientForm(prev => ({ ...prev, color }))}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddClient}
            >
              <Text style={styles.submitButtonText}>
                {editingClient ? 'Update Client' : 'Create Client'}
              </Text>
            </TouchableOpacity>
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
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
  projectGrid: {
    gap: 12,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  projectColorBar: {
    height: 4,
  },
  projectContent: {
    padding: 16,
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  projectClient: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  projectRate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  clientList: {
    gap: 12,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  clientProjectCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  clientActions: {
    flexDirection: 'row',
    gap: 8,
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
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});