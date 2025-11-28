import React, { useMemo } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Clock,
  Building,
  Shield,
  Activity,
} from "lucide-react";

// Simple bar chart component
const SimpleBarChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...Object.values(data));
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-blue-600/80">{title}</h4>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-20 text-xs text-blue-600/60 truncate">{key}</div>
            <div className="flex-1 bg-blue-500/10 rounded-full h-6 relative">
              <div
                className={`h-6 rounded-full ${colorClasses[color]} transition-all duration-500`}
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  {value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple pie chart representation
const SimplePieChart = ({ data, title, colors = ["blue", "green", "purple", "red", "yellow"] }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-blue-600/80">{title}</h4>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value], index) => {
          const percentage = ((value / total) * 100).toFixed(1);
          return (
            <div key={key} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${colorClasses[colors[index % colors.length]]}`} />
              <div className="flex-1 text-xs text-blue-600/60">{key}</div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {value} ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UserAnalytics = ({ users = [], activityLog = [] }) => {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalUsers = users.length;

    // Status distribution
    const statusCounts = users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {});

    // Role distribution
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    // Department distribution
    const departmentCounts = users.reduce((acc, user) => {
      acc[user.department] = (acc[user.department] || 0) + 1;
      return acc;
    }, {});

    // Gender distribution
    const genderCounts = users.reduce((acc, user) => {
      const gender = user.gender || 'Not specified';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    // Join date trends (last 12 months)
    const monthlyJoins = users.reduce((acc, user) => {
      if (user.joinDate) {
        const date = new Date(user.joinDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      totalUsers,
      statusCounts,
      roleCounts,
      departmentCounts,
      genderCounts,
      monthlyJoins,
    };
  }, [users]);


  if (users.length === 0) {
    return (
      <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <BarChart3 className="h-5 w-5" />
            User Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-blue-500/30 mx-auto mb-3" />
            <p className="text-blue-500/60">No user data available for analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500/70" />
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {analytics.totalUsers}
                </div>
                <div className="text-sm text-blue-500/80">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-500/70" />
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {analytics.statusCounts.active || 0}
                </div>
                <div className="text-sm text-green-500/80">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-500/70" />
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {analytics.roleCounts.Admin || 0}
                </div>
                <div className="text-sm text-purple-500/80">Admin Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-yellow-500/70" />
              <div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {Object.keys(analytics.departmentCounts).length}
                </div>
                <div className="text-sm text-yellow-500/80">Departments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <PieChart className="h-5 w-5" />
              User Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart
              data={analytics.statusCounts}
              title="Status Breakdown"
              colors={["green", "yellow", "gray"]}
            />
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Shield className="h-5 w-5" />
              Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart
              data={analytics.roleCounts}
              title="Role Breakdown"
              colors={["red", "blue", "purple"]}
            />
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Building className="h-5 w-5" />
              Department Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={analytics.departmentCounts}
              title="Users by Department"
              color="purple"
            />
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Users className="h-5 w-5" />
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePieChart
              data={analytics.genderCounts}
              title="Gender Breakdown"
              colors={["blue", "pink", "gray"]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <TrendingUp className="h-5 w-5" />
            User Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {analytics.totalUsers}
                </div>
                <div className="text-sm text-blue-500/80">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {((analytics.statusCounts.active || 0) / analytics.totalUsers * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-500/80">Active Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {Object.keys(analytics.roleCounts).length}
                </div>
                <div className="text-sm text-purple-500/80">Unique Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {Object.keys(analytics.departmentCounts).length}
                </div>
                <div className="text-sm text-yellow-500/80">Departments</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-500/20">
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <Badge
                  key={status}
                  className={`px-3 py-1 ${
                    status === 'active'
                      ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30'
                      : status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30'
                      : 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30'
                  }`}
                >
                  {status}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activityLog.length > 0 ? (
              activityLog.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-blue-500/70" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-blue-500/60" />
                      <span className="text-xs text-blue-500/60">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs text-blue-500/60">•</span>
                      <span className="text-xs text-blue-500/60">{activity.user}</span>
                    </div>
                  </div>
                  <Badge
                    className={`text-xs ${
                      activity.action === "create"
                        ? "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
                        : activity.action === "update"
                        ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30"
                        : activity.action === "delete"
                        ? "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30"
                        : "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30"
                    }`}
                  >
                    {activity.action}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-blue-500/30 mx-auto mb-3" />
                <p className="text-blue-500/60">No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;