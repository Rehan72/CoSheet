import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Building, Mail, Phone, MapPin, User, Globe, Briefcase, FileText, Upload } from "lucide-react";

function AddOgination() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgname: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    ownerName: "",
    ownerPhone: "",
    website: "",
    industry: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
    // Clear error if any (though image is not required)
    if (errors.image) {
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    let error = '';

    if (name === 'orgname' && !formData.orgname.trim()) {
      error = "Organization name is required";
    } else if (name === 'email') {
      if (!formData.email.trim()) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        error = "Email is invalid";
      }
    } else if (name === 'ownerName' && !formData.ownerName.trim()) {
      error = "Owner name is required";
    } else if (name === 'website' && formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      error = "Website must be a valid URL starting with http:// or https://";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.orgname.trim()) {
      newErrors.orgname = "Organization name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must be a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Form submitted:", formData);
    // Here you would typically send the data to an API

    setIsSubmitting(false);
    navigate("/orgination");
  };

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "in", label: "India" },
    // Add more countries as needed
  ];

  const states = {
    us: [
      { value: "ca", label: "California" },
      { value: "ny", label: "New York" },
      { value: "tx", label: "Texas" },
    ],
    ca: [
      { value: "on", label: "Ontario" },
      { value: "qc", label: "Quebec" },
      { value: "bc", label: "British Columbia" },
    ],
    uk: [
      { value: "eng", label: "England" },
      { value: "sco", label: "Scotland" },
      { value: "wal", label: "Wales" },
    ],
    in: [
      { value: "mh", label: "Maharashtra" },
      { value: "ka", label: "Karnataka" },
      { value: "tn", label: "Tamil Nadu" },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            Add Organization
          </h1>
          <p className="text-blue-500/80 mt-1">
            Create a new organization
          </p>
        </div>
        <Button
          onClick={() => navigate("/orgination")}
          variant="outline"
          className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
        >
          Back to Organizations
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-500/20 p-6 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Logo Section */}
          <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Upload className="h-5 w-5 text-blue-600" />
                <Label htmlFor="image" className="text-blue-600/80 font-semibold text-lg">Organization Logo</Label>
              </div>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-500/40 flex items-center justify-center overflow-hidden bg-white/50 dark:bg-gray-800/50 shadow-lg flex-shrink-0">
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Organization Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Building className="h-8 w-8 text-blue-500/60 mx-auto mb-1" />
                  <span className="text-blue-500/60 text-xs font-medium">Upload Logo</span>
                </div>
              )}
            </div>
          </div>

          {/* Organization Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="orgname" className="text-blue-600/80 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Organization Name *
                </Label>
                <Input
                  id="orgname"
                  name="orgname"
                  value={formData.orgname}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter organization name"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${errors.orgname ? 'border-red-500' : ''}`}

                />
                {errors.orgname && <p className="text-red-500 text-sm mt-1">{errors.orgname}</p>}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter email address"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-blue-600/80 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="https://example.com"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${errors.website ? 'border-red-500' : ''}`}
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label className="text-blue-600/80 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Industry
                </Label>
                <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                  <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-600/80 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter organization description"
                className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                rows={3}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country */}
              <div className="space-y-2">
                <Label className="text-blue-600/80 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Country
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                  <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label className="text-blue-600/80 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  State
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleSelectChange("state", value)}
                  disabled={!formData.country}
                >
                  <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.country && states[formData.country]?.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-blue-600/80 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                rows={3}
              />
            </div>
          </div>

          {/* Owner Information Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <User className="h-5 w-5" />
              Owner Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Name */}
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-blue-600/80 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Owner Name *
                </Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter owner name"
                  className={`border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50 ${errors.ownerName ? 'border-red-500' : ''}`}
                  required
                />
                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
              </div>

              {/* Owner Phone */}
              <div className="space-y-2">
                <Label htmlFor="ownerPhone" className="text-blue-600/80 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Owner Phone Number
                </Label>
                <Input
                  id="ownerPhone"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleInputChange}
                  placeholder="Enter owner phone number"
                  className="border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Organization..." : "Add Organization"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOgination;
