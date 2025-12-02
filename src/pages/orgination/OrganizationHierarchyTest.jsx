import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MockOrganizationService from "../../services/MockOrganizationService";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Users, UserPlus, ChevronRight } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "../../components/ui/breadcrumb";

function OrganizationHierarchyTest() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch organizations
      const orgResponse = await MockOrganizationService.getAllOrganizations();
      if (orgResponse.success) {
        setOrganizations(orgResponse.data);
      }

      setLoading(false);
    } catch {
      setError("Failed to load test data");
      setLoading(false);
    }
  };

  const fetchOrgDetails = async (orgId) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedOrg(null);
      setAdmins([]);
      setUsers([]);
      setHierarchy(null);

      // Fetch organization details
      const orgResponse = await MockOrganizationService.getOrganizationById(orgId);
      if (orgResponse.success) {
        setSelectedOrg(orgResponse.data);
      }

      // Fetch admins
      const adminsResponse = await MockOrganizationService.getOrganizationAdmins(orgId);
      if (adminsResponse.success) {
        setAdmins(adminsResponse.data);
      }

      // Fetch hierarchy
      const hierarchyResponse = await MockOrganizationService.getOrganizationHierarchy(orgId);
      if (hierarchyResponse.success) {
        setHierarchy(hierarchyResponse.data);
      }

      setLoading(false);
    } catch {
      setError("Failed to load organization details");
      setLoading(false);
    }
  };

  const fetchAdminUsers = async (adminId) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedAdmin(null);
      setUsers([]);

      // Fetch users for admin
      const usersResponse = await MockOrganizationService.getAdminUsers(selectedOrg.id, adminId);
      if (usersResponse.success) {
        setUsers(usersResponse.data);
        setSelectedAdmin(admins.find(admin => admin.id === adminId));
      }

      setLoading(false);
    } catch {
      setError("Failed to load admin users");
      setLoading(false);
    }
  };

  const addTestAdmin = async () => {
    try {
      setLoading(true);
      setError(null);

      const newAdmin = {
        name: "Test Admin",
        email: `testadmin${Date.now()}@example.com`,
        role: "Admin"
      };

      const response = await MockOrganizationService.addAdminToOrganization(
        selectedOrg.id,
        newAdmin
      );

      if (response.success) {
        // Refresh admins list
        const adminsResponse = await MockOrganizationService.getOrganizationAdmins(selectedOrg.id);
        if (adminsResponse.success) {
          setAdmins(adminsResponse.data);
        }
      }

      setLoading(false);
    } catch {
      setError("Failed to add test admin");
      setLoading(false);
    }
  };

  const addTestUser = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedAdmin) {
        setError("Please select an admin first");
        setLoading(false);
        return;
      }

      const newUser = {
        name: "Test User",
        email: `testuser${Date.now()}@example.com`,
        role: "User"
      };

      const response = await MockOrganizationService.addUserToAdmin(
        selectedOrg.id,
        selectedAdmin.id,
        newUser
      );

      if (response.success) {
        // Refresh users list
        const usersResponse = await MockOrganizationService.getAdminUsers(
          selectedOrg.id,
          selectedAdmin.id
        );
        if (usersResponse.success) {
          setUsers(usersResponse.data);
        }
      }

      setLoading(false);
    } catch {
      setError("Failed to add test user");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-blue-500/80">Loading test data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-red-500/90 mb-4">{error}</p>
            <Button onClick={fetchTestData} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {index === breadcrumb.length - 1 ? (
                      <BreadcrumbPage className="text-blue-600 font-medium">
                        {item.name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={item.path}
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.type === 'home') {
                            navigate('/dashboard');
                          } else if (item.type === 'organizations') {
                            setSelectedOrg(null);
                          } else if (item.type === 'organization') {
                            fetchOrgDetails(item.id);
                          }
                        }}
                      >
                        {item.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            Organization Hierarchy Test
          </h1>
          <p className="text-blue-500/80 mt-1">
            Test the hierarchical organization structure
          </p>
        </div>
      </div>

      {!selectedOrg ? (
        <div className="space-y-4">
          {setBreadcrumb([{
            name: 'Home',
            path: '/dashboard',
            type: 'home'
          }, {
            name: 'Test Organizations',
            path: '/organization-hierarchy-test',
            type: 'organizations'
          }])}

          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
            Select Organization to Test
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map(org => (
              <Card
                key={org.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-blue-500/20"
                onClick={() => fetchOrgDetails(org.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    {org.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-blue-600/80">
                    <p><strong>Email:</strong> {org.email}</p>
                    <p><strong>Phone:</strong> {org.phone}</p>
                    <p><strong>Status:</strong> {org.status}</p>
                    <p><strong>Industry:</strong> {org.industry}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Organization Info */}
          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                {selectedOrg.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600/80">
                <div>
                  <p><strong>Email:</strong> {selectedOrg.email}</p>
                  <p><strong>Phone:</strong> {selectedOrg.phone}</p>
                  <p><strong>Status:</strong> {selectedOrg.status}</p>
                </div>
                <div>
                  <p><strong>Industry:</strong> {selectedOrg.industry}</p>
                  <p><strong>Address:</strong> {selectedOrg.address}</p>
                  <p><strong>Created:</strong> {selectedOrg.createdAt}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => setSelectedOrg(null)}
                  variant="outline"
                  className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                >
                  Back to Organizations
                </Button>
                <Button
                  onClick={addTestAdmin}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Test Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hierarchy Visualization */}
          {hierarchy && (
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Organization Hierarchy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{hierarchy.organization.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {hierarchy.organization.admins.length} Admins
                    </Badge>
                  </div>

                  {hierarchy.organization.admins.map(admin => (
                    <div key={admin.id} className="ml-6 space-y-2">
                      <div
                        className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg cursor-pointer hover:bg-green-500/20"
                        onClick={() => fetchAdminUsers(admin.id)}
                      >
                        <ChevronRight className="h-4 w-4 text-green-500" />
                        <UserPlus className="h-4 w-4 text-green-500" />
                        <span>{admin.name}</span>
                        <Badge variant="outline" className="ml-2 text-green-600 border-green-500/30">
                          {admin.role}
                        </Badge>
                        <Badge variant="secondary" className="ml-2">
                          {admin.users.length} Users
                        </Badge>
                      </div>

                      {selectedAdmin?.id === admin.id && admin.users.length > 0 && (
                        <div className="ml-6 space-y-2">
                          {users.map(user => (
                            <div key={user.id} className="flex items-center gap-2 p-2 pl-8 bg-purple-500/10 rounded-lg">
                              <ChevronRight className="h-4 w-4 text-purple-500" />
                              <Users className="h-4 w-4 text-purple-500" />
                              <span>{user.name}</span>
                              <Badge variant="secondary" className="ml-2 text-purple-600 border-purple-500/30">
                                {user.role}
                              </Badge>
                            </div>
                          ))}
                          <div className="pl-8 pt-2">
                            <Button
                              onClick={addTestUser}
                              size="sm"
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Test User
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admins List */}
          <Card className="border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-500" />
                Organization Admins ({admins.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {admins.length > 0 ? (
                <div className="space-y-3">
                  {admins.map(admin => (
                    <div
                      key={admin.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-green-500/10 transition-colors ${
                        selectedAdmin?.id === admin.id ? "bg-green-500/20 ring-2 ring-green-500" : "bg-green-500/10"
                      }`}
                      onClick={() => fetchAdminUsers(admin.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{admin.name}</h4>
                          <p className="text-sm text-blue-500/80">{admin.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-500/30">
                          {admin.role}
                        </Badge>
                        <Badge variant="secondary">
                          {admin.users.length} Users
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-blue-500/80">No admins found for this organization</p>
                  <Button
                    onClick={addTestAdmin}
                    variant="outline"
                    className="mt-4"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Admin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Users List */}
          {selectedAdmin && users.length > 0 && (
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Users under {selectedAdmin.name} ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-blue-500/80">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-purple-600 border-purple-500/30">
                          {user.role}
                        </Badge>
                        <Badge variant="outline">
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default OrganizationHierarchyTest;