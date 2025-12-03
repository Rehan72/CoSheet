import { Plus, Shield } from "lucide-react";
import { Button } from "../../components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EyeIcon,Search,EyeOff ,X ,Filter,Settings, Eye, Edit} from "lucide-react";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { DatePicker } from "../../components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Users } from "lucide-react";
import useOrganizationStore from "../../stores/organizationStore";

function Orgination() {
    const navigate = useNavigate();
      const [searchTerm, setSearchTerm] = useState("");
      const [statusFilter, setStatusFilter] = useState("all");
      const [dateRangeFilter, setDateRangeFilter] = useState({ start: "", end: "" });
        const [showColumnSettings, setShowColumnSettings] = useState(false);
// Advanced Features State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    logo: true,
    name: true,
    email: true,
    phone: true,
    status: true,
    actions: true,
  });

  // Get organizations from store
  const { organizations, loading, fetchOrganizations } = useOrganizationStore();

  // Fallback data if store doesn't load
  const fallbackOrganizations = [
    { id: 1, name: 'Tech Innovations Inc.', email: 'contact@techinnovations.com', phone: '+1-555-123-4567', status: 'active', logo: 'https://dummyimage.com/150x150/000/fff&text=Tech+Innovations' },
    { id: 2, name: 'Global Solutions Ltd.', email: 'info@globalsolutions.com', phone: '+1-555-987-6543', status: 'active', logo: 'https://dummyimage.com/150x150/000/fff&text=Global+Solutions' },
  ];

  const orgsToUse = organizations.length > 0 ? organizations : fallbackOrganizations;

  useEffect(() => {
    // Fetch organizations when component mounts
    fetchOrganizations();

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Timeout reached, checking organizations:', organizations);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [fetchOrganizations]);

  const filteredUsers = orgsToUse.filter(org => {
    const matchesSearch = !searchTerm ||
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.phone && org.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const columns = [
    { key: 'logo', label: 'Logo' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' },
  ];

   const handleAddOrgination=()=>{
       navigate("/orgination/addorgination");
   }

    const handleView = (org) => {
        navigate(`/orgination/vieworgination/${org.id}`);
    };

    const handleEdit = (org) => {
        navigate(`/orgination/editorgination/${org.id}`);
    };

    // Column visibility toggle
  const toggleColumnVisibility = (column) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

    // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
   //  setRoleFilter("all");
   //  setDepartmentFilter("all");
   //  setGenderFilter("all");
   //  setDateRangeFilter({ start: "", end: "" });
  };


 if (loading && orgsToUse.length === 0) {
    // Add a timeout to prevent infinite loading
    setTimeout(() => {
      console.log('Still loading, organizations:', organizations);
      console.log('Loading state:', loading);
    }, 1000);

    return (
      <div className="flex items-center justify-center min-h-screen">
        <SidebarLoadingFallback />
        <p className="mt-4 text-gray-500">Loading organizations...</p>
      </div>
    );
  }

  // Debug: Log the organizations data to see if it's loading
  console.log('Organizations data:', organizations);
  console.log('Loading state:', loading);

  return(
      <div className="p-6 space-y-6">
      {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              Orgination Management
            </h1>
            <p className="text-blue-500/80 mt-1">
              Manage and organize your Orgination
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddOrgination}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Orgination
            </Button>
            <Button
              onClick={() => navigate("/organization-hierarchy")}
              variant="outline"
              className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
            >
              <Users className="h-4 w-4 mr-2" />
              View Hierarchy
            </Button>
            <Button
              onClick={() => navigate("/defense-mapping")}
              variant="outline"
              className="border-yellow-500/30 text-yellow-500/90 hover:bg-yellow-500/20"
            >
              <Shield className="h-4 w-4 mr-2" />
              Defense Mapping
            </Button>
          </div>
          
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-500/90">
            {filteredUsers.length}
            </div>
            <div className="text-sm text-blue-500/80">Total Org</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-500/90">
            {filteredUsers.filter((org) => org.status === "active").length}
            </div>
            <div className="text-sm text-green-500/80">Active Org</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-yellow-500/90">
            {filteredUsers.filter((org) => org.status === "inactive").length}
            </div>
            <div className="text-sm text-yellow-500/80">Inactive Org</div>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-500/30 focus:border-blue-500 bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                  <Filter className="h-4 w-4 mr-2 text-blue-500/60" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>


              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Column Settings */}
              <DropdownMenu open={showColumnSettings} onOpenChange={setShowColumnSettings}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(columnVisibility).map(([column, visible]) => (
                    <DropdownMenuItem
                      key={column}
                      onClick={() => toggleColumnVisibility(column)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {visible ? (
                        <EyeIcon className="h-4 w-4 text-blue-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="capitalize">{column}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>

              
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Department Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-600/80">Department</label>
                  <Select value={''} onValueChange={''}>
                    <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-600/80">Gender</label>
                  <Select value={''} onValueChange={''}>
                    <SelectTrigger className="border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Start */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-600/80">Join Date From</label>
                  <DatePicker
                    value={dateRangeFilter.start ? new Date(dateRangeFilter.start) : null}
                    onChange={(date) => setDateRangeFilter(prev => ({
                      ...prev,
                      start: date ? date.toISOString().split('T')[0] : ""
                    }))}
                    placeholder="Select start date"
                  />
                </div>

                {/* Date Range End */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-600/80">Join Date To</label>
                  <DatePicker
                    value={dateRangeFilter.end ? new Date(dateRangeFilter.end) : null}
                    onChange={(date) => setDateRangeFilter(prev => ({
                      ...prev,
                      end: date ? date.toISOString().split('T')[0] : ""
                    }))}
                    placeholder="Select end date"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Organizations Table */}
          <div className="rounded-xl border border-blue-500/20 overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-500/10 hover:bg-blue-500/15 border-b border-blue-500/20 h-14">
                  {columns.filter(col => columnVisibility[col.key]).map(col => (
                    <TableHead key={col.key} className="text-blue-600/80">{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((org) => (
                  <TableRow key={org.id}>
                    {columns.filter(col => columnVisibility[col.key]).map(col => (
                      <TableCell key={col.key}>
                        {col.key === 'logo' && <img src={org.logo || 'https://dummyimage.com/40x40/000/fff&text=Logo'} alt={`${org.name} logo`} className="w-10 h-10 rounded" />}
                        {col.key === 'name' && org.name}
                        {col.key === 'email' && org.email}
                        {col.key === 'phone' && org.phone}
                        {col.key === 'status' && <span className={`px-2 py-1 rounded-full text-xs ${org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{org.status}</span>}
                        {col.key === 'actions' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleView(org)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(org)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
  )
}

export default Orgination;
