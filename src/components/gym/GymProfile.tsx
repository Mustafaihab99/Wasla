import { useState } from "react";
import useGetGymProfile from "../../hooks/gym/useGetGymProfile";
import ChangePasswordModal from "../common/ChangePasswordModal";
import { FaEdit, FaLock, FaStar, FaPhone, FaImages } from "react-icons/fa";
import { motion } from "framer-motion";
import noData from "../../assets/images/nodata.webp";
import { useTranslation } from "react-i18next";
import GymProfileSkeleton from "./GymProfileSkeleton";
import EditGymProfileModal from "./Modal/UpdateGymModal";

export default function GymProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetGymProfile(id);
  const { t } = useTranslation();

  const [openPass, setOpenPass] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  if (isLoading) return <GymProfileSkeleton />;

  if (!data) {
    return (
      <div className="flex justify-center mt-10">
        {" "}
        <img src={noData} alt="nodata" className="w-64" />{" "}
      </div>
    );
  }

  return (
    <>
      <motion.h1
        className="text-4xl font-bold mt-10 mb-2 text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}>
        {t("gym.gymprofile")}
      </motion.h1>
      <p className="text-muted-foreground mb-10">{t("gym.manage")}</p>
      <motion.div
        className="max-w-6xl bg-background border border-border shadow-xl rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}>
        <div className="h-32 bg-primary/10"></div>
        <div className="p-8">
          {/* Header */}
          <div
            className="flex flex-col md:flex-row gap-8 items-center -mt-20"
            style={{ direction: "ltr" }}>
            <img
              src={import.meta.env.VITE_GYM_IMAGE + data.profilePhoto}
              className="w-40 h-40 rounded-xl object-cover border-4 border-background shadow-lg"
            />

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-primary">
                {data.businessName}
              </h2>

              <p className="text-muted-foreground mt-1">
                {t("gym.owner")}: {data.ownerName}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-4 justify-center md:justify-start flex-wrap">
                <button
                  onClick={() => setOpenEdit(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80">
                  <FaEdit /> {t("gym.edit")}
                </button>

                <button
                  onClick={() => setOpenPass(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
                  <FaLock /> {t("gym.changePassword")}
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <StatCard
              icon={<FaStar />}
              title={t("gym.rating")}
              value={data.rating?.toFixed(1)}
            />
            <StatCard
              icon={<FaImages />}
              title={t("gym.photos")}
              value={data.photos.length}
            />
            <StatCard
              icon={<FaPhone />}
              title={t("gym.contacts")}
              value={data.phones.length}
            />
          </div>

          {/* Description + Phones */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <ProfileItem
              title={t("gym.description")}
              value={data.description}
            />

            <div>
              <span className="text-sm text-muted-foreground">
                {t("gym.phones")}
              </span>

              <div className="mt-2 space-y-2">
                {data.phones.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 font-semibold">
                    <FaPhone className="text-primary" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {data.photos.length > 0 && (
            <>
              <div className="border-t border-border my-8"></div>

              <h3 className="text-2xl font-bold mb-4">{t("gym.gallery")}</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.photos.map((photo, index) => (
                  <motion.img
                    key={index}
                    src={import.meta.env.VITE_GYM_IMAGE + photo}
                    className="w-full h-36 object-cover rounded-lg shadow hover:scale-105 transition"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <ChangePasswordModal
          isOpen={openPass}
          onClose={() => setOpenPass(false)}
          email={data.email}
        />
        <EditGymProfileModal
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          data={{
            businessName: data.businessName,
            ownerName: data.ownerName,
            description: data.description,
            gmail: data.email,
            phones: data.phones,
          }}
        />
      </motion.div>
    </>
  );
}

function ProfileItem({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <span className="text-sm text-muted-foreground">{title}</span>
      <p className="text-lg font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="border border-border rounded-lg p-4 flex items-center gap-3 bg-muted/30">
      <div className="text-primary text-xl">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
