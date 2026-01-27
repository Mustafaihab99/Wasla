import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useGetUsersByRole from "../../hooks/admin/useGetUsersByRole";
import useChangeStatusUser from "../../hooks/admin/useChangeStatusUser";
import useRoles from "../../hooks/auth/useRoles";
import { roleData } from "../../types/auth/authData";
import { adminUsersData } from "../../types/admin/adminTypes";
import { FaUsers, FaFilter, FaUserCheck, FaUserSlash, FaSpinner } from "react-icons/fa";
import { RiUserStarFill } from "react-icons/ri";

enum UserStatus {
  Active = 0,
  Suspended = 1,
  NotApproved = 2,
  Deleted = 3,
}

const statusLabel = (status: number) => {
  switch (status) {
    case UserStatus.Active:
      return "Active";
    case UserStatus.Suspended:
      return "Suspended";
    case UserStatus.NotApproved:
      return "Pending";
    case UserStatus.Deleted:
      return "Deleted";
    default:
      return "Unknown";
  }
};

const statusColor = (status: number) => {
  switch (status) {
    case UserStatus.Active:
      return {
        bg: "bg-green-500/10",
        text: "text-green-600",
        border: "border-green-500/20",
        dot: "bg-green-500"
      };
    case UserStatus.NotApproved:
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-600",
        border: "border-yellow-500/20",
        dot: "bg-yellow-500"
      };
    case UserStatus.Suspended:
      return {
        bg: "bg-red-500/10",
        text: "text-red-600",
        border: "border-red-500/20",
        dot: "bg-red-500"
      };
    case UserStatus.Deleted:
      return {
        bg: "bg-gray-500/10",
        text: "text-gray-600",
        border: "border-gray-500/20",
        dot: "bg-gray-500"
      };
    default:
      return {
        bg: "bg-gray-500/10",
        text: "text-gray-600",
        border: "border-gray-500/20",
        dot: "bg-gray-500"
      };
  }
};

const PAGE_SIZE = 10;

