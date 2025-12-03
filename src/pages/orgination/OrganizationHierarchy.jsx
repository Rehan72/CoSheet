import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationStore } from "../../stores";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "../../components/ui/breadcrumb";
import { Plus, Users, UserPlus, UserMinus, Eye, Edit, Trash2, ChevronRight, ChevronDown, Search, Filter, RefreshCw, Shield } from "lucide-react";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";

function OrganizationHierarchy() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const {
    organizations,
    currentOrganization,
    organizationAdmins,
    adminUsers,
    hierarchy,
    loading,
    error,
    breadcrumb,
    fetchOrganizations,
    fetchOrganizationById,
    fetchOrganizationAdmins,
    fetchAdminUsers,
    fetchOrganizationHierarchy,
    addAdminToOrganization,
    addUserToAdmin,
    buildOrganizationBreadcrumb,
    setBreadcrumb
  } = useOrganizationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    role: "admin"
  });
  const [adminFormErrors, setAdminFormErrors] = useState({});
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "user"
  });
  const [userFormErrors, setUserFormErrors] = useState({});

  // Fetch organization data function
  const fetchOrganizationData = async () => {
    try {
      await fetchOrganizationById(orgId);
      await fetchOrganizationAdmins(orgId);
      await fetchOrganizationHierarchy(orgId);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (orgId) {
      fetchOrganizationData();
      // Build breadcrumb when organization data is loaded
      const buildBreadcrumb = async () => {
        const breadcrumbPath = buildOrganizationBreadcrumb(orgId, null, null);
        setBreadcrumb(breadcrumbPath);
      };
      buildBreadcrumb();
    } else {
      fetchOrganizations();
      setBreadcrumb([{
        name: 'Home',
        path: '/dashboard',
        type: 'home'
      }, {
        name: 'Organizations',
        path: '/organization-hierarchy',
        type: 'organizations'
      }]);
    }
  }, [orgId, currentOrganization]);

  // Handle admin selection
  const handleAdminSelect = async (admin) => {
    setSelectedAdmin(admin);
    if (admin) {
      await fetchAdminUsers(orgId, admin.id);
      // Update breadcrumb when admin is selected
      const breadcrumbPath = buildOrganizationBreadcrumb(orgId, admin.id, null);
      setBreadcrumb(breadcrumbPath);
    } else {
      // Reset to organization level breadcrumb
      const breadcrumbPath = buildOrganizationBreadcrumb(orgId, null, null);
      setBreadcrumb(breadcrumbPath);
    }
  };


  // Filter admins based on search term
  const filteredAdmins = organizationAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = adminUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  // Validate admin form
  const validateAdminForm = () => {
    const errors = {};
    if (!newAdminData.name.trim()) {
      errors.name = "Admin name is required";
    }
    if (!newAdminData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdminData.email)) {
      errors.email = "Please enter a valid email";
    }
    setAdminFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateAdminForm()) {
      return; // Don't close dialog if validation fails
    }

    try {
      if (!orgId) {
        console.error("No organization ID available");
        return;
      }

      // Call the store method to add admin
      await addAdminToOrganization(orgId, newAdminData);

      // Refresh the admins list
      await fetchOrganizationAdmins(orgId);

      // Close dialog and reset form
      setShowAddAdminDialog(false);
      setNewAdminData({ name: "", email: "", role: "admin" });
      setAdminFormErrors({});

      // Show success message (could use toast in real implementation)
      console.log("Admin added successfully!");
    } catch (error) {
      console.error("Failed to add admin:", error);
      // Could show error to user here
    }
  };

  // Validate user form
  const validateUserForm = () => {
    const errors = {};
    if (!newUserData.name.trim()) {
      errors.name = "User name is required";
    }
    if (!newUserData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserData.email)) {
      errors.email = "Please enter a valid email";
    }
    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateUserForm()) {
      return; // Don't close dialog if validation fails
    }

    try {
      if (!orgId || !selectedAdmin) {
        console.error("No organization ID or admin selected");
        return;
      }

      // Call the store method to add user
      await addUserToAdmin(orgId, selectedAdmin.id, newUserData);

      // Refresh the users list
      await fetchAdminUsers(orgId, selectedAdmin.id);

      // Close dialog and reset form
      setShowAddUserDialog(false);
      setNewUserData({ name: "", email: "", role: "user" });
      setUserFormErrors({});

      // Show success message (could use toast in real implementation)
      console.log("User added successfully!");
    } catch (error) {
      console.error("Failed to add user:", error);
      // Could show error to user here
    }
  };

  // Render hierarchy tree
  const renderHierarchyTree = (hierarchyData) => {
    if (!hierarchyData) return null;

    return (
      <div className="space-y-4">
        {/* Organization Level */}
        <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{hierarchyData.organization.name}</span>
          <Badge variant="secondary" className="ml-2">
            {hierarchyData.organization.admins.length} Admins
          </Badge>
        </div>

        {/* Admins Level */}
        <div className="ml-6 space-y-2">
          {hierarchyData.organization.admins.map(admin => (
            <div key={admin.id} className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
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

              {/* Users Level */}
              <div className="ml-6 space-y-2">
                {admin.users.map(user => (
                  <div key={user.id} className="flex items-center gap-2 p-2 pl-8 bg-purple-500/10 rounded-lg">
                    <ChevronRight className="h-4 w-4 text-purple-500" />
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>{user.name}</span>
                    <Badge variant="secondary" className="ml-2 text-purple-600 border-purple-500/30">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SidebarLoadingFallback />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-500/90 mb-4">{error}</div>
          <Button onClick={fetchOrganizationData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
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
                            navigate('/organization-hierarchy');
                          } else if (item.type === 'organization') {
                            navigate(`/organization-hierarchy/${item.id}`);
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            Organization Hierarchy
          </h1>
          <p className="text-blue-500/80 mt-1">
            {currentOrganization ? `Viewing hierarchy for ${currentOrganization.name}` : "Select an organization to view hierarchy"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/orgination")}
            variant="outline"
            className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
          >
            Back to Organizations
          </Button>
          <Button
            onClick={() => navigate(`/admin-list/${orgId}`)}
            variant="outline"
            className="border-green-500/30 text-green-500/90 hover:bg-green-500/20"
          >
            <Users className="h-4 w-4 mr-2" />
            View Admins
          </Button>
          <Button
            onClick={() => navigate(`/defense-mapping/${orgId}`)}
            variant="outline"
            className="border-yellow-500/30 text-yellow-500/90 hover:bg-yellow-500/20"
          >
            <Shield className="h-4 w-4 mr-2" />
            Defense Mapping
          </Button>
          {currentOrganization && (
            <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Admin</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      name="name"
                      value={newAdminData.name}
                      onChange={handleAdminInputChange}
                      placeholder="Admin name"
                      required
                    />
                    {adminFormErrors.name && <p className="text-red-500 text-sm mt-1">{adminFormErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={newAdminData.email}
                      onChange={handleAdminInputChange}
                      placeholder="admin@example.com"
                      required
                    />
                    {adminFormErrors.email && <p className="text-red-500 text-sm mt-1">{adminFormErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select
                      value={newAdminData.role}
                      onValueChange={(value) => setNewAdminData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddAdminDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                      Add Admin
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Organization Selection */}
      {!orgId && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
            Select Organization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations?.map(org => (
              <Card
                key={org.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-blue-500/20"
                onClick={() => navigate(`/organization-hierarchy/${org.id}`)}
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Organization Hierarchy View */}
      {orgId && currentOrganization && (
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-blue-500/10 border border-blue-500/20 h-14">
            <TabsTrigger
              value="tree"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white h-12 px-6"
            >
              <Users className="h-4 w-4" />
              Hierarchy Tree
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white h-12 px-6"
            >
              <Users className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          {/* Tree View */}
          <TabsContent value="tree" className="space-y-6">
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Organization Hierarchy Tree
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hierarchy ? (
                  <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    {renderHierarchyTree(hierarchy)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-blue-500/80">No hierarchy data available</p>
                    <Button
                      onClick={() => fetchOrganizationHierarchy(orgId)}
                      variant="outline"
                      className="mt-4"
                    >
                      Refresh Hierarchy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-6">
            {/* Admins Section */}
            <Card className="border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-green-500" />
                  Organization Admins ({organizationAdmins.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500/60" />
                    <Input
                      placeholder="Search admins..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 border-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                  <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Admin
                      </Button>
                    </DialogTrigger>
                    {/* Add Admin Dialog content (same as above) */}
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {filteredAdmins.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAdmins.map(admin => (
                      <Card
                        key={admin.id}
                        className={`cursor-pointer transition-shadow ${
                          selectedAdmin?.id === admin.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => handleAdminSelect(admin)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <h4 className="font-medium">{admin.name}</h4>
                                <p className="text-sm text-blue-500/80">{admin.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-green-600 border-green-500/30">
                                {admin.role || "Admin"}
                              </Badge>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-blue-500/90 hover:bg-blue-500/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/edit-admin/${admin.id}`);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500/90 hover:bg-red-500/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle delete
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        {selectedAdmin?.id === admin.id && adminUsers.length > 0 && (
                          <CardContent className="pt-0">
                            <div className="pl-12 space-y-3">
                              {filteredUsers.map(user => (
                                <div
                                  key={user.id}
                                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-500/10 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                      <Users className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <div>
                                      <h5 className="font-medium">{user.name}</h5>
                                      <p className="text-sm text-blue-500/80">{user.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-purple-600 border-purple-500/30">
                                      {user.role || "User"}
                                    </Badge>
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-blue-500/90 hover:bg-blue-500/20"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-red-500/90 hover:bg-red-500/20"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div className="pt-3">
                                <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      className="w-full bg-purple-500 hover:bg-purple-600"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <UserPlus className="h-4 w-4 mr-2" />
                                      Add User to {admin.name}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Add User to {admin.name}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddUser} className="space-y-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                          name="name"
                                          value={newUserData.name}
                                          onChange={handleUserInputChange}
                                          placeholder="User name"
                                          required
                                        />
                                        {userFormErrors.name && <p className="text-red-500 text-sm mt-1">{userFormErrors.name}</p>}
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                          name="email"
                                          type="email"
                                          value={newUserData.email}
                                          onChange={handleUserInputChange}
                                          placeholder="user@example.com"
                                          required
                                        />
                                        {userFormErrors.email && <p className="text-red-500 text-sm mt-1">{userFormErrors.email}</p>}
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Role</label>
                                        <Select
                                          value={newUserData.role}
                                          onValueChange={(value) => setNewUserData(prev => ({ ...prev, role: value }))}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => setShowAddUserDialog(false)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                                          Add User
                                        </Button>
                                      </div>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-blue-500/80">No admins found</p>
                    <Button
                      onClick={() => setShowAddAdminDialog(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Admin
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default OrganizationHierarchy;