import { getRequest, postRequest, putRequest, deleteRequest } from "./AxiosBaseService";

const OrganizationService = {
  // Get all organizations
  getAllOrganizations: async () => {
    try {
      const response = await getRequest("organizations");
      return response.data;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },

  // Get organization by ID
  getOrganizationById: async (orgId) => {
    try {
      const response = await getRequest(`organizations/${orgId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching organization ${orgId}:`, error);
      throw error;
    }
  },

  // Create new organization
  createOrganization: async (orgData) => {
    try {
      const response = await postRequest("organizations", orgData);
      return response.data;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },

  // Update organization
  updateOrganization: async (orgId, orgData) => {
    try {
      const response = await putRequest(`organizations/${orgId}`, orgData);
      return response.data;
    } catch (error) {
      console.error(`Error updating organization ${orgId}:`, error);
      throw error;
    }
  },

  // Delete organization
  deleteOrganization: async (orgId) => {
    try {
      const response = await deleteRequest(`organizations/${orgId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting organization ${orgId}:`, error);
      throw error;
    }
  },

  // Get all admins for an organization
  getOrganizationAdmins: async (orgId) => {
    try {
      const response = await getRequest(`organizations/${orgId}/admins`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admins for organization ${orgId}:`, error);
      throw error;
    }
  },

  // Add admin to organization
  addAdminToOrganization: async (orgId, adminData) => {
    try {
      const response = await postRequest(`organizations/${orgId}/admins`, adminData);
      return response.data;
    } catch (error) {
      console.error(`Error adding admin to organization ${orgId}:`, error);
      throw error;
    }
  },

  // Remove admin from organization
  removeAdminFromOrganization: async (orgId, adminId) => {
    try {
      const response = await deleteRequest(`organizations/${orgId}/admins/${adminId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing admin ${adminId} from organization ${orgId}:`, error);
      throw error;
    }
  },

  // Get all users for an admin
  getAdminUsers: async (orgId, adminId) => {
    try {
      const response = await getRequest(`organizations/${orgId}/admins/${adminId}/users`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for admin ${adminId}:`, error);
      throw error;
    }
  },

  // Add user to admin
  addUserToAdmin: async (orgId, adminId, userData) => {
    try {
      const response = await postRequest(`organizations/${orgId}/admins/${adminId}/users`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error adding user to admin ${adminId}:`, error);
      throw error;
    }
  },

  // Remove user from admin
  removeUserFromAdmin: async (orgId, adminId, userId) => {
    try {
      const response = await deleteRequest(`organizations/${orgId}/admins/${adminId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing user ${userId} from admin ${adminId}:`, error);
      throw error;
    }
  },

  // Get organization hierarchy
  getOrganizationHierarchy: async (orgId) => {
    try {
      const response = await getRequest(`organizations/${orgId}/hierarchy`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hierarchy for organization ${orgId}:`, error);
      throw error;
    }
  }
};

export default OrganizationService;