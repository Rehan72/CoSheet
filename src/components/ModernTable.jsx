import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
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
import { MoreHorizontal, Edit, Trash2, Eye, Download } from "lucide-react";

const ModernTable = () => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "pending",
      joinDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Moderator",
      status: "active",
      joinDate: "2024-01-10",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "User",
      status: "inactive",
      joinDate: "2024-03-05",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
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

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    setUsers(users.filter(u => u.id !== user.id));
    setSelectedRows(selectedRows.filter(id => id !== user.id));
  };

  // Bulk actions
  const handleBulkDelete = () => {
    setUsers(users.filter(user => !selectedRows.includes(user.id)));
    setSelectedRows([]);
    setSelectAll(false);
  };

  const handleBulkExport = () => {
    const selectedUsers = users.filter(user => selectedRows.includes(user.id));
    console.log("Exporting users:", selectedUsers);
    // Add your export logic here
  };

  return (
    <div className="w-full p-6">
      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-blue-500/90 font-medium">
              {selectedRows.length} user(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="text-blue-500/90 border-blue-500/30 hover:bg-blue-500/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
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
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-blue-500/20 shadow-xl overflow-hidden">
        {/* Table with proper container */}
        <div className="p-6">
          <div className="overflow-hidden rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-blue-500/20 hover:bg-transparent bg-white dark:bg-gray-900">
                  <TableHead className="w-12 text-blue-500/90 dark:text-blue-400/90 font-semibold py-4 bg-white dark:bg-gray-900">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                  </TableHead>
                  <TableHead className="text-blue-500/90 dark:text-blue-400/90 font-semibold py-4 bg-white dark:bg-gray-900">
                    User
                  </TableHead>
                  <TableHead className="text-blue-500/90 dark:text-blue-400/90 font-semibold bg-white dark:bg-gray-900">
                    Role
                  </TableHead>
                  <TableHead className="text-blue-500/90 dark:text-blue-400/90 font-semibold bg-white dark:bg-gray-900">
                    Status
                  </TableHead>
                  <TableHead className="text-blue-500/90 dark:text-blue-400/90 font-semibold bg-white dark:bg-gray-900">
                    Join Date
                  </TableHead>
                  <TableHead className="text-blue-500/90 dark:text-blue-400/90 font-semibold text-right bg-white dark:bg-gray-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow 
                    key={user.id}
                    className={`
                      group relative
                      backdrop-blur-sm
                      border-b border-blue-500/20 
                      transition-all duration-300 ease-in-out
                      hover:z-10
                      my-2 mx-2 mb-2
                      rounded-xl
                      ${isRowSelected(user.id) ? 'bg-blue-500/10 ring-2 ring-blue-500/30' : 'bg-blue-500/10 dark:bg-blue-500/5'}
                      ${index === users.length - 1 ? 'border-b-0' : ''}
                    `}
                    style={{
                      margin: '8px',
                      borderRadius: '12px',
                      marginBotthon:"4px"
                    }}
                  >
                    {/* Checkbox */}
                    <TableCell className="py-5 relative backdrop-blur-sm border-r border-blue-500/10 first:rounded-l-xl">
                      <Checkbox
                        checked={isRowSelected(user.id)}
                        onCheckedChange={() => handleRowSelect(user.id)}
                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                    </TableCell>
                    
                    {/* User Info */}
                    <TableCell className="py-5 relative backdrop-blur-sm border-r border-blue-500/10">
                      <div className="flex flex-col">
                        <span className={`font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors ${
                          isRowSelected(user.id) 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-blue-500/90 dark:text-blue-400/90'
                        }`}>
                          {user.name}
                        </span>
                        <span className={`text-sm group-hover:text-blue-600/90 dark:group-hover:text-blue-300/90 transition-colors ${
                          isRowSelected(user.id)
                            ? 'text-blue-600/90 dark:text-blue-400/90'
                            : 'text-blue-500/80 dark:text-blue-400/80'
                        }`}>
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    
                    {/* Role */}
                    <TableCell className="py-5 relative backdrop-blur-sm border-r border-blue-500/10">
                      <span className={`group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors ${
                        isRowSelected(user.id)
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-blue-500/90 dark:text-blue-400/90'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell className="py-5 relative backdrop-blur-sm border-r border-blue-500/10">
                      <Badge 
                        variant={getStatusVariant(user.status)}
                        className={`
                          rounded-full px-3 py-1 text-xs font-medium
                          transition-all duration-300
                          group-hover:scale-105
                          border border-blue-500/30
                          ${user.status === 'active' ? 'bg-green-500/20 text-green-700 dark:text-green-300 group-hover:bg-green-500/30' : ''}
                          ${user.status === 'inactive' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 group-hover:bg-blue-500/30' : ''}
                          ${user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 group-hover:bg-yellow-500/30' : ''}
                        `}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    
                    {/* Join Date */}
                    <TableCell className="py-5 relative backdrop-blur-sm border-r border-blue-500/10">
                      <span className={`group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors ${
                        isRowSelected(user.id)
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-blue-500/90 dark:text-blue-400/90'
                      }`}>
                        {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell className="py-5 text-right relative backdrop-blur-sm last:rounded-r-xl">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 bg-blue-500/20 dark:bg-blue-500/10 hover:bg-blue-500/30 dark:hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-105 text-blue-500/90"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="backdrop-blur-sm bg-blue-500/20 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-400/30"
                        >
                          <DropdownMenuLabel className="text-blue-500/90 dark:text-blue-400/90">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-blue-500/20" />
                          <DropdownMenuItem 
                            onClick={() => handleEdit(user)}
                            className="flex items-center gap-2 cursor-pointer text-blue-500/90 dark:text-blue-400/90 hover:bg-blue-500/20"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEdit(user)}
                            className="flex items-center gap-2 cursor-pointer text-blue-500/90 dark:text-blue-400/90 hover:bg-blue-500/20"
                          >
                            <Edit className="h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEdit(user)}
                            className="flex items-center gap-2 cursor-pointer text-blue-500/90 dark:text-blue-400/90 hover:bg-blue-500/20"
                          >
                            <Download className="h-4 w-4" />
                            Export Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-blue-500/20" />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(user)}
                            className="flex items-center gap-2 cursor-pointer text-red-500/90 dark:text-red-400/90 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="text-center py-12 bg-blue-500/10 dark:bg-blue-500/5 backdrop-blur-sm rounded-xl">
                <div className="text-blue-500/50 dark:text-blue-400/50 mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500/20 dark:bg-blue-500/10 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-blue-500/90 dark:text-blue-400/90 mb-2">
                  No users found
                </h3>
                <p className="text-blue-500/80 dark:text-blue-400/80">
                  Get started by adding a new user to your team.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-blue-500/20 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-blue-500/90 dark:text-blue-400/90">
                Showing {users.length} of {users.length} users
              </p>
              {selectedRows.length > 0 && (
                <p className="text-sm text-blue-500/90 dark:text-blue-400/90">
                  ({selectedRows.length} selected)
                </p>
              )}
            </div>
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
    </div>
  );
};

export default ModernTable;