import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import useGetUserDetails from "../../hooks/admin/useAdminViewDetails";
import {
  FaUser,
  FaPhone,
  FaBirthdayCake,
  FaIdCard,
  FaFileAlt,
  FaArrowLeft,
  FaSpinner,
  FaEnvelope,
  FaBuilding,
  FaImages,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function AdminViewDetails() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useGetUserDetails(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center p-10 text-red-500">
        Failed to load user details
      </div>
    );
  }

  const { userBase, role, details } = data.data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ================= Header ================= */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-2xl border border-primary/20"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-lg">
                {userBase.profilePhoto ? (
                  <img
                    src={
                      role === "Gym" ?
                      import.meta.env.VITE_GYM_IMAGE + userBase.profilePhoto
                      :
                      import.meta.env.VITE_USER_IMAGE + userBase.profilePhoto
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl">
                    <FaUser />
                  </div>
                )}
              </div>

              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow">
                {role.toUpperCase()}
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {t("admin.userdet")}
              </h1>
              <p className="text-muted-foreground mt-1">
                ID: {userId?.slice(0, 8)}...
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition"
          >
            <FaArrowLeft />
            {t("admin.Back")}
          </button>
        </div>
      </motion.div>

      {/* ================= Basic Info ================= */}
      {
        role === "Gym" ? <></>
        :
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">
          {t("admin.basicInfo")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow
            label={t("profile.doctor.Phone")}
            value={
              <span className="flex items-center gap-2">
                <FaPhone className="text-primary" />
                {userBase.phone}
              </span>
            }
          />
          <InfoRow
            label={t("profile.doctor.Birthday")}
            value={
              <span className="flex items-center gap-2">
                <FaBirthdayCake className="text-primary" />
                {userBase.birthDay}
              </span>
            }
          />
        </div>
      </div>
    }

      {/* ================= Resident Details ================= */}
      {role === "resident" && (
        <motion.div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaIdCard className="text-primary" />
            {t("admin.resDet")}
          </h3>

          <InfoRow
            label={t("profile.resident.national")}
            value={details.nationalId}
          />
        </motion.div>
      )}

      {/* ================= Doctor Details ================= */}
      {role === "doctor" && (
        <motion.div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaUser className="text-primary" />
            {t("admin.docDet")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              label={t("profile.doctor.Experience")}
              value={`${details.experienceYears} years`}
            />
            <InfoRow
              label={t("profile.doctor.Graduation")}
              value={details.graduationYear}
            />
            <InfoRow
              label={t("profile.doctor.University")}
              value={details.universityName}
            />
            <InfoRow
              label={t("profile.doctor.hos")}
              value={details.hospitalName}
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {t("profile.doctor.Description")}
            </p>
            <p className="text-foreground bg-muted/30 p-4 rounded-lg">
              {details.description || "—"}
            </p>
          </div>

          {details.cv && (
            <a
              href={import.meta.env.VITE_DOCTOR_CV + details.cv}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
            >
              <FaFileAlt />
              {t("doctor.ViewCV")}
            </a>
          )}
        </motion.div>
      )}

      {/* ================= Gym Details ================= */}
      {role === "Gym" && (
        <motion.div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaBuilding className="text-primary" />
            {t("admin.gymDetails")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              label={t("profile.gym.businessName")}
              value={
                <span className="flex items-center gap-2">
                  <FaBuilding className="text-primary" />
                  {details.businessName}
                </span>
              }
            />

            <InfoRow
              label={t("login.Email")}
              value={
                <span className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  {details.email}
                </span>
              }
            />
          </div>

          {/* Phones */}
          {details.phones?.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t("gym.phones")}
              </p>
              <div className="flex flex-wrap gap-2">
                {details.phones.map((phone: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-muted text-sm"
                  >
                    {phone}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {t("gym.description")}
            </p>
            <p className="bg-muted/30 p-4 rounded-lg">
              {details.description || "—"}
            </p>
          </div>

          {/* Images */}
          {details.images?.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <FaImages className="text-primary" />
                {t("gym.gallery")}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {details.images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={import.meta.env.VITE_GYM_IMAGE + img}
                    className="h-28 w-full object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ================= Helpers ================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}