export default function AdminManageUsers() {
  const [role, setRole] = useState<string>("doctor");
  const [page, setPage] = useState(1);

  // Get roles
  const { data: roles, isLoading: rolesLoading } = useRoles();
  
  // Get users by role
  const { 
    data, 
    isLoading, 
    refetch,
    error 
  } = useGetUsersByRole(role, page, PAGE_SIZE);
  
  // Change status mutation
  const { mutate: changeStatus, isPending: isChanging } = useChangeStatusUser();

  // Debug logging
  useEffect(() => {
    console.log("Current role:", role);
    console.log("Page:", page);
    console.log("API Response:", data);
    console.log("Error:", error);
  }, [role, page, data, error]);
  // التصحيح هنا - الـ API بترجع data.data
  const users =  data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  console.log("length" , users.length) 

  // حساب الإحصائيات
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === UserStatus.Active).length,
    pending: users.filter(u => u.status === UserStatus.NotApproved).length,
    suspended: users.filter(u => u.status === UserStatus.Suspended).length,
  };

  // تغيير الفلتر
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setPage(1);
  };

  // تغيير حالة المستخدم
  const handleStatusChange = (userId: string, status: number) => {
    changeStatus(
      { userId, status },
      {
        onSuccess: () => {
          // إعادة جلب البيانات
          refetch();
        },
        onError: (err) => {
          console.error("Failed to change status:", err);
        }
      }
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* =======================
          Header
      ======================= */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 md:p-6 rounded-2xl border border-primary/20"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <FaUsers className="text-xl md:text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Manage and monitor all user accounts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Viewing:
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-medium text-sm md:text-base">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            {isLoading && (
              <FaSpinner className="animate-spin text-primary ml-2" />
            )}
          </div>
        </div>
      </motion.div>

      {/* =======================
          Stats Cards
      ======================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-card border border-border rounded-xl p-3 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Total Users</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-primary/10">
              <FaUsers className="text-base md:text-xl text-primary" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1 md:mt-2">
            Current role
          </div>
        </div>

        <div className="bg-card border border-green-500/20 rounded-xl p-3 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Active</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold mt-1 text-green-600">{stats.active}</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-green-500/10">
              <RiUserStarFill className="text-base md:text-xl text-green-600" />
            </div>
          </div>
          <div className="text-xs text-green-600/70 mt-1 md:mt-2">
            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
          </div>
        </div>

        <div className="bg-card border border-yellow-500/20 rounded-xl p-3 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-yellow-500/10">
              <FaUserCheck className="text-base md:text-xl text-yellow-600" />
            </div>
          </div>
          <div className="text-xs text-yellow-600/70 mt-1 md:mt-2">
            Awaiting approval
          </div>
        </div>

        <div className="bg-card border border-red-500/20 rounded-xl p-3 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Suspended</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold mt-1 text-red-600">{stats.suspended}</p>
            </div>
            <div className="p-2 md:p-3 rounded-full bg-red-500/10">
              <FaUserSlash className="text-base md:text-xl text-red-600" />
            </div>
          </div>
          <div className="text-xs text-red-600/70 mt-1 md:mt-2">
            Temporarily disabled
          </div>
        </div>
      </div>

      {/* =======================
          Roles Filter
      ======================= */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <FaFilter className="text-primary text-base md:text-lg" />
            <h3 className="font-semibold text-foreground text-base md:text-lg">
              Filter by Role
            </h3>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <FaSpinner className="animate-spin text-xs md:text-sm" />
              <span className="text-xs md:text-sm">Loading...</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">
          {rolesLoading ? (
            <div className="flex gap-2 md:gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 md:h-12 w-20 md:w-32 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 md:gap-3">
              {roles?.map((r: roleData) => {
                const active = role === r.roleName;
                
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.roleName)}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 border flex items-center gap-2 md:gap-3 text-sm md:text-base
                      ${active 
                        ? "border-primary bg-primary text-white shadow-lg" 
                        : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    disabled={isLoading}
                  >
                    <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${active ? "bg-white" : "bg-primary"}`} />
                    {r.roleName}
                    {active && isLoading && (
                      <FaSpinner className="animate-spin text-xs md:text-sm ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =======================
          Users Table
      ======================= */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="p-3 md:p-4 font-semibold text-foreground text-left text-sm md:text-base">
                    User
                  </th>
                  <th className="p-3 md:p-4 font-semibold text-foreground text-left text-sm md:text-base">
                    Email
                  </th>
                  <th className="p-3 md:p-4 font-semibold text-foreground text-left text-sm md:text-base">
                    Status
                  </th>
                  <th className="p-3 md:p-4 font-semibold text-foreground text-left text-sm md:text-base">
                    Joined
                  </th>
                  <th className="p-3 md:p-4 font-semibold text-foreground text-right text-sm md:text-base">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6 md:p-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground text-sm md:text-base">
                          Loading {role} users...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 md:p-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="text-3xl md:text-4xl lg:text-5xl mb-2">👤</div>
                        <p className="text-base md:text-lg font-medium text-foreground">
                          No users found
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          No {role} users available in the system
                        </p>
                        <button
                          onClick={() => refetch()}
                          className="mt-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                          Refresh
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user: adminUsersData) => {
                    const statusColors = statusColor(user.status);
                    
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-3 md:p-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-sm md:text-base lg:text-lg">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm md:text-base truncate">
                                {user.name || "—"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                ID: {user.id?.slice(0, 6) || 'N/A'}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="text-foreground text-sm md:text-base truncate max-w-[150px] md:max-w-[200px] lg:max-w-none">
                            {user.email}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm"
                            style={{
                              backgroundColor: statusColors.bg,
                              color: statusColors.text,
                              borderColor: statusColors.border
                            }}
                          >
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${statusColors.dot}`} />
                            {statusLabel(user.status)}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="text-xs md:text-sm text-muted-foreground">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="flex justify-end gap-1.5 md:gap-2">
                            {user.status === UserStatus.NotApproved && (
                              <button
                                disabled={isChanging}
                                onClick={() => handleStatusChange(user.id, UserStatus.Active)}
                                className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow text-xs md:text-sm flex items-center gap-1 md:gap-2"
                              >
                                {isChanging ? <FaSpinner className="animate-spin" /> : <FaUserCheck />}
                                <span className="hidden sm:inline">Approve</span>
                              </button>
                            )}

                            {user.status === UserStatus.Active && (
                              <button
                                disabled={isChanging}
                                onClick={() => handleStatusChange(user.id, UserStatus.Suspended)}
                                className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow text-xs md:text-sm flex items-center gap-1 md:gap-2"
                              >
                                {isChanging ? <FaSpinner className="animate-spin" /> : <FaUserSlash />}
                                <span className="hidden sm:inline">Suspend</span>
                              </button>
                            )}

                            {user.status === UserStatus.Suspended && (
                              <button
                                disabled={isChanging}
                                onClick={() => handleStatusChange(user.id, UserStatus.Active)}
                                className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow text-xs md:text-sm flex items-center gap-1 md:gap-2"
                              >
                                {isChanging ? <FaSpinner className="animate-spin" /> : <RiUserStarFill />}
                                <span className="hidden sm:inline">Activate</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =======================
          Pagination
      ======================= */}
      {totalPages > 1 && !isLoading && users.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 p-3 md:p-5 bg-card border border-border rounded-xl">
          <span className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
            Page {page} of {totalPages} • {totalCount} total {role} users
          </span>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-1.5 md:gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
            >
              First
            </button>

            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
            >
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (page === 1) {
                  pageNum = i + 1;
                } else if (page === totalPages) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = page - 1 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-lg transition-all text-sm md:text-base ${
                      page === pageNum
                        ? "bg-primary text-white shadow-md"
                        : "hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
            >
              Next
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs md:text-sm"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}