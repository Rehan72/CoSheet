import { create } from 'zustand';
import MockOrganizationService from '../services/MockOrganizationService';

const useOrganizationStore = create((set, get) => ({
  // State
  organizations: [],
  currentOrganization: null,
  organizationAdmins: [],
  adminUsers: [],
  loading: false,
  error: null,
  hierarchy: null,
  // Breadcrumb navigation tracking
  breadcrumb: [],

  // Actions
  fetchOrganizations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.getAllOrganizations();
      set({ organizations: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch organizations', loading: false });
    }
  },

  fetchOrganizationById: async (orgId) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.getOrganizationById(orgId);
      set({ currentOrganization: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch organization', loading: false });
    }
  },

  createOrganization: async (orgData) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.createOrganization(orgData);
      set((state) => ({
        organizations: [...state.organizations, response.data],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Failed to create organization', loading: false });
      throw error;
    }
  },

  updateOrganization: async (orgId, orgData) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.updateOrganization(orgId, orgData);
      set((state) => ({
        organizations: state.organizations.map(org =>
          org.id === orgId ? response.data : org
        ),
        currentOrganization: state.currentOrganization?.id === orgId ? response.data : state.currentOrganization,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Failed to update organization', loading: false });
      throw error;
    }
  },

  deleteOrganization: async (orgId) => {
    set({ loading: true, error: null });
    try {
      await MockOrganizationService.deleteOrganization(orgId);
      set((state) => ({
        organizations: state.organizations.filter(org => org.id !== orgId),
        currentOrganization: state.currentOrganization?.id === orgId ? null : state.currentOrganization,
        loading: false
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to delete organization', loading: false });
      throw error;
    }
  },

  fetchOrganizationAdmins: async (orgId) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.getOrganizationAdmins(orgId);
      set({ organizationAdmins: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch organization admins', loading: false });
    }
  },

  addAdminToOrganization: async (orgId, adminData) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.addAdminToOrganization(orgId, adminData);
      set((state) => ({
        organizationAdmins: [...state.organizationAdmins, response.data],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Failed to add admin to organization', loading: false });
      throw error;
    }
  },

  removeAdminFromOrganization: async (orgId, adminId) => {
    set({ loading: true, error: null });
    try {
      await MockOrganizationService.removeAdminFromOrganization(orgId, adminId);
      set((state) => ({
        organizationAdmins: state.organizationAdmins.filter(admin => admin.id !== adminId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to remove admin from organization', loading: false });
      throw error;
    }
  },

  fetchAdminUsers: async (orgId, adminId) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.getAdminUsers(orgId, adminId);
      set({ adminUsers: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch admin users', loading: false });
    }
  },

  addUserToAdmin: async (orgId, adminId, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.addUserToAdmin(orgId, adminId, userData);
      set((state) => ({
        adminUsers: [...state.adminUsers, response.data],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message || 'Failed to add user to admin', loading: false });
      throw error;
    }
  },

  removeUserFromAdmin: async (orgId, adminId, userId) => {
    set({ loading: true, error: null });
    try {
      await MockOrganizationService.removeUserFromAdmin(orgId, adminId, userId);
      set((state) => ({
        adminUsers: state.adminUsers.filter(user => user.id !== userId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to remove user from admin', loading: false });
      throw error;
    }
  },

  fetchOrganizationHierarchy: async (orgId) => {
    set({ loading: true, error: null });
    try {
      const response = await MockOrganizationService.getOrganizationHierarchy(orgId);
      set({ hierarchy: response.data, loading: false });
    } catch (error) {
      set({ error: error.message || 'Failed to fetch organization hierarchy', loading: false });
    }
  },

  // Clear current organization
  clearCurrentOrganization: () => {
    set({ currentOrganization: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Breadcrumb navigation functions
  setBreadcrumb: (path) => {
    set({ breadcrumb: path });
  },

  addBreadcrumb: (item) => {
    set((state) => ({
      breadcrumb: [...state.breadcrumb, item]
    }));
  },

  clearBreadcrumb: () => {
    set({ breadcrumb: [] });
  },

  // Helper function to build breadcrumb path
  buildOrganizationBreadcrumb: (orgId, adminId, userId) => {
    const breadcrumb = [];

    // Always start with home
    breadcrumb.push({
      name: 'Home',
      path: '/dashboard',
      type: 'home'
    });

    // Add organization level
    if (orgId) {
      const org = get().organizations.find(o => o.id === orgId);
      breadcrumb.push({
        name: org?.name || `Organization ${orgId}`,
        path: `/organization-hierarchy/${orgId}`,
        type: 'organization',
        id: orgId
      });
    }

    // Add admin level if present
    if (adminId) {
      const admin = get().organizationAdmins.find(a => a.id === adminId);
      breadcrumb.push({
        name: admin?.name || `Admin ${adminId}`,
        path: `/organization-hierarchy/${orgId}?admin=${adminId}`,
        type: 'admin',
        id: adminId
      });
    }

    // Add user level if present
    if (userId) {
      const user = get().adminUsers.find(u => u.id === userId);
      breadcrumb.push({
        name: user?.name || `User ${userId}`,
        path: `/organization-hierarchy/${orgId}?admin=${adminId}&user=${userId}`,
        type: 'user',
        id: userId
      });
    }

    return breadcrumb;
  }
}));

export default useOrganizationStore;