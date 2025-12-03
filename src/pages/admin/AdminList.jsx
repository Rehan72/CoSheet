import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationStore } from "../../stores";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, Plus, Edit, Trash2, Eye, Users, Shield, MapPin, Building, RefreshCw, Upload, FileText, X, Image, Globe, Home, ChevronDown } from "lucide-react";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";

function AdminList() {
  const navigate = useNavigate();
  const { orgId } = useParams();

  const {
    currentOrganization,
    organizations,
    organizationAdmins,
    adminUsers,
    loading,
    error,
    fetchOrganizations,
    fetchOrganizationById,
    fetchOrganizationAdmins,
    fetchAdminUsers,
    removeAdminFromOrganization,
    updateAdminInOrganization,
    fetchOrganizationHierarchy,
    setCurrentOrganization
  } = useOrganizationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showEditAdminDialog, setShowEditAdminDialog] = useState(false);
  const [showViewAdminDialog, setShowViewAdminDialog] = useState(false);
  const [editAdminData, setEditAdminData] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
    status: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [expandedAdmins, setExpandedAdmins] = useState({});
  const [showHierarchyView, setShowHierarchyView] = useState(false);


  // Fetch organization and admin data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchOrganizations();
        if (orgId) {
          await fetchOrganizationById(orgId);
          await fetchOrganizationAdmins(orgId);
          await fetchOrganizationHierarchy(orgId);

          // If showing hierarchy view, fetch users for all admins
          if (showHierarchyView) {
            const admins = await fetchOrganizationAdmins(orgId);
            for (const admin of admins.data) {
              await fetchAdminUsers(orgId, admin.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [orgId, fetchOrganizations, fetchOrganizationById, fetchOrganizationAdmins, fetchOrganizationHierarchy, showHierarchyView]);

  // Fetch users when hierarchy view is toggled
  useEffect(() => {
    const fetchUsersForHierarchy = async () => {
      if (orgId && showHierarchyView && organizationAdmins.length > 0) {
        try {
          for (const admin of organizationAdmins) {
            await fetchAdminUsers(orgId, admin.id);
          }
        } catch (error) {
          console.error("Error fetching users for hierarchy:", error);
        }
      }
    };

    fetchUsersForHierarchy();
  }, [orgId, showHierarchyView, organizationAdmins, fetchAdminUsers]);

  // Initialize selected organization
  useEffect(() => {
    if (orgId) {
      // Set the selected organization as current organization
      const selectedOrg = organizations.find(org => org.id === orgId);
      if (selectedOrg) {
        setCurrentOrganization(selectedOrg);
      }
    }
  }, [orgId, organizations, setCurrentOrganization]);


  // Helper function to get organization name from organizationId
  const getOrganizationName = (organizationId) => {
    const org = organizations.find(org => org.id === organizationId);
    return org ? org.name : "Unknown Organization";
  };

  // Filter admins based on search and filters
  const filteredAdmins = organizationAdmins.filter(admin =>
    (admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (admin.phone && admin.phone.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (statusFilter === "all" || admin.status === statusFilter) &&
    (roleFilter === "all" || admin.role === roleFilter) &&
    (orgFilter === "all" || admin.organizationId === parseInt(orgFilter))
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditAdminData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Admin name is required";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!data.role) {
      errors.role = "Role is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  // Handle edit admin
  const handleEditAdmin = async (e) => {
    e.preventDefault();
    if (!validateForm(editAdminData, true)) return;

    try {
      // Call the store method to update admin
      await updateAdminInOrganization(orgId, editAdminData.id, editAdminData);

      // Reset form and close dialog
      setShowEditAdminDialog(false);
      setEditAdminData({
        id: "",
        name: "",
        email: "",
        role: "",
        phone: "",
        department: "",
        status: ""
      });
      setFormErrors({});

      // Refresh admins list
      if (orgId) {
        await fetchOrganizationAdmins(orgId);
      }

    } catch (error) {
      console.error("Failed to update admin:", error);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      if (orgId) {
        await removeAdminFromOrganization(orgId, adminId);
        await fetchOrganizationAdmins(orgId);
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
  };

  // Prepare admin for editing
  const prepareEditAdmin = (admin) => {
    setEditAdminData({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      phone: admin.phone || "",
      department: admin.department || "",
      status: admin.status || "active"
    });
    setShowEditAdminDialog(true);
  };

  // Prepare admin for viewing
  const prepareViewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowViewAdminDialog(true);
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
          <Button onClick={() => fetchOrganizationAdmins(orgId)} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            Admin Management
          </h1>
          <p className="text-blue-500/80 mt-1">
            {currentOrganization ? `Managing admins for ${currentOrganization.name}` : "Manage all organization admins"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (orgId) {
                navigate(`/admin-list/add-admin/${orgId}`);
              } else {
                navigate("/admin-list/add-admin");
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>

          <Button
            onClick={() => {
              if (orgId) {
                navigate(`/admin-list/bulk-add-admin/${orgId}`);
              } else {
                navigate("/admin-list/bulk-add-admin");
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Bulk Add Admins
          </Button>
        </div>
      </div>

    
      

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-500/90">
            {filteredAdmins.length}
          </div>
          <div className="text-sm text-blue-500/80">Total Admins</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-500/90">
            {filteredAdmins.filter(admin => admin.status === "active").length}
          </div>
          <div className="text-sm text-green-500/80">Active Admins</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-yellow-500/90">
            {filteredAdmins.filter(admin => admin.role === "defense_admin").length}
          </div>
          <div className="text-sm text-yellow-500/80">Defense Admins</div>
        </div>
      </div>

      {/* Hierarchy View Toggle */}
      {orgId && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setShowHierarchyView(!showHierarchyView)}
            variant="outline"
            className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
          >
            {showHierarchyView ? 'Show Table View' : 'Show Hierarchy View'}
          </Button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500/60" />
              <Input
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                <Shield className="h-4 w-4 mr-2 text-blue-500/60" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="defense_admin">Defense Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Organization Filter */}
            <Select value={orgFilter} onValueChange={setOrgFilter}>
              <SelectTrigger className="w-[180px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                <Building className="h-4 w-4 mr-2 text-blue-500/60" />
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                <Users className="h-4 w-4 mr-2 text-blue-500/60" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Hierarchy View - Shows admins with their users */}
      {showHierarchyView && orgId && (
        <Card className="border-green-500/20 overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Organization Hierarchy - Admins and Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAdmins.map((admin) => {
                const adminUsers = adminUsers.filter(user => user.adminId === admin.id);
                const isExpanded = expandedAdmins[admin.id];

                return (
                  <div key={admin.id} className="border border-green-500/20 rounded-lg overflow-hidden">
                    {/* Admin Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-green-500/10 cursor-pointer hover:bg-green-500/20"
                      onClick={() => setExpandedAdmins(prev => ({
                        ...prev,
                        [admin.id]: !prev[admin.id]
                      }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{admin.name}</h4>
                          <p className="text-sm text-green-500/80">{admin.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-green-600 border-green-500/30">
                          {admin.role || "Admin"}
                        </Badge>
                        <Badge variant="secondary" className="text-green-600 border-green-500/30">
                          {adminUsers.length} Users
                        </Badge>
                        <ChevronDown className={`h-4 w-4 text-green-500 transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Users under this admin */}
                    {isExpanded && adminUsers.length > 0 && (
                      <div className="pl-12 space-y-3 pb-4">
                        {adminUsers.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Users className="h-4 w-4 text-purple-500" />
                              </div>
                              <div>
                                <h5 className="font-medium">{user.name}</h5>
                                <p className="text-sm text-purple-500/80">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-purple-600 border-purple-500/30">
                                {user.role || "User"}
                              </Badge>
                              <Badge variant="outline" className="text-purple-600 border-purple-500/30">
                                {user.status || "active"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admins Table */}
      <Card className="border-blue-500/20 overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Admins List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-blue-500/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-500/10 hover:bg-blue-500/15 border-b border-blue-500/20 h-14">
                  <TableHead className="text-blue-600/80">Name</TableHead>
                  <TableHead className="text-blue-600/80">Email</TableHead>
                  <TableHead className="text-blue-600/80">Role</TableHead>
                  <TableHead className="text-blue-600/80">Organization</TableHead>
                  <TableHead className="text-blue-600/80">Status</TableHead>
                  <TableHead className="text-blue-600/80">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-blue-500/10">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-500" />
                          </div>
                          <span>{admin.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${
                          admin.role === "manager" ? "text-green-600 border-green-500/30 bg-green-500/10" :
                          "text-blue-600 border-blue-500/30 bg-blue-500/10"
                        }`}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-500/60" />
                          <span>{getOrganizationName(admin.organizationId) || currentOrganization?.name || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${
                          admin.status === "active" ? "bg-green-100 text-green-800" :
                          admin.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => prepareViewAdmin(admin)}
                            className="h-8 w-8 p-0 text-blue-500/90 hover:bg-blue-500/20"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => prepareEditAdmin(admin)}
                            className="h-8 w-8 p-0 text-green-500/90 hover:bg-green-500/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="h-8 w-8 p-0 text-red-500/90 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-blue-500/80">No admins found</div>
                      {currentOrganization && (
                        <Button
                          onClick={() => {
                            if (orgId) {
                              navigate(`/add-admin/${orgId}`);
                            } else {
                              navigate("/add-admin");
                            }
                          }}
                          variant="outline"
                          className="mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditAdminDialog} onOpenChange={setShowEditAdminDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditAdmin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                name="name"
                value={editAdminData.name}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Admin name"
                required
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                name="email"
                type="email"
                value={editAdminData.email}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="admin@example.com"
                required
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role *</label>
              <Select
                value={editAdminData.role}
                onValueChange={(value) => setEditAdminData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className={formErrors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={editAdminData.phone}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input
                name="department"
                value={editAdminData.department}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Department"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editAdminData.status}
                onValueChange={(value) => setEditAdminData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditAdminDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Update Admin
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Admin Dialog */}
      <Dialog open={showViewAdminDialog} onOpenChange={setShowViewAdminDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Details</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                  <span className="text-sm font-medium text-blue-600/80">Name:</span>
                  <span className="font-medium">{selectedAdmin.name}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                  <span className="text-sm font-medium text-blue-600/80">Email:</span>
                  <span className="text-blue-500/80">{selectedAdmin.email}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                  <span className="text-sm font-medium text-blue-600/80">Role:</span>
                  <Badge variant="outline" className={`${
                    selectedAdmin.role === "manager" ? "text-green-600 border-green-500/30 bg-green-500/10" :
                    "text-blue-600 border-blue-500/30 bg-blue-500/10"
                  }`}>
                    {selectedAdmin.role}
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                  <span className="text-sm font-medium text-blue-600/80">Organization:</span>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500/60" />
                    <span>{getOrganizationName(selectedAdmin.organizationId) || currentOrganization?.name || "N/A"}</span>
                  </div>
                </div>

                {selectedAdmin.phone && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                    <span className="text-sm font-medium text-blue-600/80">Phone:</span>
                    <span>{selectedAdmin.phone}</span>
                  </div>
                )}

                {selectedAdmin.department && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                    <span className="text-sm font-medium text-blue-600/80">Department:</span>
                    <span>{selectedAdmin.department}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-blue-600/80">Status:</span>
                  <Badge variant="outline" className={`text-xs ${
                    selectedAdmin.status === "active" ? "bg-green-100 text-green-800" :
                    selectedAdmin.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {selectedAdmin.status}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewAdminDialog(false);
                    prepareEditAdmin(selectedAdmin);
                  }}
                  className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowViewAdminDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>

  );
}

export default AdminList;