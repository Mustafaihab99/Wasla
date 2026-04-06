/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaLock,
  FaStar,
  FaPhone,
  FaTools,
  FaFileAlt,
} from "react-icons/fa";
import noData from "../../assets/images/nodata.webp";
import { useTranslation } from "react-i18next";
import useGetTechnicianProfile from "../../hooks/technican/useGetTechnicianProfile";
import useGetTechnicanSpecial from "../../hooks/technican/useGetTechnicanSpecial";
import ChangePasswordModal from "../common/ChangePasswordModal";
import GymProfileSkeleton from "../gym/GymProfileSkeleton";
import EditTechnicianProfileModal from "./Modal/TechnicianEditModal";

export default function TechnicianProfile() {
  const id = sessionStorage.getItem("user_id")!;
  const { data, isLoading } = useGetTechnicianProfile(id);
  const { data: specs } = useGetTechnicanSpecial();
  const { t } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  if (isLoading) return <GymProfileSkeleton />;

  if (!data) {
    return (
      <div className="flex justify-center mt-10">
        <img src={noData} className="w-64" />
      </div>
    );
  }

  const specializationName =
    specs?.find((s) => s.id === data.specialty)?.name || "—";

  return (
    <>
      <motion.h1
        className="text-4xl font-bold mt-10 mb-2 text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}>
        {t("tech.profile")}
      </motion.h1>

      <p className="text-muted-foreground mb-10">{t("tech.manageProfile")}</p>

      <motion.div
        className="max-w-6xl bg-background border border-border shadow-xl rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ direction: "ltr" }}>
        {/* Header */}
        <div className="h-32 bg-primary/10"></div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center -mt-20">
            <img
              src={data.profilePhotoUrl}
              className="w-40 h-40 rounded-xl object-cover border-4 border-background shadow-lg"
            />

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-primary">
                {data.fullName}
              </h2>

              <p className="text-muted-foreground mt-1 flex items-center gap-2 justify-center md:justify-start">
                <FaTools className="text-primary" />
                {specializationName}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-4 justify-center md:justify-start flex-wrap">
                <button
                  onClick={() => setOpenEdit(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
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
              title={t("tech.rating")}
              value={data.rate?.toFixed(1)}
            />
            <StatCard
              icon={<FaTools />}
              title={t("tech.experience")}
              value={`${data.experienceYears} ${t("tech.years")}`}
            />
            <StatCard
              icon={<FaFileAlt />}
              title={t("tech.documents")}
              value={data.documentsUrls.length}
            />
          </div>

          {/* Info */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <ProfileItem
              title={t("tech.description")}
              value={data.description}
            />

            <div>
              <span className="text-sm text-muted-foreground">
                {t("tech.phone")}
              </span>

              <div className="mt-2">
                <div className="flex items-center gap-2 font-semibold">
                  <FaPhone className="text-primary" />
                  {data.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          {data.documentsUrls.length > 0 && (
            <>
              <div className="border-t border-border my-8"></div>

              <h3 className="text-2xl font-bold mb-4">{t("tech.documents")}</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.documentsUrls.map((doc, i) => (
                  <a
                    key={i}
                    href={doc}
                    target="_blank"
                    className="p-4 border border-border rounded-lg flex items-center justify-center gap-2 hover:bg-primary/10 transition">
                    <FaFileAlt className="text-primary" />
                    {t("tech.view")}
                  </a>
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
        <EditTechnicianProfileModal
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          data={data}
        />
      </motion.div>
    </>
  );
}

function ProfileItem({ title, value }: any) {
  return (
    <div>
      <span className="text-sm text-muted-foreground">{title}</span>
      <p className="text-lg font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}

function StatCard({ icon, title, value }: any) {
  return (
    <div className="border border-border rounded-xl p-5 flex items-center gap-4 bg-muted/30 hover:shadow-md transition">
      <div className="text-primary text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
