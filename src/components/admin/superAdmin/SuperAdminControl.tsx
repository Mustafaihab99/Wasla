import { useState } from "react";
import {
  FaUserShield,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaUserPlus,
  FaEllipsisV,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useTranslation } from "react-i18next";

import useGetAllAdmins from "../../../hooks/admin/superAdmin/useGetAllAdmins";
import useAddAdmin from "../../../hooks/admin/superAdmin/useAddAdmin";
import useDeleteAdmin from "../../../hooks/admin/superAdmin/useDeleteAdmin";
import useToogleAdminStatus from "../../../hooks/admin/superAdmin/useToogleAdminStatus";

import AddAdminModal from "../Modal/AddAdminModal";
import ConfirmDeleteModal from "../Modal/DeleteAdminModal";
import { addAdminData } from "../../../types/admin/adminTypes";

export default function SuperAdminControl() {
  const { t } = useTranslation();

  const { data: admins, isLoading } = useGetAllAdmins();
  const { mutate: addAdmin } = useAddAdmin();
  const { mutate: deleteAdmin } = useDeleteAdmin();
  const { mutate: toggleStatus } = useToogleAdminStatus();

  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  const selectedAdmin = admins?.find((a) => a.id === deleteId);

  // Filter admins based on search
  const filteredAdmins = admins?.filter(
    (admin) =>
      admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone?.includes(searchTerm),
  );

  const getStatusBadge = (status: number) => {
    if (status === 0) {
      return {
        text: t("admin.Active"),
        className:
          "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
        icon: FaCheckCircle,
      };
    }
    return {
      text: t("admin.Suspended"),
      className: "bg-red-500/10 text-red-600 border border-red-500/20",
      icon: FaTimesCircle,
    };
  };

  return (
    <div className="min-h-screen bg-background"
    style={{direction : "ltr"}}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header Section - Enhanced */}
        <div className="mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl shadow-lg">
                  <MdAdminPanelSettings className="text-primary text-2xl sm:text-3xl" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                    {t("admin.adminsControl")}
                  </h1>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="group relative px-5 py-2.5 bg-primary text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 overflow-hidden">
              <div className="absolute inset-0 " />
              <FaUserPlus className="text-lg" />
              <span className="font-semibold">{t("admin.addAdmin")}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-4 border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("admin.totalAdmins")}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {admins?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FaUserShield className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("admin.activeAdmins")}
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {admins?.filter((a) => a.status === 0).length || 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <FaCheckCircle className="text-emerald-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("admin.suspendedAdmins")}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {admins?.filter((a) => a.status !== 0).length || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FaTimesCircle className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("admin.searchAdmins")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Table - Desktop View */}
        <div className="hidden lg:block">
          <div className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border">
                    <th className="p-4 text-left text-sm font-semibold text-foreground/80">
                      {t("admin.fullName")}
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-foreground/80">
                      {t("admin.Email")}
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-foreground/80">
                      {t("admin.phone")}
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-foreground/80">
                      {t("admin.status")}
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-foreground/80">
                      {t("admin.Actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center p-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                          <p className="text-sm text-muted-foreground">
                            {t("admin.loadingAdmins")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAdmins?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-12">
                        <div className="flex flex-col items-center gap-2">
                          <FaUserShield className="text-4xl text-muted-foreground/40" />
                          <p className="text-muted-foreground">
                            {t("admin.noAdminsFound")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins?.map((admin) => {
                      const status = getStatusBadge(admin.status);
                      const StatusIcon = status.icon;

                      return (
                        <tr
                          key={admin.id}
                          className="border-b last:border-none hover:bg-muted/30 transition-all duration-150 group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaUserShield className="text-primary text-lg" />
                              </div>
                              <span className="font-medium">
                                {admin.fullName}
                              </span>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-muted-foreground text-sm" />
                              <span className="text-sm">{admin.email}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-muted-foreground text-sm" />
                              <span className="text-sm">{admin.phone}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.className}`}>
                              <StatusIcon className="text-sm" />
                              {status.text}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => toggleStatus(admin.id)}
                                className="p-2 rounded-xl hover:bg-muted transition-all group/btn"
                                title={
                                  admin.status === 0
                                    ? t("admin.suspend")
                                    : t("admin.activate")
                                }>
                                {admin.status === 0 ? (
                                  <FaToggleOn className="text-emerald-500 text-2xl hover:scale-110 transition-transform" />
                                ) : (
                                  <FaToggleOff className="text-gray-400 text-2xl hover:scale-110 transition-transform" />
                                )}
                              </button>

                              <button
                                onClick={() => setDeleteId(admin.id)}
                                className="p-2 rounded-xl hover:bg-red-500/10 transition-all group/btn"
                                title={t("admin.delete")}>
                                <FaTrash className="text-red-500 text-lg hover:scale-110 transition-transform" />
                              </button>
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

        {/* Mobile View - Cards */}
        <div className="lg:hidden space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
              <p className="mt-3 text-sm text-muted-foreground">
                {t("admin.loadingAdmins")}
              </p>
            </div>
          ) : filteredAdmins?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-background/60 rounded-2xl border border-border">
              <FaUserShield className="text-4xl text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground">
                {t("admin.noAdminsFound")}
              </p>
            </div>
          ) : (
            filteredAdmins?.map((admin) => {
              const status = getStatusBadge(admin.status);
              const StatusIcon = status.icon;

              return (
                <div
                  key={admin.id}
                  className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                        <FaUserShield className="text-primary text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {admin.fullName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${status.className}`}>
                          <StatusIcon className="text-xs" />
                          {status.text}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMobileMenuOpen(
                            mobileMenuOpen === admin.id ? null : admin.id,
                          )
                        }
                        className="p-2 hover:bg-muted rounded-xl transition">
                        <FaEllipsisV className="text-muted-foreground" />
                      </button>

                      {mobileMenuOpen === admin.id && (
                        <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-xl shadow-2xl z-10 min-w-[140px] overflow-hidden">
                          <button
                            onClick={() => {
                              toggleStatus(admin.id);
                              setMobileMenuOpen(null);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-muted transition flex items-center gap-2 text-sm">
                            {admin.status === 0 ? (
                              <>
                                <FaToggleOn className="text-emerald-500" />
                                {t("admin.suspend")}
                              </>
                            ) : (
                              <>
                                <FaToggleOff className="text-gray-400" />
                                {t("admin.activate")}
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(admin.id);
                              setMobileMenuOpen(null);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-red-500/10 transition flex items-center gap-2 text-sm text-red-500">
                            <FaTrash />
                            {t("admin.delete")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <FaEnvelope className="text-muted-foreground text-sm" />
                      <span className="text-muted-foreground">
                        {admin.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaPhone className="text-muted-foreground text-sm" />
                      <span className="text-muted-foreground">
                        {admin.phone}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Admin Modal */}
        <AddAdminModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={(data: addAdminData) => addAdmin(data)}
        />

        {/* Delete Modal */}
        <ConfirmDeleteModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={() => deleteId && deleteAdmin(deleteId)}
          name={selectedAdmin?.fullName}
        />
      </div>
    </div>
  );
}
