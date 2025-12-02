// Mock Organization Service for development/testing
// This simulates API responses for the organization hierarchy

const mockOrganizations = [
  {
    id: 1,
    name: 'Tech Innovations Inc.',
    email: 'contact@techinnovations.com',
    phone: '+1-555-123-4567',
    status: 'active',
    address: '123 Tech Park, Silicon Valley, CA',
    industry: 'Technology',
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    name: 'Global Solutions Ltd.',
    email: 'info@globalsolutions.com',
    phone: '+1-555-987-6543',
    status: 'active',
    address: '456 Business Ave, New York, NY',
    industry: 'Consulting',
    createdAt: '2022-11-22'
  }
];

const mockAdmins = {
  1: [ // Organization ID 1 admins
    {
      id: 101,
      organizationId: 1,
      name: 'Sarah Johnson',
      email: 'sarah@techinnovations.com',
      role: 'Super Admin',
      phone: '+1-555-111-2222',
      status: 'active',
      createdAt: '2023-01-20',
      users: [201, 202, 203] // User IDs
    },
    {
      id: 102,
      organizationId: 1,
      name: 'Michael Chen',
      email: 'michael@techinnovations.com',
      role: 'Admin',
      phone: '+1-555-333-4444',
      status: 'active',
      createdAt: '2023-02-10',
      users: [204, 205] // User IDs
    }
  ],
  2: [ // Organization ID 2 admins
    {
      id: 103,
      organizationId: 2,
      name: 'Emily Rodriguez',
      email: 'emily@globalsolutions.com',
      role: 'Super Admin',
      phone: '+1-555-555-6666',
      status: 'active',
      createdAt: '2022-11-25',
      users: [206, 207, 208, 209] // User IDs
    }
  ]
};

const mockUsers = {
  101: [ // Admin ID 101 users
    {
      id: 201,
      adminId: 101,
      organizationId: 1,
      name: 'Alex Thompson',
      email: 'alex@techinnovations.com',
      role: 'Developer',
      phone: '+1-555-777-8888',
      status: 'active',
      department: 'Engineering',
      createdAt: '2023-01-25'
    },
    {
      id: 202,
      adminId: 101,
      organizationId: 1,
      name: 'Priya Patel',
      email: 'priya@techinnovations.com',
      role: 'Designer',
      phone: '+1-555-999-0000',
      status: 'active',
      department: 'Design',
      createdAt: '2023-02-01'
    },
    {
      id: 203,
      adminId: 101,
      organizationId: 1,
      name: 'David Kim',
      email: 'david@techinnovations.com',
      role: 'Product Manager',
      phone: '+1-555-111-3333',
      status: 'active',
      department: 'Product',
      createdAt: '2023-02-15'
    }
  ],
  102: [ // Admin ID 102 users
    {
      id: 204,
      adminId: 102,
      organizationId: 1,
      name: 'Lisa Wang',
      email: 'lisa@techinnovations.com',
      role: 'Marketing Specialist',
      phone: '+1-555-222-4444',
      status: 'active',
      department: 'Marketing',
      createdAt: '2023-03-01'
    },
    {
      id: 205,
      adminId: 102,
      organizationId: 1,
      name: 'James Wilson',
      email: 'james@techinnovations.com',
      role: 'Sales Representative',
      phone: '+1-555-444-6666',
      status: 'active',
      department: 'Sales',
      createdAt: '2023-03-10'
    }
  ],
  103: [ // Admin ID 103 users
    {
      id: 206,
      adminId: 103,
      organizationId: 2,
      name: 'Maria Garcia',
      email: 'maria@globalsolutions.com',
      role: 'Consultant',
      phone: '+1-555-555-7777',
      status: 'active',
      department: 'Consulting',
      createdAt: '2022-12-01'
    },
    {
      id: 207,
      adminId: 103,
      organizationId: 2,
      name: 'Robert Taylor',
      email: 'robert@globalsolutions.com',
      role: 'Analyst',
      phone: '+1-555-666-8888',
      status: 'active',
      department: 'Research',
      createdAt: '2023-01-10'
    },
    {
      id: 208,
      adminId: 103,
      organizationId: 2,
      name: 'Sophia Lee',
      email: 'sophia@globalsolutions.com',
      role: 'Manager',
      phone: '+1-555-777-9999',
      status: 'active',
      department: 'Operations',
      createdAt: '2023-02-05'
    },
    {
      id: 209,
      adminId: 103,
      organizationId: 2,
      name: 'Daniel Brown',
      email: 'daniel@globalsolutions.com',
      role: 'Intern',
      phone: '+1-555-888-0000',
      status: 'active',
      department: 'HR',
      createdAt: '2023-03-15'
    }
  ]
};

const MockOrganizationService = {
  // Get all organizations
  getAllOrganizations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockOrganizations });
      }, 500);
    });
  },

  // Get organization by ID
  getOrganizationById: async (orgId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const org = mockOrganizations.find(o => o.id === parseInt(orgId));
        if (org) {
          resolve({ success: true, data: org });
        } else {
          resolve({ success: false, error: 'Organization not found' });
        }
      }, 500);
    });
  },

  // Get all admins for an organization
  getOrganizationAdmins: async (orgId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const admins = mockAdmins[orgId] || [];
        resolve({ success: true, data: admins });
      }, 500);
    });
  },

  // Get all users for an admin
  getAdminUsers: async (orgId, adminId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = mockUsers[adminId] || [];
        resolve({ success: true, data: users });
      }, 500);
    });
  },

  // Get organization hierarchy
  getOrganizationHierarchy: async (orgId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const org = mockOrganizations.find(o => o.id === parseInt(orgId));
        if (!org) {
          resolve({ success: false, error: 'Organization not found' });
          return;
        }

        const admins = mockAdmins[orgId] || [];
        const hierarchyAdmins = admins.map(admin => {
          const adminUsers = mockUsers[admin.id] || [];
          return {
            ...admin,
            users: adminUsers
          };
        });

        const hierarchyData = {
          organization: {
            ...org,
            admins: hierarchyAdmins
          }
        };

        resolve({ success: true, data: hierarchyData });
      }, 500);
    });
  },

  // Add admin to organization (mock implementation)
  addAdminToOrganization: async (orgId, adminData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAdminId = Math.max(...Object.keys(mockAdmins).flatMap(adminId =>
          mockAdmins[adminId].map(a => a.id)
        ), 100) + 1;

        const newAdmin = {
          id: newAdminId,
          organizationId: parseInt(orgId),
          ...adminData,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          users: []
        };

        if (!mockAdmins[orgId]) {
          mockAdmins[orgId] = [];
        }
        mockAdmins[orgId].push(newAdmin);
        mockUsers[newAdminId] = [];

        resolve({ success: true, data: newAdmin });
      }, 500);
    });
  },

  // Add user to admin (mock implementation)
  addUserToAdmin: async (orgId, adminId, userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUserId = Math.max(...Object.keys(mockUsers).flatMap(adminId =>
          mockUsers[adminId].map(u => u.id)
        ), 200) + 1;

        const newUser = {
          id: newUserId,
          adminId: parseInt(adminId),
          organizationId: parseInt(orgId),
          ...userData,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        };

        if (!mockUsers[adminId]) {
          mockUsers[adminId] = [];
        }
        mockUsers[adminId].push(newUser);

        // Update admin's user list
        const admin = mockAdmins[orgId].find(a => a.id === parseInt(adminId));
        if (admin) {
          admin.users.push(newUserId);
        }

        resolve({ success: true, data: newUser });
      }, 500);
    });
  }
};

export default MockOrganizationService;