import React, { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye, Download, ChevronDown, ChevronRight, Phone, Mail, MapPin, Calendar } from "lucide-react";

const CardTable = () => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: "New York, NY",
      role: "Admin",
      status: "active",
      joinDate: "2024-01-15",
      department: "Engineering",
      lastLogin: "2024-01-20",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      address: "San Francisco, CA",
      role: "User",
      status: "pending",
      joinDate: "2024-02-20",
      department: "Marketing",
      lastLogin: "2024-02-18",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1234567892",
      address: "Chicago, IL",
      role: "Moderator",
      status: "active",
      joinDate: "2024-01-10",
      department: "Support",
      lastLogin: "2024-01-22",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1234567893",
      address: "Austin, TX",
      role: "User",
      status: "inactive",
      joinDate: "2024-03-05",
      department: "Sales",
      lastLogin: "2024-02-28",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  const getStatusVariant = (status) => {
    switch (status) {
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

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
      case "Moderator":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30";
      default:
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
    }
  };

  // Handle individual row selection
  const handleRowSelect = (userId) => {
    setSelectedRows(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(users.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  // Check if a row is selected
  const isRowSelected = (userId) => selectedRows.includes(userId);

  // Handle expand/collapse - now triggered by clicking anywhere on the card
  const toggleExpand = (userId, event) => {
    // Prevent triggering when clicking on checkbox or dropdown
    if (event.target.closest('[data-prevent-expand]')) {
      return;
    }
    setExpandedRows(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const isExpanded = (userId) => expandedRows.includes(userId);

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    setUsers(users.filter(u => u.id !== user.id));
    setSelectedRows(selectedRows.filter(id => id !== user.id));
    setExpandedRows(expandedRows.filter(id => id !== user.id));
  };

  // Bulk actions
  const handleBulkDelete = () => {
    setUsers(users.filter(user => !selectedRows.includes(user.id)));
    setSelectedRows([]);
    setSelectAll(false);
    setExpandedRows([]);
  };

  const handleBulkExport = () => {
    const selectedUsers = users.filter(user => selectedRows.includes(user.id));
    console.log("Exporting users:", selectedUsers);
  };

  return (
    <div className="w-full p-6">
      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="text-blue-500/90 font-medium text-lg">
              {selectedRows.length} user(s) selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="text-red-500/90 border-red-500/30 hover:bg-red-500/20 backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Header with Select All */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selectAll}
            onCheckedChange={handleSelectAll}
            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          />
          <span className="text-blue-500/90 font-semibold">
            Select All ({users.length} users)
          </span>
        </div>
        <div className="text-sm text-blue-500/80">
          {selectedRows.length > 0 && `${selectedRows.length} selected`}
        </div>
      </div>

      {/* Cards Container */}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={(e) => toggleExpand(user.id, e)}
            className={`
              relative rounded-2xl border transition-all duration-300 ease-in-out
              backdrop-blur-sm overflow-hidden cursor-pointer
              group
              ${isRowSelected(user.id) 
                ? 'bg-blue-500/10 border-blue-500/30 ring-2 ring-blue-500/20' 
                : 'bg-white/50 dark:bg-gray-800/30 border-blue-500/20 dark:border-blue-400/20'
              }
              hover:shadow-xl hover:scale-[1.02]
              hover:border-l-4 hover:border-l-red-500
              ${isExpanded(user.id) ? 'border-l-4 border-l-red-500' : ''}
            `}
          >
            {/* Red left border indicator */}
            <div className={`
              absolute left-0 top-0 h-full w-1 bg-red-500 transition-all duration-300
              ${isExpanded(user.id) || 'group-hover:scale-y-100 scale-y-0'}
            `} />

            {/* Main Card Content */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                {/* Left Section - Checkbox and Basic Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div 
                    data-prevent-expand 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isRowSelected(user.id)}
                      onCheckedChange={() => handleRowSelect(user.id)}
                      className="mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`text-xl font-bold ${
                        isRowSelected(user.id) 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : 'text-blue-500/90 dark:text-blue-400/90'
                      }`}>
                        {user.name}
                      </h3>
                      <Badge className={`rounded-full px-3 py-1 text-xs font-semibold border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                      <Badge className={`rounded-full px-3 py-1 text-xs font-semibold border ${getStatusVariant(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500/80" />
                        <span className="text-blue-500/90 dark:text-blue-400/90">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-500/80" />
                        <span className="text-blue-500/90 dark:text-blue-400/90">{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500/80" />
                        <span className="text-blue-500/90 dark:text-blue-400/90">{user.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500/80" />
                        <span className="text-blue-500/90 dark:text-blue-400/90">Joined {user.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Actions and Expand Indicator */}
                <div 
                  className="flex items-center gap-2"
                  data-prevent-expand 
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Expand Indicator */}
                  <div className={`
                    flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
                    ${isExpanded(user.id) 
                      ? 'bg-red-500/20 text-red-700 dark:text-red-300' 
                      : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                    }
                  `}>
                    {isExpanded(user.id) ? (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>Expanded</span>
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-4 w-4" />
                        <span>Click to expand</span>
                      </>
                    )}
                  </div>
                  
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
                      className="backdrop-blur-sm bg-blue-500/20 dark:bg-blue-500/10 border border-blue-500/30"
                    >
                      <DropdownMenuLabel className="text-blue-500/90">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-blue-500/20" />
                      <DropdownMenuItem 
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-2 text-blue-500/90 hover:bg-blue-500/20"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-2 text-blue-500/90 hover:bg-blue-500/20"
                      >
                        <Edit className="h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-2 text-blue-500/90 hover:bg-blue-500/20"
                      >
                        <Download className="h-4 w-4" />
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-blue-500/20" />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(user)}
                        className="flex items-center gap-2 text-red-500/90 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded(user.id) && (
              <div className="border-t border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-500/90 text-sm uppercase tracking-wide">
                      Personal Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-500/80">User ID:</span>
                        <span className="text-blue-500/90 font-medium">{user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-500/80">Department:</span>
                        <span className="text-blue-500/90 font-medium">{user.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-500/80">Last Login:</span>
                        <span className="text-blue-500/90 font-medium">{user.lastLogin}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-500/90 text-sm uppercase tracking-wide">
                      Account Status
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-500/80">Membership:</span>
                        <Badge className={getStatusVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-500/80">Role Level:</span>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-500/90 text-sm uppercase tracking-wide">
                      Quick Actions
                    </h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20">
                        Send Message
                      </Button>
                      <Button size="sm" variant="outline" className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500-20">
                        Reset Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-16 bg-blue-500/10 dark:bg-blue-500/5 backdrop-blur-sm rounded-2xl border border-blue-500/20">
          <div className="text-blue-500/50 dark:text-blue-400/50 mb-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/20 dark:bg-blue-500/10 flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-blue-500/90 dark:text-blue-400/90 mb-2">
            No users found
          </h3>
          <p className="text-blue-500/80 dark:text-blue-400/80 text-lg">
            Get started by adding a new user to your team.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 px-4 py-3 border-t border-blue-500/20 bg-white/40 dark:bg-gray-800/40 rounded-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-500/90 dark:text-blue-400/90">
            Showing {users.length} of {users.length} users
            {selectedRows.length > 0 && ` • ${selectedRows.length} selected`}
          </p>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled
              className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTable;