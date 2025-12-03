import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationStore } from "../../stores";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { User, Mail, Phone, Shield, Building, MapPin, ArrowLeft, Save, Loader2, CheckCircle, AlertCircle, Upload, X } from "lucide-react";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";
import ErrorBoundary from "../../components/ErrorBoundary";

function AddAdmin() {
  const navigate = useNavigate();
  const { orgId } = useParams();

  const {
    currentOrganization,
    organizations,
    loading,
    error,
    fetchOrganizationById,
    fetchOrganizations,
    addAdminToOrganization,
    fetchOrganizationAdmins,
    setCurrentOrganization
  } = useOrganizationStore();

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    role: "admin",
    phone: "",
    department: "",
    status: "active",
    profileImage: null,
    address: "",
    country: "",
    state: ""
  });

  // State for selected organization
  const [selectedOrgId, setSelectedOrgId] = useState(orgId || null);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch organization data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchOrganizations();
        if (orgId) {
          await fetchOrganizationById(orgId);
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchData();
  }, [orgId, fetchOrganizations, fetchOrganizationById]);

  // Update selected organization when orgId changes
  useEffect(() => {
    if (orgId) {
      setSelectedOrgId(orgId);
    }
  }, [orgId]);

  // Handle organization selection change
  const handleOrganizationChange = (orgId) => {
    setSelectedOrgId(orgId);
    // Set the selected organization as current organization
    const selectedOrg = organizations.find(org => org.id == orgId);
    if (selectedOrg) {
      setCurrentOrganization(selectedOrg);
    }
  };

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

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdminData(prev => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
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
    setSubmitStatus(null);

    try {
      const targetOrgId = selectedOrgId || orgId || organizations[0]?.id?.toString();

      if (!targetOrgId) {
        throw new Error("No organization ID available");
      }

      // Prepare admin data for submission
      const adminDataToSubmit = {
        ...adminData,
        organizationId: targetOrgId,
        organizationName: currentOrganization?.name || organizations.find(o => o.id == targetOrgId)?.name
      };

      // Call the store method to add admin
      await addAdminToOrganization(targetOrgId, adminDataToSubmit);

      setSubmitStatus("success");

      // Refresh admins list
      await fetchOrganizationAdmins(targetOrgId);

      // Navigate back to admin list after success
      setTimeout(() => {
        if (selectedOrgId) {
          navigate(`/admin-list/${selectedOrgId}`);
        } else if (orgId) {
          navigate(`/admin-list/${orgId}`);
        } else {
          navigate("/admin-list");
        }
      }, 1500);

    } catch (error) {
      console.error("Failed to add admin:", error);
      setSubmitStatus("error");
      setFormErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to add admin'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (orgId) {
      navigate(`/admin-list/${orgId}`);
    } else {
      navigate("/admin-list");
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
          <Button onClick={() => fetchOrganizationById(orgId)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="p-6 space-y-6">
        <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-blue-500/90 hover:bg-blue-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                Add New Admin
              </h1>
              <p className="text-blue-500/80 mt-1">
                {currentOrganization ? `Creating admin for ${currentOrganization.name}` : "Create a new admin account"}
              </p>
            </div>
          </div>
        </div>

       

        {/* Submit Status */}
        {submitStatus && (
          <div className="mb-4">
            <Badge
              className={`px-4 py-2 text-sm ${
                submitStatus === "success"
                  ? "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
                  : "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30"
              }`}
            >
              {submitStatus === "success" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Admin Created!
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Error creating admin
                </>
              )}
            </Badge>
          </div>
        )}
      </div>

        {/* Add Admin Form */}
        <Card className="border-blue-500/20  overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Admin Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Section */}
              <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Picture
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full border-4 border-blue-500/20 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center border-4 border-blue-500/20">
                        <User className="h-10 w-10 text-blue-500/70" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="profileImage" className="text-blue-600/80 dark:text-blue-400/80">
                      Upload Profile Image
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {adminData.profileImage && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setAdminData(prev => ({ ...prev, profileImage: null }));
                            setImagePreview(null);
                          }}
                          className="border-red-500/30 text-red-500/90 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                        formErrors.name ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>

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
                      className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                        formErrors.email ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

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

              {/* Role & Status */}
              <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role & Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-blue-600/80 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role *
                    </Label>
                    <Select
                      value={adminData.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger className={`border-blue-500/30 bg-white/50 dark:bg-gray-800/50 ${
                        formErrors.role ? 'border-red-500' : ''
                      }`}>
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

                  <div className="space-y-2">
                    <Label className="text-blue-600/80 flex items-center gap-2">
                      <User className="h-4 w-4" />
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
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-blue-600/80">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={adminData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-blue-600/80">
                      Country
                    </Label>
                    <Select
                      value={adminData.country}
                      onValueChange={(value) => handleSelectChange("country", value)}
                    >
                      <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-blue-600/80">
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={adminData.state}
                      onChange={handleInputChange}
                      placeholder="State or province"
                      className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                 {/* Organization Selection */}
       
         
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Select Organization
                </h3>
                <p className="text-sm text-blue-500/80">
                  Choose the organization to add admin to
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedOrgId?.toString() || ""}
                  onValueChange={handleOrganizationChange}
                >
                  <SelectTrigger className="w-[250px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
      
              

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Admin...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Admin
                    </>
                  )}
                </Button>
              </div>

              {formErrors.submit && <p className="text-red-500 text-sm mt-2">{formErrors.submit}</p>}
            </form>
          </CardContent>
        </Card>
    </div>
      
    </ErrorBoundary>
  );
}

export default AddAdmin;