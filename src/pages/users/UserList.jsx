import React, { useState, useEffect, useDeferredValue, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../../services/AxiosBaseService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Settings,
  Eye as EyeIcon,
  EyeOff,
  FileText,
  FileSpreadsheet,
  Upload,
  BarChart3,
  Activity,
  Clock,
  X,
} from "lucide-react";
import { DatePicker } from "../../components/ui/date-picker";
import ErrorBoundary from "../../components/ErrorBoundary";
import { SidebarLoadingFallback } from "../../components/LoadingFallback";
import UserAnalytics from "../../components/UserAnalytics";
import CalendarView from "../../components/CalendarView";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  Table as TableIcon,
  Calendar as CalendarIcon,
} from "lucide-react";

// Status badge styling helper
const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "inactive":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    default:
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
  }
};

// Role badge styling helper
const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
    case "moderator":
      return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30";
    default:
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
  }
};

// User List Content Component
function UserListContent({
  users,
  selectedRows,
  selectAll,
  sortConfig,
  columnVisibility,
  onSelectAll,
  onSelectRow,
  onSort,
  onView,
  onEdit,
  onDelete,
}) {
  const isRowSelected = (userId) => selectedRows.includes(userId);

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="rounded-xl border border-blue-500/20 overflow-hidden bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-500/10 hover:bg-blue-500/15 border-b border-blue-500/20 h-14">
            <TableHead className="w-12 h-14">
              <Checkbox
                checked={selectAll}
                onCheckedChange={onSelectAll}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
            </TableHead>
            {columnVisibility.avatar && <TableHead className="w-16 h-14">Avatar</TableHead>}
            <TableHead
              className="cursor-pointer hover:text-blue-600 h-14"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center">
                Name {getSortIcon("name")}
              </div>
            </TableHead>
            {columnVisibility.email && (
              <TableHead
                className="cursor-pointer hover:text-blue-600 h-14"
                onClick={() => onSort("email")}
              >
                <div className="flex items-center">
                  Email {getSortIcon("email")}
                </div>
              </TableHead>
            )}
            {columnVisibility.phone && <TableHead className="h-14">Phone</TableHead>}
            {columnVisibility.role && (
              <TableHead
                className="cursor-pointer hover:text-blue-600 h-14"
                onClick={() => onSort("role")}
              >
                <div className="flex items-center">
                  Role {getSortIcon("role")}
                </div>
              </TableHead>
            )}
            {columnVisibility.status && (
              <TableHead
                className="cursor-pointer hover:text-blue-600 h-14"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </TableHead>
            )}
            {columnVisibility.department && <TableHead className="h-14">Department</TableHead>}
            {columnVisibility.joinDate && (
              <TableHead
                className="cursor-pointer hover:text-blue-600 h-14"
                onClick={() => onSort("joinDate")}
              >
                <div className="flex items-center">
                  Join Date {getSortIcon("joinDate")}
                </div>
              </TableHead>
            )}
            {columnVisibility.actions && <TableHead className="text-right h-14">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={`
                transition-colors border-b border-blue-500/10 h-16
                ${isRowSelected(user.id)
                  ? "bg-blue-500/10 hover:bg-blue-500/15"
                  : "hover:bg-blue-500/5"
                }
              `}
            >
              <TableCell className="h-16">
                <Checkbox
                  checked={isRowSelected(user.id)}
                  onCheckedChange={() => onSelectRow(user.id)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
              </TableCell>
              {columnVisibility.avatar && (
                <TableCell className="h-16">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-blue-500/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500/70" />
                    </div>
                  )}
                </TableCell>
              )}
              <TableCell className="font-medium text-blue-700 dark:text-blue-300 h-16">
                {user.name}
              </TableCell>
              {columnVisibility.email && (
                <TableCell className="text-blue-600/80 dark:text-blue-400/80 h-16">
                  {user.email}
                </TableCell>
              )}
              {columnVisibility.phone && (
                <TableCell className="text-blue-600/80 dark:text-blue-400/80 h-16">
                  {user.phone}
                </TableCell>
              )}
              {columnVisibility.role && (
                <TableCell className="h-16">
                  <Badge className={`rounded-full px-3 py-1 text-xs font-semibold border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </Badge>
                </TableCell>
              )}
              {columnVisibility.status && (
                <TableCell className="h-16">
                  <Badge className={`rounded-full px-3 py-1 text-xs font-semibold border ${getStatusVariant(user.status)}`}>
                    {user.status?.charAt(0)?.toUpperCase() + user.status?.slice(1)}
                  </Badge>
                </TableCell>
              )}
              {columnVisibility.department && (
                <TableCell className="text-blue-600/80 dark:text-blue-400/80 h-16">
                  {user.department}
                </TableCell>
              )}
              {columnVisibility.joinDate && (
                <TableCell className="text-blue-600/80 dark:text-blue-400/80 h-16">
                  {user.joinDate}
                </TableCell>
              )}
              {columnVisibility.actions && (
                <TableCell className="text-right h-16">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-blue-500/20 text-blue-500/90 hover:bg-blue-500/30"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                    >
                      <DropdownMenuLabel className="text-gray-900 dark:text-white">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                      <DropdownMenuItem
                        onClick={() => onView(user)}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(user)}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-blue-500" />
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-blue-500/90 mb-2">
            No users found
          </h3>
          <p className="text-blue-500/80">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}

function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: "", end: "" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // Advanced Features State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    avatar: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    status: true,
    department: true,
    joinDate: true,
    actions: true,
  });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState("");
  const [activityLog, setActivityLog] = useState([]);

  // React 19.2: useDeferredValue for search - keeps UI responsive
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRequest("public/randomusers?page=1&limit=50");
      
      const usersData = response.data?.data || response.data || [];
      
      const transformedUsers = usersData.map((user, index) => {
        const roles = ["Admin", "User", "Moderator"];
        const statuses = ["active", "pending", "inactive"];
        const departments = ["Engineering", "Marketing", "Support", "Sales", "HR"];

        const formatDate = (dateString) => {
          try {
            return new Date(dateString).toISOString().split("T")[0];
          } catch {
            return "Unknown";
          }
        };

        return {
          id: user.id?.toString() || user.login?.uuid || `user-${index}`,
          name: `${user.name?.first || ""} ${user.name?.last || ""}`.trim(),
          email: user.email || "No email",
          phone: user.phone || user.cell || "No phone",
          address: `${user.location?.city || ""}, ${user.location?.state || ""}`.trim(),
          role: roles[index % roles.length],
          status: statuses[index % statuses.length],
          joinDate: formatDate(user.registered?.date),
          department: departments[index % departments.length],
          lastLogin: formatDate(user.dob?.date),
          picture: user.picture?.medium || user.picture?.thumbnail,
          gender: user.gender,
          age: user.dob?.age,
          nationality: user.nat,
          _original: user,
        };
      });

      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (deferredSearchTerm) {
      const searchLower = deferredSearchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.toLowerCase().includes(searchLower) ||
          user.department.toLowerCase().includes(searchLower) ||
          user.address.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Department filter
    if (departmentFilter !== "all") {
      result = result.filter((user) => user.department === departmentFilter);
    }

    // Gender filter
    if (genderFilter !== "all") {
      result = result.filter((user) => user.gender === genderFilter);
    }

    // Date range filter
    if (dateRangeFilter.start || dateRangeFilter.end) {
      result = result.filter((user) => {
        const userDate = new Date(user.joinDate);
        const startDate = dateRangeFilter.start ? new Date(dateRangeFilter.start) : null;
        const endDate = dateRangeFilter.end ? new Date(dateRangeFilter.end) : null;

        if (startDate && userDate < startDate) return false;
        if (endDate && userDate > endDate) return false;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, deferredSearchTerm, statusFilter, roleFilter, departmentFilter, genderFilter, dateRangeFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle row selection
  const handleSelectRow = (userId) => {
    setSelectedRows((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle view user
  const handleView = (user) => {
    console.log("View user:", user);
    // Could navigate to a detail page or open a modal
  };

  // Handle edit user
  const handleEdit = (user) => {
    navigate(`/adduser?id=${user.id}`);
  };

  // Handle delete user
  const handleDelete = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSelectedRows((prev) => prev.filter((id) => id !== user.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} users?`)) {
      setUsers((prev) => prev.filter((user) => !selectedRows.includes(user.id)));
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  // Handle bulk export
  const handleBulkExport = () => {
    const selectedUsers = users.filter((user) => selectedRows.includes(user.id));
    const exportData = selectedUsers.length > 0 ? selectedUsers : filteredUsers;

    if (exportFormat === "json") {
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "csv") {
      const headers = ["ID", "Name", "Email", "Phone", "Role", "Status", "Department", "Join Date"];
      const csvContent = [
        headers.join(","),
        ...exportData.map(user => [
          user.id,
          `"${user.name}"`,
          user.email,
          user.phone,
          user.role,
          user.status,
          user.department,
          user.joinDate
        ].join(","))
      ].join("\n");

      const dataBlob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }

    // Log activity
    logActivity("export", `Exported ${exportData.length} users as ${exportFormat.toUpperCase()}`);
  };

  // Advanced bulk operations
  const handleBulkStatusChange = (newStatus) => {
    const updatedUsers = users.map(user =>
      selectedRows.includes(user.id) ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
    setSelectAll(false);
    logActivity("bulk_update", `Changed status to ${newStatus} for ${selectedRows.length} users`);
  };

  const handleBulkRoleChange = (newRole) => {
    const updatedUsers = users.map(user =>
      selectedRows.includes(user.id) ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
    setSelectAll(false);
    logActivity("bulk_update", `Changed role to ${newRole} for ${selectedRows.length} users`);
  };

  const handleBulkDepartmentChange = (newDepartment) => {
    const updatedUsers = users.map(user =>
      selectedRows.includes(user.id) ? { ...user, department: newDepartment } : user
    );
    setUsers(updatedUsers);
    setSelectedRows([]);
    setSelectAll(false);
    logActivity("bulk_update", `Changed department to ${newDepartment} for ${selectedRows.length} users`);
  };

  // Activity logging
  const logActivity = (action, description) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      description,
      user: "Admin", // In real app, get from auth context
    };
    setActivityLog(prev => [newActivity, ...prev.slice(0, 49)]); // Keep last 50 activities
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
    setRoleFilter("all");
    setDepartmentFilter("all");
    setGenderFilter("all");
    setDateRangeFilter({ start: "", end: "" });
  };

  // Handle add new user
  const handleAddUser = () => {
    navigate("/adduser");
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
          <Button onClick={fetchUsers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
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
              User Management
            </h1>
            <p className="text-blue-500/80 mt-1">
              Manage and organize your team members
            </p>
          </div>
          <Button
            onClick={handleAddUser}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
          
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-500/90">{users.length}</div>
            <div className="text-sm text-blue-500/80">Total Users</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-500/90">
              {users.filter((user) => user.status === "active").length}
            </div>
            <div className="text-sm text-green-500/80">Active Users</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-yellow-500/90">
              {users.filter((user) => user.status === "pending").length}
            </div>
            <div className="text-sm text-yellow-500/80">Pending Users</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-500/90">
              {users.filter((user) => user.role === "Admin").length}
            </div>
            <div className="text-sm text-purple-500/80">Admin Users</div>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                  <Filter className="h-4 w-4 mr-2 text-blue-500/60" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
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

              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={fetchUsers}
                className="border-blue-500/30 text-blue-500/90 hover:bg-blue-500/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
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
        </div>

        {/* Bulk Actions Bar */}
        {selectedRows.length > 0 && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <span className="text-blue-500/90 font-medium">
                {selectedRows.length} user(s) selected
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {/* Export Format Selection */}
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-[120px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>

                {/* Export Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkExport}
                  className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>

                {/* Advanced Bulk Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-purple-500/90 border-purple-500/30 hover:bg-purple-500/20"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("active")}>
                      Set as Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("pending")}>
                      Set as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("inactive")}>
                      Set as Inactive
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleBulkRoleChange("Admin")}>
                      Set as Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleChange("Moderator")}>
                      Set as Moderator
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleChange("User")}>
                      Set as User
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Department</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleBulkDepartmentChange("Engineering")}>
                      Engineering
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkDepartmentChange("Marketing")}>
                      Marketing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkDepartmentChange("Sales")}>
                      Sales
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkDepartmentChange("Support")}>
                      Support
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkDepartmentChange("HR")}>
                      HR
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Delete Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-500/90 border-red-500/30 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-blue-500/10 border border-blue-500/20 h-14">
            <TabsTrigger
              value="table"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white h-12 px-6"
            >
              <TableIcon className="h-4 w-4" />
              User Table
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white h-12 px-6"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white h-12 px-6"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Table Tab */}
          <TabsContent value="table" className="space-y-6">
            {/* User Table */}
            <Suspense fallback={<SidebarLoadingFallback />}>
              <UserListContent
                users={paginatedUsers}
                selectedRows={selectedRows}
                selectAll={selectAll}
                sortConfig={sortConfig}
                columnVisibility={columnVisibility}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
                onSort={handleSort}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Suspense>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border border-blue-500/20 bg-white/40 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <p className="text-sm text-blue-500/90">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </p>
                <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(Number(val))}>
                  <SelectTrigger className="w-[100px] border-blue-500/30 bg-white/50 dark:bg-gray-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 / page</SelectItem>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="20">20 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-blue-500 text-white"
                            : "text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <UserAnalytics users={users} activityLog={activityLog} />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <CalendarView users={users} />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}

export default UserList;
