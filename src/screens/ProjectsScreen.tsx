import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Edit3, Trash2, X } from 'lucide-react-native';
import { useProjects } from '../context/ProjectContext';

const { width: screenWidth } = Dimensions.get('window');

const CLIENT_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#10B981', '#14B8A6',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
];

export default function ProjectsScreen() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    hourlyRate: '',
    color: CLIENT_COLORS[0],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      clientName: '',
      hourlyRate: '',
      color: CLIENT_COLORS[0],
    });
  };

  const handleAddProject = () => {
    if (!formData.name.trim() || !formData.clientName.trim() || !formData.hourlyRate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const hourlyRate = parseFloat(formData.hourlyRate);
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      Alert.alert('Error', 'Please enter a valid hourly rate');
      return;
    }

    addProject({
      name: formData.name.trim(),
      clientName: formData.clientName.trim(),
      hourlyRate,
      color: formData.color,
    });

    resetForm();
    setShowAddModal(false);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      clientName: project.clientName,
      hourlyRate: project.hourlyRate.toString(),
      color: project.color,
    });
    setShowAddModal(true);
  };

  const handleUpdateProject = () => {
    if (!formData.name.trim() || !formData.clientName.trim() || !formData.hourlyRate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const hourlyRate = parseFloat(formData.hourlyRate);
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      Alert.alert('Error', 'Please enter a valid hourly rate');
      return;
    }

    updateProject(editingProject.id, {
      name: formData.name.trim(),
      clientName: formData.clientName.trim(),
      hourlyRate,
      color: formData.color,
    });

    resetForm();
    setEditingProject(null);
    setShowAddModal(false);
  };

  const handleDeleteProject = (project: any) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete \"${project.name}\"?`,
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

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProject(null);
    resetForm();
  };

  // Group projects by client
  const projectsByClient = projects.reduce((acc: any, project) => {
    if (!acc[project.clientName]) {
      acc[project.clientName] = [];
    }
    acc[project.clientName].push(project);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Project</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {projects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Projects Yet</Text>
            <Text style={styles.emptyText}>
              Create your first project to start tracking time
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#2563EB" />
              <Text style={styles.emptyButtonText}>Create Project</Text>
            </TouchableOpacity>
          </View>
        ) : (
          Object.entries(projectsByClient).map(([clientName, clientProjects]: [string, any]) => (
            <View key={clientName} style={styles.clientSection}>
              <Text style={styles.clientName}>{clientName}</Text>
              {clientProjects.map((project: any) => (
                <View key={project.id} style={styles.projectCard}>
                  <View style={styles.projectHeader}>
                    <View style={styles.projectInfo}>
                      <View
                        style={[
                          styles.projectColorDot,
                          { backgroundColor: project.color }
                        ]}
                      />
                      <View style={styles.projectDetails}>
                        <Text style={styles.projectName}>{project.name}</Text>
                        <Text style={styles.projectRate}>${project.hourlyRate}/hr</Text>
                      </View>
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
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Project Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeModal}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Project Name</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter project name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Client Name</Text>
              <TextInput
                style={styles.formInput}
                value={formData.clientName}
                onChangeText={(text) => setFormData({ ...formData, clientName: text })}
                placeholder="Enter client name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Hourly Rate ($)</Text>
              <TextInput
                style={styles.formInput}
                value={formData.hourlyRate}
                onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Project Color</Text>
              <View style={styles.colorPicker}>
                {CLIENT_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      formData.color === color && styles.selectedColor,
                    ]}
                    onPress={() => setFormData({ ...formData, color })}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingProject ? handleUpdateProject : handleAddProject}
            >
              <Text style={styles.saveButtonText}>
                {editingProject ? 'Update Project' : 'Create Project'}
              </Text>
            </TouchableOpacity>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  emptyButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 8,
  },
  clientSection: {
    marginBottom: 24,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    padding: 16,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
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
  projectRate: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  projectActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});