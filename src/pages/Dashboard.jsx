import CoSheet from "./CoSheet";
import CardTable from "../components/CardTable";
import ModernTable from "../components/ModernTable";
import React, { useState, useEffect } from "react";
import { getRequest } from "../services/AxiosBaseService";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRequest(`public/randomusers?page=${currentPage}&limit=10`);
        console.log('API Response:', response); // Debug log
        
        // Check if response.data exists and has data array
        const usersData = response.data?.data || response.data || [];
        
        // Transform API data
        const transformedUsers = usersData.map((user, index) => {
          const roles = ['Admin', 'User', 'Moderator'];
          const statuses = ['active', 'pending', 'inactive'];
          const departments = ['Engineering', 'Marketing', 'Support', 'Sales'];

          const formatDate = (dateString) => {
            try {
              return new Date(dateString).toISOString().split('T')[0];
            } catch {
              return 'Unknown';
            }
          };

          return {
            id: user.id?.toString() || user.login?.uuid || `user-${index}`,
            name: `${user.name?.first || ''} ${user.name?.last || ''}`.trim(),
            email: user.email || 'No email',
            phone: user.phone || user.cell || 'No phone',
            address: `${user.location?.city || ''}, ${user.location?.state || ''}`.trim(),
            role: roles[index % roles.length],
            status: statuses[index % statuses.length],
            joinDate: formatDate(user.registered?.date),
            department: departments[index % departments.length],
            lastLogin: formatDate(user.dob?.date),
            // Include additional API data for expanded view
            picture: user.picture?.medium || user.picture?.thumbnail,
            gender: user.gender,
            age: user.dob?.age,
            nationality: user.nat,
            _original: user // Keep original API data
          };
        });

        setUsers(transformedUsers);
        
        // Set pagination info if available in API response
        if (response.data && typeof response.data === 'object') {
          setPaginationInfo({
            currentPageItems: transformedUsers.length,
            totalItems: response.data.totalItems || transformedUsers.length,
            totalPages: response.data.totalPages || 1,
            currentPage: response.data.page || 1,
            previousPage: response.data.previousPage || false,
            nextPage: response.data.nextPage || false
          });
        }

      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  // Event handlers for CardTable
  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    console.log("Delete user:", user);
    setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
  };

  const handleBulkDelete = (selectedIds) => {
    console.log("Bulk delete:", selectedIds);
    setUsers(prevUsers => prevUsers.filter(user => !selectedIds.includes(user.id)));
  };

  const handleBulkExport = (selectedIds) => {
    console.log("Bulk export:", selectedIds);
    const selectedUsers = users.filter(user => selectedIds.includes(user.id));
  };

  const handlePrevious = () => {
    if (paginationInfo?.previousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (paginationInfo?.nextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-blue-500/90">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500/90">{error}</div>
      </div>
    );
  }

  console.log('Transformed Users:', users);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      {/* <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-500/90 dark:text-blue-400/90">
          User Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and view all user information in one place
        </p>
      </div> */}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-500/90">{users.length}</div>
          <div className="text-sm text-blue-500/80">Total Users</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-green-500/90">
            {users.filter(user => user.status === 'active').length}
          </div>
          <div className="text-sm text-green-500/80">Active Users</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-yellow-500/90">
            {users.filter(user => user.status === 'pending').length}
          </div>
          <div className="text-sm text-yellow-500/80">Pending Users</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold text-purple-500/90">
            {users.filter(user => user.role === 'Admin').length}
          </div>
          <div className="text-sm text-purple-500/80">Admin Users</div>
        </div>
      </div>

      {/* CardTable */}
      <div>
        <CardTable
          users={users}
          title="Team Members"
          subtitle="Manage your team members and their permissions"
          showPagination={true}
          paginationInfo={paginationInfo}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

export default Dashboard;