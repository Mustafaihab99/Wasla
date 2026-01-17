import { useState } from "react";
import useGetResidentProfile from "../../hooks/resident/useGetResidentProfile";
import EditProfileModal from "../common/EditProfileModal";
import ChangePasswordModal from "../common/ChangePasswordModal";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt, FaEdit, FaLock, FaCalendarAlt, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ResidentCharts from "./ResidentCharts";
import useLogout from "../../hooks/auth/useLogout";

export default function ResidentProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetResidentProfile(id);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-background/90 to-background/80 pb-20 px-4 space-y-12">

      {/* ===== Profile Header ===== */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="w-full max-w-6xl mx-auto py-8 flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
>
  {/* Profile Image */}
  {isLoading ? (
    <div className="w-36 h-36 rounded-full bg-white/30 animate-pulse" />
  ) : (
    <motion.img
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      src={import.meta.env.VITE_USER_IMAGE + data?.imageUrl}
      className="w-36 h-36 rounded-full border-4 border-primary shadow-xl object-cover"
    />
  )}

  {/* Info & Actions */}
  <div className="flex-1 flex flex-col justify-center md:justify-start text-center md:text-left space-y-4">
    {/* Name & Contact */}
    <div className="space-y-1">
      <h2 className="text-4xl font-bold text-primary">{data?.fullname}</h2>
      <p className="text-dried font-medium">{data?.email}</p>
      <p className="text-dried font-medium">{data?.phoneNumber}</p>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start gap-4 mt-4 flex-wrap">
      <button
        onClick={() => setOpenEdit(true)}
        className="flex items-center gap-2 px-9 md:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:-translate-y-1"
      >
        <FaEdit /> {t("resident.edit")}
      </button>

      <button
        onClick={() => setOpenPass(true)}
        className="flex items-center gap-2 px-3 md:px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white  font-semibold rounded-xl shadow-lg transition transform hover:-translate-y-1"
      >
        <FaLock /> {t("resident.change")}
      </button>

      <button
        onClick={handleLogout}
        disabled={isPending}
        className="flex items-center gap-2 px-11 md:px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg transition transform hover:-translate-y-1 text-lg"
      >
        <FaSignOutAlt /> {isPending ? t("nav.logged...") : t("nav.Logout")}
      </button>
    </div>
  </div>
</motion.div>

     <ResidentCharts residentId={id} />

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl shadow-lg cursor-pointer flex items-center justify-between"
          onClick={()=>navigate("my-bookings")}
        >
          <span className="font-semibold text-lg text-primary">{t("resident.myBooking")}</span>
          <FaCalendarAlt className="text-primary text-3xl" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-white/20 rounded-2xl shadow-lg cursor-pointer flex items-center justify-between"
          onClick={()=>navigate("my-favorites")}
        >
          <span className="font-semibold text-lg text-red-500">{t("resident.myFavorites")}</span>
          <FaHeart className="text-red-500 text-3xl" />
        </motion.div>

      </div>

      {/* Modals  */}
      {data && <EditProfileModal isOpen={openEdit} onClose={()=>setOpenEdit(false)} fullname={data.fullname} phoneNumber={data.phoneNumber} userId={id}/> }
      {data && <ChangePasswordModal isOpen={openPass} onClose={()=>setOpenPass(false)} email={data!.email} />}
    </div>
  );
}
