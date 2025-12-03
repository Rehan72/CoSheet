import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationStore } from "../../stores";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { User, Mail, Phone, Shield, Building, MapPin, ArrowLeft, RefreshCw } from "lucide-react";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";
import { Users } from "lucide-react";

function EditAdmin() {
  const navigate = useNavigate();
  const { adminId, orgId } = useParams();

  const {
    organizations,
    currentOrganization,
    organizationAdmins,
    loading,
    error,
    fetchOrganizationById,
    fetchOrganizationAdmins,
    updateAdminInOrganization,
    fetchOrganizations
  } = useOrganizationStore();

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
    status: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsSubmitting(true);

        if (orgId) {
          await fetchOrganizationById(orgId);
        } else {
          await fetchOrganizations();
        }

        await fetchOrganizationAdmins(orgId || organizations[0]?.id);

        // Find the admin to edit
        const adminToEdit = organizationAdmins.find(admin => admin.id === parseInt(adminId));
        if (adminToEdit) {
          setAdminData({
            name: adminToEdit.name,
            email: adminToEdit.email,
            role: adminToEdit.role,
            phone: adminToEdit.phone || "",
            department: adminToEdit.department || "",
            status: adminToEdit.status || "active"
          });
        }

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (adminId) {
      fetchAdminData();
    }
  }, [adminId, orgId, fetchOrganizations, fetchOrganizationById, fetchOrganizationAdmins, organizationAdmins, organizations]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setAdminData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!adminData.name.trim()) {
      errors.name = "Admin name is required";
    }

    if (!adminData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!adminData.role) {
      errors.role = "Role is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const targetOrgId = orgId || organizations[0]?.id;

      if (!targetOrgId) {
        throw new Error("No organization ID available");
      }

      // Call the store method to update admin
      await updateAdminInOrganization(targetOrgId, adminId, adminData);

      // Navigate back to admin list or defense mapping
      if (orgId) {
        navigate(`/admin-list/${orgId}`);
      } else {
        navigate("/defense-mapping");
      }

    } catch (error) {
      console.error("Failed to update admin:", error);
      setFormErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to update admin'
      }));
    } finally {
      setIsSubmitting(false);
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
            Edit Admin
          </h1>
          <p className="text-blue-500/80 mt-1">
            {currentOrganization ? `Editing admin for ${currentOrganization.name}` : "Edit admin details"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (orgId) {
                navigate(`/admin-list/${orgId}`);
              } else {
                navigate("/defense-mapping");
              }
            }}
            variant="outline"
            className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin List
          </Button>
        </div>
      </div>

      {/* Edit Admin Form */}
      <Card className="border-blue-500/20 overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Admin Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Information Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <User className="h-5 w-5" />
                Admin Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-blue-600/80 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={adminData.name}
                    onChange={handleInputChange}
                    placeholder="Admin name"
                    className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${formErrors.name ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-600/80 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={adminData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${formErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-blue-600/80 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role *
                  </Label>
                  <Select
                    value={adminData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                  >
                    <SelectTrigger className={`border-blue-500/30 bg-white/50 dark:bg-gray-800/50 ${formErrors.role ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="defense_admin">Defense Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-blue-600/80 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Status
                  </Label>
                  <Select
                    value={adminData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-blue-600/80 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={adminData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-blue-600/80 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Department
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    value={adminData.department}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Information
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-500/20">
                  <span className="text-sm font-medium text-blue-600/80">Organization:</span>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-500/60" />
                    <span>{currentOrganization?.name || organizations.find(o => o.id === (orgId || organizations[0]?.id))?.name || "Unknown Organization"}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-blue-600/80">Organization ID:</span>
                  <span>{orgId || organizations[0]?.id || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4 border-t border-blue-500/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (orgId) {
                    navigate(`/admin-list/${orgId}`);
                  } else {
                    navigate("/defense-mapping");
                  }
                }}
                className="border-gray-500/30 text-gray-500/90 hover:bg-gray-500/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating Admin..." : "Update Admin"}
              </Button>
            </div>

            {formErrors.submit && <p className="text-red-500 text-sm mt-2">{formErrors.submit}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditAdmin;