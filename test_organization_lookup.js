// Test script to verify organization name lookup functionality
const mockOrganizations = [
  {
    id: 1,
    name: 'Tech Innovations Inc.',
    email: 'contact@techinnovations.com',
    phone: '+1-555-123-4567',
    status: 'active',
    address: '123 Tech Park, Silicon Valley, CA',
    industry: 'Technology',
    createdAt: '2023-01-15',
    logo: 'https://dummyimage.com/150x150/000/fff&text=Tech+Innovations'
  },
  {
    id: 2,
    name: 'Global Solutions Ltd.',
    email: 'info@globalsolutions.com',
    phone: '+1-555-987-6543',
    status: 'active',
    address: '456 Business Ave, New York, NY',
    industry: 'Consulting',
    createdAt: '2022-11-22',
    logo: 'https://dummyimage.com/150x150/000/fff&text=Global+Solutions'
  }
];

const mockAdmins = [
  {
    id: 101,
    organizationId: 1,
    name: 'Sarah Johnson',
    email: 'sarah@techinnovations.com',
    role: 'Super Admin',
    phone: '+1-555-111-2222',
    status: 'active',
    createdAt: '2023-01-20',
    users: [201, 202, 203]
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
    users: [204, 205]
  },
  {
    id: 103,
    organizationId: 2,
    name: 'Emily Rodriguez',
    email: 'emily@globalsolutions.com',
    role: 'Super Admin',
    phone: '+1-555-555-6666',
    status: 'active',
    createdAt: '2022-11-25',
    users: [206, 207, 208, 209]
  }
];

// Helper function to get organization name from organizationId
const getOrganizationName = (organizationId) => {
  const org = mockOrganizations.find(org => org.id === organizationId);
  return org ? org.name : "Unknown Organization";
};

// Test the function
console.log("Testing organization name lookup:");
mockAdmins.forEach(admin => {
  const orgName = getOrganizationName(admin.organizationId);
  console.log(`Admin: ${admin.name} -> Organization: ${orgName}`);
});

// Test with invalid organization ID
console.log("Testing with invalid organization ID:");
console.log(`Admin with orgId 999 -> Organization: ${getOrganizationName(999)}`);