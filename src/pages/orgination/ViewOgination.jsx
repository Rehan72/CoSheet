import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Building, Mail, Phone, MapPin, User, Globe, Briefcase, FileText } from "lucide-react";
import useOrganizationStore from "../../stores/organizationStore";

function ViewOgination() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { organizations, fetchOrganizations, fetchOrganizationById, currentOrganization } = useOrganizationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchOrganizations();
        await fetchOrganizationById(parseInt(orgId));
      } catch (error) {
        console.error("Failed to fetch organization:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId, fetchOrganizations, fetchOrganizationById]);

  const org = currentOrganization || organizations.find(org => org.id === parseInt(orgId));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-500">Loading organization data...</p>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Organization Not Found</h2>
          <Button
            onClick={() => navigate("/orgination")}
            variant="outline"
            className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
          >
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            Organization Details
          </h1>
          <p className="text-blue-500/80 mt-1">
            View organization information
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/orgination/editorgination/${orgId}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Edit Organization
          </Button>
          <Button
            onClick={() => navigate("/orgination")}
            variant="outline"
            className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
          >
            Back to Organizations
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-500/20 p-6 backdrop-blur-sm">
        <div className="space-y-8">
          {/* Organization Logo and Basic Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-blue-500/40 flex items-center justify-center overflow-hidden bg-white/50 dark:bg-gray-800/50 shadow-lg flex-shrink-0">
              {org.logo ? (
                <img
                  src={org.logo}
                  alt={`${org.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center w-full h-full flex flex-col items-center justify-center">
                  <Building className="h-12 w-12 text-blue-500/60" />
                  <span className="text-blue-500/60 text-sm font-medium mt-2">No Logo</span>
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Name
                </h3>
                <p className="text-blue-600/80 text-lg">{org.name}</p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Status
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm ${org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {org.status}
                </span>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </h3>
                <p className="text-blue-600/80">{org.email}</p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone
                </h3>
                <p className="text-blue-600/80">{org.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </h3>
                <p className="text-blue-600/80 whitespace-pre-wrap">{org.address || 'N/A'}</p>
              </div>

              {/* Country and State */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Location
                </h3>
                <p className="text-blue-600/80">
                  {org.country ? (
                    <>
                      {countries.find(c => c.value === org.country)?.label || org.country}
                      {org.state && `, ${states[org.country]?.find(s => s.value === org.state)?.label || org.state}`}
                    </>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Digital Presence */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6" />
              Digital Presence
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Website */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Website
                </h3>
                <p className="text-blue-600/80">
                  {org.website ? (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {org.website}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Industry
                </h3>
                <p className="text-blue-600/80">{org.industry || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-4">
              <User className="h-6 w-6" />
              Owner Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Name */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Owner Name
                </h3>
                <p className="text-blue-600/80">{org.ownerName || 'N/A'}</p>
              </div>

              {/* Owner Phone */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Owner Phone
                </h3>
                <p className="text-blue-600/80">{org.ownerPhone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6" />
              Description
            </h2>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-600/80 whitespace-pre-wrap">
                {org.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for country/state display
const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "in", label: "India" },
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

export default ViewOgination;