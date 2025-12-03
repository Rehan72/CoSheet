import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationStore } from "../../stores";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Search, Shield, Building, Users, MapPin, Eye, Edit, Trash2, Plus, RefreshCw } from "lucide-react";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

function DefenseMapping() {
  const navigate = useNavigate();
  const { orgId } = useParams();

  const {
    organizations,
    currentOrganization,
    organizationAdmins,
    loading,
    error,
    fetchOrganizations,
    fetchOrganizationById,
    fetchOrganizationAdmins,
    removeAdminFromOrganization,
    fetchOrganizationHierarchy
  } = useOrganizationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminDetails, setShowAdminDetails] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (orgId) {
          await fetchOrganizationById(orgId);
          await fetchOrganizationAdmins(orgId);
          await fetchOrganizationHierarchy(orgId);
        } else {
          await fetchOrganizations();
          // Fetch admins for all organizations
          for (const org of organizations) {
            await fetchOrganizationAdmins(org.id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [orgId, fetchOrganizations, fetchOrganizationById, fetchOrganizationAdmins, fetchOrganizationHierarchy, organizations]);

  // Filter admins
  const filteredAdmins = organizationAdmins.filter(admin =>
    (admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (admin.phone && admin.phone.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (roleFilter === "all" || admin.role === roleFilter) &&
    (statusFilter === "all" || admin.status === statusFilter)
  );

  // Get organization name for an admin
  const getOrganizationName = (admin) => {
    if (admin.organizationName) return admin.organizationName;
    if (currentOrganization && admin.organizationId === currentOrganization.id) {
      return currentOrganization.name;
    }
    const org = organizations.find(o => o.id === admin.organizationId);
    return org ? org.name : "Unknown Organization";
  };

  // Handle admin selection
  const handleAdminSelect = (admin) => {
    setSelectedAdmin(admin);
    setShowAdminDetails(true);
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to remove this admin from the defense mapping?")) return;

    try {
      if (orgId) {
        await removeAdminFromOrganization(orgId, adminId);
        await fetchOrganizationAdmins(orgId);
      }
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
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
            Defense Organization Mapping
          </h1>
          <p className="text-blue-500/80 mt-1">
            {currentOrganization ? `Defense mapping for ${currentOrganization.name}` : "Organization defense mapping across all organizations"}
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
            onClick={() => navigate("/admin-list")}
            variant="outline"
            className="border-green-500/30 text-green-500/90 hover:bg-green-500/20"
          >
            <Users className="h-4 w-4 mr-2" />
            View All Admins
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-500/90">
            {organizations.length}
          </div>
          <div className="text-sm text-blue-500/80">Total Organizations</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-500/90">
            {organizationAdmins.length}
          </div>
          <div className="text-sm text-green-500/80">Total Admins</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-yellow-500/90">
            {organizationAdmins.filter(admin => admin.role === "defense_admin").length}
          </div>
          <div className="text-sm text-yellow-500/80">Defense Admins</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500/60" />
              <Input
                placeholder="Search defense mapping..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                <Shield className="h-4 w-4 mr-2 text-blue-500/60" />
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="defense_admin">Defense Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                <Users className="h-4 w-4 mr-2 text-blue-500/60" />
                <SelectValue placeholder="Filter by Status" />
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

      {/* Defense Mapping Visualization */}
      <Card className="border-blue-500/20 overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Defense Organization Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Organization Defense Mapping */}
            {organizations.map(org => {
              const orgAdmins = organizationAdmins.filter(admin => admin.organizationId === org.id);
              const defenseAdmins = orgAdmins.filter(admin => admin.role === "defense_admin");

              if (orgAdmins.length === 0) return null;

              return (
                <div key={org.id} className="border border-blue-500/20 rounded-lg p-4 bg-blue-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Building className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-700 dark:text-blue-300">{org.name}</h3>
                        <p className="text-sm text-blue-500/80">{org.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-blue-600 border-blue-500/30 bg-blue-500/10">
                        {orgAdmins.length} Admins
                      </Badge>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-500/30 bg-yellow-500/10">
                        {defenseAdmins.length} Defense Admins
                      </Badge>
                    </div>
                  </div>

                  {/* Admins List for this Organization */}
                  <div className="ml-6 space-y-3">
                    {orgAdmins
                      .filter(admin =>
                        filteredAdmins.some(fAdmin => fAdmin.id === admin.id) ||
                        (searchTerm === "" && roleFilter === "all" && statusFilter === "all")
                      )
                      .map(admin => (
                        <div
                          key={admin.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-500/10 transition-colors border border-blue-500/20"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                 style={{
                                   backgroundColor: admin.role === "defense_admin" ? "#fbbf2420" :
                                                     admin.role === "super_admin" ? "#a855f720" :
                                                     admin.role === "manager" ? "#10b98120" : "#3b82f620"
                                 }}>
                              <Shield
                                className="h-4 w-4"
                                style={{
                                  color: admin.role === "defense_admin" ? "#f59e0b" :
                                         admin.role === "super_admin" ? "#8b5cf6" :
                                         admin.role === "manager" ? "#10b981" : "#3b82f6"
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{admin.name}</span>
                                <Badge variant="outline" className={`text-xs ${
                                  admin.role === "defense_admin" ? "text-yellow-600 border-yellow-500/30 bg-yellow-500/10" :
                                  admin.role === "super_admin" ? "text-purple-600 border-purple-500/30 bg-purple-500/10" :
                                  admin.role === "manager" ? "text-green-600 border-green-500/30 bg-green-500/10" :
                                  "text-blue-600 border-blue-500/30 bg-blue-500/10"
                                }`}>
                                  {admin.role}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${
                                  admin.status === "active" ? "bg-green-100 text-green-800" :
                                  admin.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {admin.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-blue-500/80">{admin.email}</p>
                              {admin.phone && <p className="text-sm text-blue-500/60">{admin.phone}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdminSelect(admin)}
                              className="h-8 w-8 p-0 text-blue-500/90 hover:bg-blue-500/20"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/edit-admin/${admin.id}`)}
                              className="h-8 w-8 p-0 text-green-500/90 hover:bg-green-500/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="h-8 w-8 p-0 text-red-500/90 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Admin Details Dialog */}
      <Dialog open={showAdminDetails} onOpenChange={setShowAdminDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Defense Details</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                     style={{
                       backgroundColor: selectedAdmin.role === "defense_admin" ? "#fbbf2420" :
                                         selectedAdmin.role === "super_admin" ? "#a855f720" :
                                         selectedAdmin.role === "manager" ? "#10b98120" : "#3b82f620"
                     }}>
                  <Shield
                    className="h-10 w-10"
                    style={{
                      color: selectedAdmin.role === "defense_admin" ? "#f59e0b" :
                             selectedAdmin.role === "super_admin" ? "#8b5cf6" :
                             selectedAdmin.role === "manager" ? "#10b981" : "#3b82f6"
                    }}
                  />
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
                    selectedAdmin.role === "defense_admin" ? "text-yellow-600 border-yellow-500/30 bg-yellow-500/10" :
                    selectedAdmin.role === "super_admin" ? "text-purple-600 border-purple-500/30 bg-purple-500/10" :
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
                    <span>{getOrganizationName(selectedAdmin)}</span>
                  </div>
                </div>

                {selectedAdmin.phone && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                    <span className="text-sm font-medium text-blue-600/80">Phone:</span>
                    <span>{selectedAdmin.phone}</span>
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
                    setShowAdminDetails(false);
                    navigate(`/edit-admin/${selectedAdmin.id}`);
                  }}
                  className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Admin
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAdminDetails(false)}
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

export default DefenseMapping;