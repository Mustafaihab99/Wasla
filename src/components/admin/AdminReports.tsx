import useAdminReports from "../../hooks/admin/useGetAdminReports";
import { ReportsData } from "../../types/admin/adminTypes";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";

export default function AdminReports() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useAdminReports();

  if (isLoading) {
    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
        <motion.div
            className="mt-8 w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"
        />
        </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        {t("admin.somethingWrong")}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">
          {t("admin.reports")}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t("admin.reportsDesc")}
        </p>
      </div>

      {data?.length === 0 ? (
        <div className="bg-background border border-border rounded-xl py-12 text-center text-muted-foreground">
          {t("admin.noReports")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((report: ReportsData, index: number) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaUser />
                </div>
                <div>
                  <p className="font-semibold">
                    {report.fullName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MdEmail />
                    {report.email}
                  </div>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {report.message}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
