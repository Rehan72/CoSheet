import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrganizationStore } from "../../stores";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ArrowLeft, Plus, Trash2, Upload, FileText, X, CheckCircle, AlertCircle, Users, Shield, Mail, Phone, MapPin, Building, User, Globe, Home } from "lucide-react";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";
import ErrorBoundary from "../../components/ErrorBoundary";

function BulkAddAdmin() {
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

  // State for bulk admin data
  const [bulkAdminData, setBulkAdminData] = useState({
    admins: [
      {
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
      }
    ],
    template: "admin"
  });

  // State for selected organization
  const [selectedOrgId, setSelectedOrgId] = useState(orgId || null);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [csvFormatWarning, setCsvFormatWarning] = useState(null);

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

  // Handle input changes for individual admin fields
  const handleInputChange = (index, field, value) => {
    const updatedAdmins = [...bulkAdminData.admins];
    updatedAdmins[index][field] = value;

    setBulkAdminData(prev => ({
      ...prev,
      admins: updatedAdmins
    }));

    // Clear error for this field
    if (formErrors[`${index}-${field}`]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[`${index}-${field}`];
        return newErrors;
      });
    }
  };

  // Add new admin row
  const addAdminRow = () => {
    setBulkAdminData(prev => ({
      ...prev,
      admins: [...prev.admins, {
        name: "",
        email: "",
        role: prev.template || "admin",
        phone: "",
        department: "",
        status: "active",
        profileImage: null,
        address: "",
        country: "",
        state: ""
      }]
    }));
  };

  // Remove admin row
  const removeAdminRow = (index) => {
    if (bulkAdminData.admins.length > 1) {
      const updatedAdmins = bulkAdminData.admins.filter((_, i) => i !== index);
      setBulkAdminData(prev => ({
        ...prev,
        admins: updatedAdmins
      }));
    }
  };

  // Handle template change (applies to all admins)
  const handleTemplateChange = (value) => {
    setBulkAdminData(prev => ({
      ...prev,
      template: value,
      admins: prev.admins.map(admin => ({
        ...admin,
        role: value
      }))
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    bulkAdminData.admins.forEach((admin, index) => {
      if (!admin.name.trim()) {
        errors[`${index}-name`] = "Admin name is required";
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(admin.name)) {
        errors[`${index}-name`] = "Name should contain only characters";
        isValid = false;
      }

      if (!admin.email.trim()) {
        errors[`${index}-email`] = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
        errors[`${index}-email`] = "Please enter a valid email";
        isValid = false;
      }

      if (!admin.role) {
        errors[`${index}-role`] = "Role is required";
        isValid = false;
      }

      // Validate country if provided
      if (admin.country && !['us', 'uk', 'ca', 'in', 'au'].includes(admin.country)) {
        errors[`${index}-country`] = "Please select a valid country";
        isValid = false;
      }

      // Validate address if provided
      if (admin.address && admin.address.length > 200) {
        errors[`${index}-address`] = "Address must be less than 200 characters";
        isValid = false;
      }

      // Validate state if provided
      if (admin.state && admin.state.length > 100) {
        errors[`${index}-state`] = "State must be less than 100 characters";
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // Handle organization selection change
  const handleOrganizationChange = (orgId) => {
    setSelectedOrgId(orgId);
    // Set the selected organization as current organization
    const selectedOrg = organizations.find(org => org.id == orgId);
    if (selectedOrg) {
      setCurrentOrganization(selectedOrg);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSuccessCount(0);
    setFailedCount(0);

    try {
      const targetOrgId = selectedOrgId || orgId || organizations[0]?.id?.toString();

      if (!targetOrgId) {
        throw new Error("No organization ID available");
      }

      let success = 0;
      let failed = 0;

      // Add each admin one by one
      for (const admin of bulkAdminData.admins) {
        try {
          const adminDataToSubmit = {
            ...admin,
            organizationId: targetOrgId,
            organizationName: currentOrganization?.name || organizations.find(o => o.id == targetOrgId)?.name
          };

          await addAdminToOrganization(targetOrgId, adminDataToSubmit);
          success++;
        } catch (error) {
          console.error(`Failed to add admin ${admin.email}:`, error);
          failed++;
        }
      }

      setSuccessCount(success);
      setFailedCount(failed);

      if (success > 0) {
        setSubmitStatus("success");
        // Auto-redirect to admin list after successful submission
        setTimeout(() => {
          if (selectedOrgId) {
            navigate(`/admin-list/${selectedOrgId}`);
          } else if (orgId) {
            navigate(`/admin-list/${orgId}`);
          } else {
            navigate("/admin-list");
          }
        }, 2000); // 2 second delay to show success message
      } else {
        setSubmitStatus("error");
      }

      // Refresh admins list
      await fetchOrganizationAdmins(targetOrgId);

    } catch (error) {
      console.error("Failed to add admins in bulk:", error);
      setSubmitStatus("error");
      setFormErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to add admins in bulk'
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

  // Handle CSV template download
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Name,Email,Role,Phone,Department,Status,Address,Country,State\n" +
      "John Doe,john@example.com,admin,+1234567890,IT,active,\"123 Main St\",us,California\n" +
      "Jane Smith,jane@example.com,manager,+1987654321,HR,active,\"456 Oak Ave\",uk,London";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bulk_admin_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV file upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split('\n');

        if (lines.length < 2) {
          alert('CSV file must have at least one header row and one data row');
          return;
        }

        // Check header row to validate format
        const headerLine = lines[0].trim();
        const expectedHeaders = ['Name', 'Email', 'Role', 'Phone', 'Department', 'Status', 'Address', 'Country', 'State'];
        const actualHeaders = parseCSVLine(headerLine);

        // Check if headers match expected format
        const headersMatch = expectedHeaders.every((expected, index) =>
          actualHeaders[index]?.toLowerCase() === expected.toLowerCase()
        );

        // Create header to index mapping for intelligent field mapping
        const headerMapping = {};
        actualHeaders.forEach((header, index) => {
          const normalizedHeader = header.trim().toLowerCase();
          if (normalizedHeader.includes('name')) headerMapping.name = index;
          if (normalizedHeader.includes('email')) headerMapping.email = index;
          if (normalizedHeader.includes('role')) headerMapping.role = index;
          if (normalizedHeader.includes('phone')) headerMapping.phone = index;
          if (normalizedHeader.includes('department') || normalizedHeader.includes('dept')) headerMapping.department = index;
          if (normalizedHeader.includes('status')) headerMapping.status = index;
          if (normalizedHeader.includes('address')) headerMapping.address = index;
          if (normalizedHeader.includes('country') || normalizedHeader.includes('nation')) headerMapping.country = index;
          if (normalizedHeader.includes('state') || normalizedHeader.includes('province')) headerMapping.state = index;
        });

        // Check which fields were successfully mapped
        const mappedFields = Object.keys(headerMapping);
        const missingFields = expectedHeaders
          .map(h => h.toLowerCase())
          .filter(field => !mappedFields.includes(field));

        if (!headersMatch || missingFields.length > 0) {
          // Show detailed warning about mapping results
          const mappedFieldNames = mappedFields.map(f => expectedHeaders.find(h => h.toLowerCase() === f) || f).join(', ');
          const warningMessage = missingFields.length > 0
            ? `CSV header format partially matches. Successfully mapped fields: ${mappedFieldNames}. Missing fields: ${missingFields.join(', ')}. Data will be imported with available mappings.`
            : `CSV header format doesn't exactly match but all fields were mapped successfully. Expected: ${expectedHeaders.join(', ')}. Got: ${actualHeaders.join(', ')}.`;

          console.warn(warningMessage);
          alert(warningMessage);
          setCsvFormatWarning(warningMessage);
        } else {
          setCsvFormatWarning(null);
        }

        // Skip header line
        const adminLines = lines.slice(1).filter(line => line.trim() !== '');

        if (adminLines.length === 0) {
          alert('No valid admin data found in the CSV file');
          return;
        }


        const newAdmins = adminLines.map((line) => {
          // Simple CSV parsing - split by comma but handle quoted values
          const values = parseCSVLine(line);

          // Map CSV values to admin object using intelligent header mapping
          return {
            name: values[headerMapping.name]?.trim() || "",
            email: values[headerMapping.email]?.trim() || "",
            role: values[headerMapping.role]?.trim() || bulkAdminData.template || "admin",
            phone: values[headerMapping.phone]?.trim() || "",
            department: values[headerMapping.department]?.trim() || "",
            status: values[headerMapping.status]?.trim() || "active",
            address: values[headerMapping.address]?.trim() || "",
            country: values[headerMapping.country]?.trim() || "",
            state: values[headerMapping.state]?.trim() || "",
            profileImage: null
          };
        });

        // Validate the imported data
        const validationErrors = {};
        let hasErrors = false;

        newAdmins.forEach((admin, index) => {
          if (!admin.name.trim()) {
            validationErrors[`${index}-name`] = "Admin name is required";
            hasErrors = true;
          } else if (!/^[a-zA-Z\s]+$/.test(admin.name)) {
            validationErrors[`${index}-name`] = "Name should contain only characters";
            hasErrors = true;
          }

          if (!admin.email.trim()) {
            validationErrors[`${index}-email`] = "Email is required";
            hasErrors = true;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
            validationErrors[`${index}-email`] = "Please enter a valid email";
            hasErrors = true;
          }

          if (!admin.role) {
            validationErrors[`${index}-role`] = "Role is required";
            hasErrors = true;
          }

          // Validate country if provided
          if (admin.country && !['us', 'uk', 'ca', 'in', 'au'].includes(admin.country)) {
            validationErrors[`${index}-country`] = "Please select a valid country";
            hasErrors = true;
          }
        });

        setBulkAdminData({
          ...bulkAdminData,
          admins: newAdmins
        });

        setFormErrors(validationErrors);

        if (hasErrors) {
          alert(`Successfully imported ${newAdmins.length} admin(s) from CSV with correct format, but some fields have validation errors. Please check the highlighted fields.`);
        } else {
          alert(`Successfully imported ${newAdmins.length} admin(s) from CSV with correct format. Data is now displayed in the table below.`);
        }

      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert('Error parsing CSV file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  // Helper function to parse CSV line with basic quoted value support
  const parseCSVLine = (line) => {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }

    // Add the last value
    values.push(currentValue.trim());

    // Ensure we have all expected fields (pad with empty strings if needed)
    while (values.length < 9) {
      values.push('');
    }

    return values;
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              Bulk Add Admins
            </h1>
            <p className="text-blue-500/80 mt-1">
              {currentOrganization ? `Adding multiple admins to ${currentOrganization.name}` : "Create multiple admin accounts"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin List
            </Button>
          </div>
        </div>

        {/* Organization Selection */}
        {organizations.length > 0 && (
          <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Select Organization
                </h3>
                <p className="text-sm text-blue-500/80">
                  Choose the organization to add admins to
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
        )}

        {/* Submit Status */}
        {submitStatus && (
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
                Successfully added {successCount} admins! {failedCount > 0 && `(${failedCount} failed)`}
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Error adding admins
              </>
            )}
          </Badge>
        )}

        {/* Bulk Add Admin Form */}
        <Card className="border-blue-500/20 overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Bulk Admin Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Role Template
                    </h3>
                    <p className="text-sm text-blue-500/80">
                      Select a role template to apply to all admins
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={bulkAdminData.template}
                      onValueChange={handleTemplateChange}
                    >
                      <SelectTrigger className="w-[180px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                        <SelectValue placeholder="Select template role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="defense_admin">Defense Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* CSV Import Section */}
              <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      CSV Import
                    </h3>
                    <p className="text-sm text-blue-500/80">
                      Upload a CSV file with admin data or download our template
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleDownloadTemplate}
                      className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                      onClick={() => document.getElementById('csv-upload-input').click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </Button>
                    <Input
                      id="csv-upload-input"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCSVUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Admin Rows Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Admin Details ({bulkAdminData.admins.length})
                    </h3>
                    {csvFormatWarning && (
                      <div className="mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {csvFormatWarning}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={addAdminRow}
                    variant="outline"
                    className="border-green-500/30 text-green-500/90 hover:bg-green-500/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Admin
                  </Button>
                </div>

                <div className="rounded-xl border border-blue-500/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-500/10 hover:bg-blue-500/15 border-b border-blue-500/20 h-12">
                        <TableHead className="text-blue-600/80 w-[120px]">Name *</TableHead>
                        <TableHead className="text-blue-600/80 w-[180px]">Email *</TableHead>
                        <TableHead className="text-blue-600/80 w-[100px]">Role *</TableHead>
                        <TableHead className="text-blue-600/80 w-[120px]">Phone</TableHead>
                        <TableHead className="text-blue-600/80 w-[120px]">Department</TableHead>
                        <TableHead className="text-blue-600/80 w-[150px]">Address</TableHead>
                        <TableHead className="text-blue-600/80 w-[100px]">Country</TableHead>
                        <TableHead className="text-blue-600/80 w-[100px]">State</TableHead>
                        <TableHead className="text-blue-600/80 w-[80px]">Status</TableHead>
                        <TableHead className="text-blue-600/80 w-[60px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkAdminData.admins.map((admin, index) => (
                        <TableRow key={index} className="hover:bg-blue-500/10">
                          <TableCell>
                            <Input
                              value={admin.name}
                              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                              placeholder="Admin name"
                              className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                                formErrors[`${index}-name`] ? 'border-red-500' : ''
                              }`}
                            />
                            {formErrors[`${index}-name`] && <p className="text-red-500 text-xs mt-1">{formErrors[`${index}-name`]}</p>}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="email"
                              value={admin.email}
                              onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                              placeholder="admin@example.com"
                              className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                                formErrors[`${index}-email`] ? 'border-red-500' : ''
                              }`}
                            />
                            {formErrors[`${index}-email`] && <p className="text-red-500 text-xs mt-1">{formErrors[`${index}-email`]}</p>}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={admin.role}
                              onValueChange={(value) => handleInputChange(index, 'role', value)}
                            >
                              <SelectTrigger className={`w-[100px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50 ${
                                formErrors[`${index}-role`] ? 'border-red-500' : ''
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
                            {formErrors[`${index}-role`] && <p className="text-red-500 text-xs mt-1">{formErrors[`${index}-role`]}</p>}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={admin.phone}
                              onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                              placeholder="Phone number"
                              className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={admin.department}
                              onChange={(e) => handleInputChange(index, 'department', e.target.value)}
                              placeholder="Department"
                              className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={admin.address}
                              onChange={(e) => handleInputChange(index, 'address', e.target.value)}
                              placeholder="Street address"
                              className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                                formErrors[`${index}-address`] ? 'border-red-500' : ''
                              }`}
                            />
                            {formErrors[`${index}-address`] && <p className="text-red-500 text-xs mt-1">{formErrors[`${index}-address`]}</p>}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={admin.country}
                              onValueChange={(value) => handleInputChange(index, 'country', value)}
                            >
                              <SelectTrigger className={`w-[100px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50 ${
                                formErrors[`${index}-country`] ? 'border-red-500' : ''
                              }`}>
                                <SelectValue placeholder="Country" />
                              </SelectTrigger>
                              {formErrors[`${index}-country`] && <p className="text-red-500 text-xs mt-1">{formErrors[`${index}-country`]}</p>}
                              <SelectContent>
                                <SelectItem value="us">United States</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                                <SelectItem value="ca">Canada</SelectItem>
                                <SelectItem value="in">India</SelectItem>
                                <SelectItem value="au">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={admin.state}
                              onChange={(e) => handleInputChange(index, 'state', e.target.value)}
                              placeholder="State/Province"
                              className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                                formErrors[`${index}-state`] ? 'border-red-500' : ''
                              }`}
                            />
                            {formErrors[`${index}-state`] && <p className="text-red-500 text-xs mt-1">{formErrors[`${index}-state`]}</p>}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={admin.status}
                              onValueChange={(value) => handleInputChange(index, 'status', value)}
                            >
                              <SelectTrigger className="w-[80px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeAdminRow(index)}
                              disabled={bulkAdminData.admins.length <= 1}
                              className="h-8 w-8 p-0 text-red-500/90 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-blue-500/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-500/30 text-gray-500/90 hover:bg-gray-500/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Creating {bulkAdminData.admins.length} Admins...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Create {bulkAdminData.admins.length} Admins
                    </>
                  )}
                </Button>
              </div>

              {formErrors.submit && <p className="text-red-500 text-sm mt-2">{formErrors.submit}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default BulkAddAdmin;