import { useState } from "react";
import useGetDoctorProfile from "../../hooks/doctor/useDoctorProfile";
import ChangePasswordModal from "../common/ChangePasswordModal";
import EditDoctorProfileModal from "./modals/EditDoctorProfile";
import { FaEdit, FaLock, FaStar } from "react-icons/fa";
import DoctorProfileSkeleton from "./DoctorProfileSkeleton";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import noData from "../../assets/images/nodata.webp";

export default function DoctorProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetDoctorProfile(id);
  const { t } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  if (isLoading) return <DoctorProfileSkeleton />;
  if (!data)
    return (
      <div>
        <img src={noData} alt="nodata" />
      </div>
    );

  return (
    <>
      {/* Title  */}
      <motion.h1
        className="text-4xl font-bold mt-10 mb-2 text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}>
        {t("resident.YourProfile")}
      </motion.h1>

      <motion.p
        className="text-muted-foreground mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        {t("resident.manage")}
      </motion.p>

      {/* profile */}
      <motion.div
        className="max-w-5xl mt-10 bg-background border border-border shadow-xl rounded-xl p-8"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 70,
          damping: 15,
        }}>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <motion.img
            src={import.meta.env.VITE_USER_IMAGE + data.image}
            alt="Doctor"
            className="w-36 h-36 rounded-full object-cover border border-border shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          />
          <div className="flex-1">
            <motion.h2
              className="text-3xl font-bold text-primary"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}>
              {data.fullName}
            </motion.h2>

            <motion.p
              className="text-foreground mt-1 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}>
              {data.specializationName}
            </motion.p>

            <motion.div
              className="flex gap-3 mt-4 flex-col md:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}>
              <motion.button
                onClick={() => setOpenEdit(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/80 transition">
                <FaEdit /> {t("resident.edit")}
              </motion.button>

              <motion.button
                onClick={() => setOpenPass(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg shadow-sm hover:bg-primary/10 transition">
                <FaLock /> {t("resident.change")}
              </motion.button>
            </motion.div>
          </div>
        </div>

        <div className="my-6 border-t border-border"></div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08 },
            },
          }}>
          <ProfileItem title={t("login.Email")} value={data.email} />
          <ProfileItem title={t("profile.doctor.Phone")} value={data.phone} />
          <ProfileItem
            title={t("profile.doctor.University")}
            value={data.universityName}
          />
          <ProfileItem
            title={t("profile.doctor.hos")}
            value={data.hospitalname}
          />
          <ProfileItem
            title={t("profile.doctor.Graduation")}
            value={data.graduationYear}
          />
          <ProfileItem
            title={t("profile.doctor.Experience")}
            value={`${data.experienceYears} ${t("profile.doctor.Years")}`}
          />
          <div className="flex items-end">
          <ProfileItem
            title={t("resident.rating")}
            value={data.rating.toFixed(1)}
          />
          <FaStar className="text-yellow-300 mb-[5px]" />
          </div>
          <ProfileItem
            title={t("profile.doctor.Birthday")}
            value={data.birthDay?.split("T")[0]}
          />
          <ProfileItem
            title={t("profile.doctor.age")}
            value={new Date().getFullYear() - Number(data.birthDay.slice(0, 4))}
          />
          <ProfileItem
            title={t("resident.patients")}
            value={data.numberOfpatients}
          />
          <div className="md:col-span-2">
            <ProfileItem title={t("doctor.Bio")} value={data.description} />
          </div>
        </motion.div>

        {data.cv && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}>
            <a
              href={import.meta.env.VITE_DOCTOR_CV + data.cv}
              target="_blank"
              className="text-primary underline font-medium hover:opacity-80">
              {t("doctor.ViewCV")}
            </a>
          </motion.div>
        )}

        {/* Edit Modal */}
        {data && (
          <EditDoctorProfileModal
            isOpen={openEdit}
            onClose={() => setOpenEdit(false)}
            data={data}
          />
        )}

        {/* Change Password Modal */}
        { data &&
        <ChangePasswordModal
          isOpen={openPass}
          onClose={() => setOpenPass(false)}
          email={data.email}
        />
        }
      </motion.div>
    </>
  );
}

/* Reusable Profile Item with fade reveal */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProfileItem({ title, value }: { title: string; value: any }) {
  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}>
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-lg font-semibold">{value ?? "—"}</span>
    </motion.div>
  );
}
