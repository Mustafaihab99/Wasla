import { useTranslation } from "react-i18next";
import useGetPaymentHistory from "../../hooks/resident/useGetPaymentHistory";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import noData from "../../assets/images/nodata.webp";

export default function PaymentHistory() {
  const { t } = useTranslation();

  const userId = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetPaymentHistory(userId);

  const getStatus = (status: number) => {
    switch (status) {
      case 0:
        return { label: t("payment.pending"), color: "bg-yellow-100 text-yellow-700" };
      case 1:
        return { label: t("payment.completed"), color: "bg-green-100 text-green-700" };
      case 2:
        return { label: t("payment.failed"), color: "bg-red-100 text-red-700" };
      case 3:
        return { label: t("payment.refunded"), color: "bg-blue-100 text-blue-700" };
      default:
        return { label: "-", color: "" };
    }
  };

  const getMethod = (method: number) => {
    if (method === 1)
      return { label: t("payment.card"), icon: <FaCreditCard /> };
    if (method === 3)
      return { label: t("payment.cash"), icon: <FaMoneyBillWave /> };

    return { label: "-", icon: null };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold">{t("payment.title")}</h2>

      {/* LOADING */}
      {isLoading && (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"/>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && !data?.length && (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <img src={noData} className="w-40 opacity-80"/>
          <p className="text-gray-500 text-lg">{t("payment.noPayments")}</p>
        </div>
      )}

      {/* TABLE (DESKTOP) */}
      {!isLoading && data!.length > 0 && (
        <>
          <div className="hidden md:block bg-background border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-4 text-left">{t("payment.service")}</th>
                  <th className="p-4 text-left">{t("payment.amount")}</th>
                  <th className="p-4 text-left">{t("payment.date")}</th>
                  <th className="p-4 text-left">{t("payment.method")}</th>
                  <th className="p-4 text-left">{t("payment.status")}</th>
                </tr>
              </thead>

              <tbody>
                {data!.map((p, i) => {
                  const status = getStatus(p.status);
                  const method = getMethod(p.paymentMethod);

                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t hover:bg-muted/40 transition"
                    >
                      <td className="p-4 font-medium">{p.serviceProviderName}</td>

                      <td className="p-4 font-semibold text-primary">
                        {p.totalAmount} {t("doctor.EGP")}
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </td>

                      <td className="p-4 flex items-center gap-2">
                        {method.icon}
                        {method.label}
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS  */}
          <div className="md:hidden space-y-4">
            {data!.map((p, i) => {
              const status = getStatus(p.status);
              const method = getMethod(p.paymentMethod);

              return (
                <div key={i} className="border rounded-xl p-4 space-y-3 shadow-sm">

                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{p.serviceProviderName}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      {p.totalAmount} {t("doctor.EGP")}
                    </span>

                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      {method.icon}
                      {method.label}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}