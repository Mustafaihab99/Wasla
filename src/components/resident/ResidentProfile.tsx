import { useState } from "react";
import useGetResidentProfile from "../../hooks/resident/useGetResidentProfile";
import useShowMyBooking from "../../hooks/resident/useShowMyBooking";
import EditProfileModal from "../common/EditProfileModal";
import ChangePasswordModal from "../common/ChangePasswordModal";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt, FaEdit, FaLock, FaCalendarAlt, FaMoneyBill, FaClock } from "react-icons/fa";
import DoctorCardSkeleton from "./DoctorCardSkelton";
import noData from "../../assets/images/nodata.webp";

export default function ResidentProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetResidentProfile(id);
  const { data: bookings, isLoading: loadBookings } = useShowMyBooking(id);

  const { t } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  const dayNames = [
    t("doctor.Sat"),t("doctor.Sun"),t("doctor.Mon"),
    t("doctor.Tue"),t("doctor.Wed"),t("doctor.Thu"),t("doctor.Fri")
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <div className="min-h-screen w-full bg-background pb-20 px-4 text-foreground">

      {/* Header */}
      <motion.div
        initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}
        className="w-full max-w-6xl mx-auto py-6 flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">{t("resident.YourProfile")}</h1>

        <div className="flex gap-4">
          <button onClick={() => setOpenEdit(true)} className="flex items-center text-white gap-2 py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold">
            <FaEdit /> {t("resident.edit")}
          </button>
          <button onClick={handleLogout} className="flex items-center text-white gap-2 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 font-semibold">
            <FaSignOutAlt /> {t("nav.Logout")}
          </button>
        </div>
      </motion.div>

      {/* ProfileCard*/}
      <motion.div 
        initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}}
        className="mx-auto w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl text-center"
      >
        {isLoading ? (
          <div className="w-36 h-36 rounded-full mx-auto bg-white/30 animate-pulse" />
        ) : (
          <motion.img
            initial={{opacity:0,scale:0.7}} animate={{opacity:1,scale:1}}
            src={import.meta.env.VITE_USER_IMAGE + data?.imageUrl}
            className="w-36 h-36 mx-auto rounded-full border-4 border-primary shadow-xl"
          />
        )}

        <h2 className="text-3xl mt-5 font-bold">{data?.fullname}</h2>
        <p className="text-dried">{data?.email}</p>
        <p className="text-dried">{data?.phoneNumber}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => setOpenPass(true)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 font-semibold rounded-md">
            <FaLock /> {t("resident.change")}
          </button>
        </div>
      </motion.div>

      {/* BOOKINGS  */}
      <motion.h2 
        initial={{opacity:0}} animate={{opacity:1}} 
        className="text-3xl font-bold text-center mt-16 mb-5"
      >
        <FaCalendarAlt className="inline text-blue-400"/> {t("resident.myBooking")}
      </motion.h2>

      {loadBookings ? (
        <DoctorCardSkeleton />
      ) : bookings?.length ? (
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
          {bookings.map(b => (
            <motion.div 
              key={b.id}
              whileHover={{scale:1.05, y:-4}}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={import.meta.env.VITE_USER_IMAGE + b.serviceProviderProfilePhoto}
                  className="w-16 h-16 rounded-full border object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">{b.serviceProviderName}</h3>
                  <p className="text-primary">{b.serviceName}</p>
                </div>
              </div>

              <p className="mt-3"><FaCalendarAlt className="inline mr-2 m-2"/>{dayNames[Number(b.day)]} - {b.date}</p>
              <p><FaClock className="inline mr-2 m-2"/>{b.start.slice(0,5)} {t("doctor.to")} {b.end.slice(0,5)}</p>
              <p className="mt-2 font-semibold text-green-400"><FaMoneyBill className="inline mr-2 m-2"/>{b.price} {t("doctor.EGP")}</p>
            </motion.div>
          ))}
        </div>
      ) : (
          <div className="flex justify-center mt-10">
          <img src={noData} alt="no data found" className="opacity-80" />
        </div>
      )}

      {/* 🟢 Modals */}
      {data && <EditProfileModal isOpen={openEdit} onClose={()=>setOpenEdit(false)} fullname={data.fullname} phoneNumber={data.phoneNumber} userId={id}/> }
      <ChangePasswordModal isOpen={openPass} onClose={()=>setOpenPass(false)}/>
    </div>
  );
}
