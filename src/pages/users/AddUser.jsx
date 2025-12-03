import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { getRequest } from "../../services/AxiosBaseService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Calendar,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Copy,
  RotateCcw,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { DatePicker } from "../../components/ui/date-picker";
import ErrorBoundary from "../../components/ErrorBoundary";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";
import { useOrganizationStore } from "../../stores";

// Form validation helper
const validateForm = (formData) => {
  const errors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  }

  if (!formData.role) {
    errors.role = "Role is required";
  }

  if (!formData.department) {
    errors.department = "Department is required";
  }

  return errors;
};

function AddUser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orgId, adminId } = useParams();
  const userId = searchParams.get("id");
  const isEditMode = Boolean(userId);

  const {
    currentOrganization,
    organizations,
    organizationAdmins,
    loading: orgLoading,
    error: orgError,
    fetchOrganizationById,
    fetchOrganizations,
    fetchOrganizationAdmins,
    setCurrentOrganization
  } = useOrganizationStore();

  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errors, setErrors] = useState({});

  // Organization selection state
  const [selectedOrgId, setSelectedOrgId] = useState(orgId || null);
  const [selectedAdminId, setSelectedAdminId] = useState(adminId || null);
  const [adminsLoading, setAdminsLoading] = useState(false);

  // Advanced Form Features
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [formTemplates] = useState([
    {
      id: 'admin-template',
      name: 'Admin User Template',
      description: 'Pre-configured template for admin users',
      data: {
        role: 'Admin',
        department: 'Engineering',
        status: 'active'
      }
    },
    {
      id: 'user-template',
      name: 'Regular User Template',
      description: 'Standard template for regular users',
      data: {
        role: 'User',
        department: 'Engineering',
        status: 'active'
      }
    },
    {
      id: 'sales-template',
      name: 'Sales User Template',
      description: 'Template for sales team members',
      data: {
        role: 'User',
        department: 'Sales',
        status: 'active'
      }
    }
  ]);
  const [validationMode, setValidationMode] = useState('onChange'); // 'onChange' | 'onSubmit' | 'onBlur'
  const [formHistory, setFormHistory] = useState([]);
  const autoSaveTimeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    role: "",
    status: "active",
    department: "",
    gender: "",
    dateOfBirth: "",
    picture: null,
  });
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

  // Update selected admin when adminId changes
  useEffect(() => {
    if (adminId) {
      setSelectedAdminId(adminId);
    }
  }, [adminId]);

  // Fetch admins when organization changes
  useEffect(() => {
    if (selectedOrgId) {
      const fetchAdmins = async () => {
        try {
          setAdminsLoading(true);
          await fetchOrganizationAdmins(selectedOrgId);
        } catch (error) {
          console.error("Error fetching admins:", error);
        } finally {
          setAdminsLoading(false);
        }
      };
      fetchAdmins();
    }
  }, [selectedOrgId, fetchOrganizationAdmins]);

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode && userId) {
      fetchUserData();
    }
  }, [isEditMode, userId]);

  const fetchUserData = async () => {
    try {
      setFetchingUser(true);
      // In a real app, you would fetch the specific user
      // For demo, we'll simulate with random user data
      const response = await getRequest("public/randomusers?page=1&limit=1");
      const userData = response.data?.data?.[0] || response.data?.[0];

      if (userData) {
        setFormData({
          firstName: userData.name?.first || "",
          lastName: userData.name?.last || "",
          email: userData.email || "",
          phone: userData.phone || userData.cell || "",
          address: userData.location?.street?.name || "",
          city: userData.location?.city || "",
          state: userData.location?.state || "",
          country: userData.location?.country || "",
          postalCode: userData.location?.postcode?.toString() || "",
          role: "User",
          status: "active",
          department: "Engineering",
          gender: userData.gender || "",
          dateOfBirth: userData.dob?.date?.split("T")[0] || "",
          picture: userData.picture?.large || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setSubmitStatus("error");
    } finally {
      setFetchingUser(false);
    }
  };

  // Handle input change with enhanced validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const previousValue = formData[name];

    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Real-time validation if enabled
    if (validationMode === 'onChange') {
      const fieldErrors = validateField(name, value);
      if (fieldErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name],
        }));
      }
    }

    // Trigger auto-save with updated data
    if (autoSaveEnabled && !isEditMode) {
      triggerAutoSave(newFormData);
    }

    // Add to form history
    addToFormHistory(name, value, previousValue);
  };

  // Enhanced field validation
  const validateField = (name, value) => {
    const fieldErrors = {};

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          fieldErrors.firstName = "First name is required";
        } else if (value.length < 2) {
          fieldErrors.firstName = "First name must be at least 2 characters";
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          fieldErrors.lastName = "Last name is required";
        } else if (value.length < 2) {
          fieldErrors.lastName = "Last name must be at least 2 characters";
        }
        break;

      case 'email':
        if (!value.trim()) {
          fieldErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldErrors.email = "Please enter a valid email address";
        }
        break;

      case 'phone':
        if (!value.trim()) {
          fieldErrors.phone = "Phone number is required";
        } else if (!/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-()]/g, ''))) {
          fieldErrors.phone = "Please enter a valid phone number";
        }
        break;

      default:
        break;
    }

    return fieldErrors;
  };

  // Auto-save functionality
  const triggerAutoSave = useCallback((currentFormData = formData) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setAutoSaveStatus('saving');

        // Save to localStorage as draft
        const draftKey = `user_form_draft_${isEditMode ? userId : 'new'}`;
        localStorage.setItem(draftKey, JSON.stringify({
          formData: currentFormData,
          timestamp: new Date().toISOString(),
          isEditMode,
          userId
        }));

        setAutoSaveStatus('saved');
        setLastSaved(new Date());

        // Clear saved status after 3 seconds
        setTimeout(() => setAutoSaveStatus(null), 3000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveStatus('error');
      }
    }, 2000); // Auto-save after 2 seconds of inactivity
  }, [formData, isEditMode, userId]);

  // Load draft on component mount
  useEffect(() => {
    const draftKey = `user_form_draft_${isEditMode ? userId : 'new'}`;
    const draft = localStorage.getItem(draftKey);

    if (draft && !isEditMode) {
      try {
        const { formData: draftData, timestamp } = JSON.parse(draft);
        const draftAge = new Date() - new Date(timestamp);

        // Only load draft if it's less than 24 hours old
        if (draftAge < 24 * 60 * 60 * 1000) {
          setFormData(draftData);
          setLastSaved(new Date(timestamp));
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [isEditMode, userId]);

  // Form history tracking
  const addToFormHistory = (field, value, previousValue = null) => {
    const prevValue = previousValue !== null ? previousValue : formData[field];

    // Only add to history if the value actually changed
    if (prevValue !== value) {
      setFormHistory(prev => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          field,
          value,
          previousValue: prevValue
        },
        ...prev.slice(0, 19) // Keep last 20 changes
      ]);
    }
  };

  // Apply form template
  const applyTemplate = (template) => {
    const newFormData = {
      ...formData,
      ...template.data
    };

    setFormData(newFormData);

    // Clear any existing errors for template fields
    const newErrors = { ...errors };
    Object.keys(template.data).forEach(field => {
      delete newErrors[field];
    });
    setErrors(newErrors);

    // Trigger validation for template fields if validation is enabled
    if (validationMode === 'onChange') {
      const templateErrors = {};
      Object.keys(template.data).forEach(field => {
        const fieldErrors = validateField(field, template.data[field]);
        Object.assign(templateErrors, fieldErrors);
      });
      setErrors(prev => ({ ...prev, ...templateErrors }));
    }

    // Trigger auto-save
    if (autoSaveEnabled && !isEditMode) {
      triggerAutoSave(newFormData);
    }

    // Add to form history
    addToFormHistory('template', `Applied ${template.name} template`);
  };

  // Undo last change
  const undoLastChange = () => {
    if (formHistory.length > 0) {
      const lastChange = formHistory[0];
      setFormData(prev => ({
        ...prev,
        [lastChange.field]: lastChange.previousValue
      }));
      setFormHistory(prev => prev.slice(1));
    }
  };

  // Duplicate form data
  const duplicateForm = () => {
    const duplicatedData = { ...formData };
    duplicatedData.firstName += ' (Copy)';
    duplicatedData.email = ''; // Clear email for duplicate
    setFormData(duplicatedData);
  };

  // Clear form
  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        role: "",
        status: "active",
        department: "",
        gender: "",
        dateOfBirth: "",
        picture: "",
      });
      setErrors({});
      setFormHistory([]);
    }
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    const previousValue = formData[name];

    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Trigger auto-save
    if (autoSaveEnabled && !isEditMode) {
      triggerAutoSave(newFormData);
    }

    // Add to form history
    addToFormHistory(name, value, previousValue);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, picture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle blur validation
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (validationMode === 'onBlur') {
      const fieldErrors = validateField(name, value);
      if (fieldErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name],
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setSubmitStatus(null);

      // Prepare user data
      const userData = {
        name: {
          first: formData.firstName,
          last: formData.lastName,
        },
        email: formData.email,
        phone: formData.phone,
        location: {
          street: { name: formData.address },
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postcode: formData.postalCode,
        },
        role: formData.role,
        status: formData.status,
        department: formData.department,
        gender: formData.gender,
        dob: { date: formData.dateOfBirth },
        picture: { large: formData.picture },
      };

      // Prepare user data with organization context
      const userDataWithOrg = {
        ...userData,
        organizationId: selectedOrgId || orgId || organizations[0]?.id?.toString(),
        organizationName: currentOrganization?.name || organizations.find(o => o.id == (selectedOrgId || orgId))?.name,
        adminId: selectedAdminId || adminId
      };

      // In a real app, you would make an API call here
      // For demo, we'll simulate success
      console.log("Submitting user data:", userDataWithOrg);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus("success");

      // Navigate back after success
      setTimeout(() => {
        if (selectedOrgId && selectedAdminId) {
          navigate(`/organization-hierarchy/${selectedOrgId}?admin=${selectedAdminId}`);
        } else if (selectedOrgId) {
          navigate(`/organization-hierarchy/${selectedOrgId}`);
        } else if (orgId && adminId) {
          navigate(`/organization-hierarchy/${orgId}?admin=${adminId}`);
        } else if (orgId) {
          navigate(`/organization-hierarchy/${orgId}`);
        } else {
          navigate("/userlist");
        }
      }, 1500);
    } catch (err) {
      console.error("Error saving user:", err);
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (selectedOrgId && selectedAdminId) {
      navigate(`/organization-hierarchy/${selectedOrgId}?admin=${selectedAdminId}`);
    } else if (selectedOrgId) {
      navigate(`/organization-hierarchy/${selectedOrgId}`);
    } else if (orgId && adminId) {
      navigate(`/organization-hierarchy/${orgId}?admin=${adminId}`);
    } else if (orgId) {
      navigate(`/organization-hierarchy/${orgId}`);
    } else {
      navigate("/userlist");
    }
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

  // Handle admin selection change
  const handleAdminChange = (adminId) => {
    setSelectedAdminId(adminId);
  };

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SidebarLoadingFallback />
      </div>
    );
  }

  if (orgError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-500/90 mb-4">{orgError}</div>
          <Button onClick={() => fetchOrganizations()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (fetchingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SidebarLoadingFallback />
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
                {isEditMode ? "Edit User" : "Add New User"}
              </h1>
              <p className="text-blue-500/80 mt-1">
                {currentOrganization
                  ? `Adding user to ${currentOrganization.name}`
                  : isEditMode
                  ? "Update user information and settings"
                  : "Create a new user account"}
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2">
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
                    {isEditMode ? "User Updated!" : "User Created!"}
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Error saving user
                  </>
                )}
              </Badge>
            )}

            {/* Auto-save Status */}
            {autoSaveStatus && (
              <Badge
                className={`px-3 py-1 text-xs ${
                  autoSaveStatus === "saving"
                    ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30"
                    : autoSaveStatus === "saved"
                    ? "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
                    : "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30"
                }`}
              >
                {autoSaveStatus === "saving" ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Auto-saving...
                  </>
                ) : autoSaveStatus === "saved" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Draft saved
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Auto-save failed
                  </>
                )}
              </Badge>
            )}

            {/* Last Saved */}
            {lastSaved && !autoSaveStatus && (
              <Badge className="px-3 py-1 text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                <Clock className="h-3 w-3 mr-1" />
                Saved {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Advanced Form Toolbar */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Form Templates */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel>Apply Form Template</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {formTemplates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className="flex flex-col items-start gap-1 cursor-pointer"
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Advanced Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-purple-500/30 text-purple-500/90 hover:bg-purple-500/20"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Form Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={duplicateForm}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate Form
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={undoLastChange}
                    disabled={formHistory.length === 0}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Undo Last Change
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clearForm}
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Clear Form
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Form History */}
              {formHistory.length > 0 && (
                <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                  {formHistory.length} changes
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Auto-save Toggle */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-blue-600/80">Auto-save</label>
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded border-blue-500/30"
                />
              </div>

              {/* Validation Mode */}
              <Select value={validationMode} onValueChange={setValidationMode}>
                <SelectTrigger className="w-[140px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onChange">Validate on Change</SelectItem>
                  <SelectItem value="onBlur">Validate on Blur</SelectItem>
                  <SelectItem value="onSubmit">Validate on Submit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
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
                <Label htmlFor="picture" className="text-blue-600/80 dark:text-blue-400/80">
                  Upload Profile Image
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.picture && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, picture: null }));
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

          {/* Personal Information */}
          <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-blue-600/80 dark:text-blue-400/80">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-blue-600/80 dark:text-blue-400/80">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-600/80 dark:text-blue-400/80">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john.doe@example.com"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-blue-600/80 dark:text-blue-400/80">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-blue-600/80 dark:text-blue-400/80">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-blue-600/80 dark:text-blue-400/80">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date of Birth
                </Label>
                <DatePicker
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                  onChange={(date) => handleSelectChange('dateOfBirth', date ? date.toISOString().split('T')[0] : '')}
                  placeholder="Select date of birth"
                />
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
                <Label htmlFor="address" className="text-blue-600/80 dark:text-blue-400/80">
                  Street Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-blue-600/80 dark:text-blue-400/80">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-blue-600/80 dark:text-blue-400/80">
                  State / Province
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-blue-600/80 dark:text-blue-400/80">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-blue-600/80 dark:text-blue-400/80">
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className="bg-white/50 dark:bg-gray-800/30 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Role & Department
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-blue-600/80 dark:text-blue-400/80">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Role *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger
                    className={`border-blue-500/30 bg-white/50 dark:bg-gray-800/50 ${
                      errors.role ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-blue-600/80 dark:text-blue-400/80">
                  <Building className="h-4 w-4 inline mr-1" />
                  Department *
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger
                    className={`border-blue-500/30 bg-white/50 dark:bg-gray-800/50 ${
                      errors.department ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-red-500 text-sm">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-blue-600/80 dark:text-blue-400/80">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
                  Choose the organization to add user to
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

            {/* Admin Selection (if organization is selected) */}
            {selectedOrgId && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Select Admin
                  </h3>
                  <p className="text-sm text-blue-500/80">
                    Choose the admin to add user under
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedAdminId?.toString() || ""}
                    onValueChange={handleAdminChange}
                  >
                    <SelectTrigger className="w-[250px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                      <SelectValue placeholder="Select admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading admins...
                        </SelectItem>
                      ) : organizationAdmins.length > 0 ? (
                        organizationAdmins.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id.toString()}>
                            {admin.name} ({admin.role})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-admins" disabled>
                          No admins found for this organization
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
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
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update User" : "Create User"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </ErrorBoundary>
  );
}

export default AddUser;
