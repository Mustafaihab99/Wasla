/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import useGetUserDetails from "../../hooks/admin/useAdminViewDetails";
import {
  FaUser,
  FaIdCard,
  FaFileAlt,
  FaArrowLeft,
  FaSpinner,
  FaBuilding,
  FaCar,
  FaTools,
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

  const { userBase, role, details }: any = data.data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
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
                  loading="lazy"
                    src={userBase.profilePhoto}
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition"
          >
            <FaArrowLeft />
            {t("admin.Back")}
          </button>
        </div>
      </motion.div>

      {/* BASIC INFO */}
        {
          role !== "gym" &&
      <div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">
          {t("admin.basicInfo")}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InfoRow label="Phone" value={userBase.phone} />
          {
            role !== "restaurant" &&
          <InfoRow label="Birthday" value={userBase.birthDay} />
          }
        </div>
      </div>
        }

      {/* RESIDENT */}
      {role === "resident" && (
        <Section title={t("admin.resDet")} icon={<FaIdCard />}>
          <InfoRow label="National ID" value={details.nationalId} />
        </Section>
      )}

      {/* DOCTOR */}
      {role === "doctor" && (
        <Section title={t("admin.docDet")} icon={<FaUser />}>
          <Grid>
            <InfoRow label="Experience" value={`${details.experienceYears} years`} />
            <InfoRow label="University" value={details.universityName} />
            <InfoRow label="Hospital" value={details.hospitalName} />
          </Grid>

          <Description text={details.description} />

          {details.cv && (
            <a
              href={details.cv}
              target="_blank"
              className="btn-primary-outline"
            >
              <FaFileAlt /> View CV
            </a>
          )}
        </Section>
      )}

      {/* DRIVER  */}
      {role === "driver" && (
        <Section title="Driver Details" icon={<FaCar />}>
          <Grid>
            <InfoRow label="Name" value={details.name} />
            <InfoRow label="Email" value={details.email} />
            <InfoRow label="Experience" value={`${details.drivingExperienceYears} years`} />
            <InfoRow label="Trips" value={details.tripsCount} />
            <InfoRow label="Vehicle Model" value={details.vehicleModel} />
            <InfoRow label="Vehicle Number" value={details.vehicleNumber} />
          </Grid>

          <ImageGrid images={details.carImages} />
        </Section>
      )}

      {/* RESTAURANT */}
      {role === "restaurant" && (
        <Section title="Restaurant Details" icon={<FaBuilding />}>
          <Grid>
            <InfoRow label="Name" value={details.businessName} />
            <InfoRow label="Email" value={details.email} />
          </Grid>

          <Description text={details.description} />
          <ImageGrid images={details.images} />
        </Section>
      )}

      {/* TECHNICIAN */}
      {role === "technician" && (
        <Section title="Technician Details" icon={<FaTools />}>
          <Grid>
            <InfoRow label="Experience" value={`${details.experienceYears} years`} />
            <InfoRow label="Rate" value={details.rate} />
            <InfoRow label="Available" value={details.isAvailable ? "Yes" : "No"} />
          </Grid>

          <Description text={details.description} />
        </Section>
      )}

      {/* GYM */}
      {role === "gym" && (
        <Section title={t("admin.gymDetails")} icon={<FaBuilding />}>
          <Grid>
            <InfoRow label="Business Name" value={details.businessName} />
            <InfoRow label="Email" value={details.email} />
          </Grid>
          <Description text={details.description} />
          <ImageGrid images={details.images} />
        </Section>
      )}
    </div>
  );
}

/* ================= Components ================= */

function Section({ title, icon, children }: any) {
  return (
    <motion.div className="bg-card border rounded-xl p-6 space-y-5">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
        {icon} {title}
      </h3>
      {children}
    </motion.div>
  );
}

function Grid({ children }: any) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

function Description({ text }: { text: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">Description</p>
      <p className="bg-muted/30 p-4 rounded-lg">{text || "—"}</p>
    </div>
  );
}

function ImageGrid({ images = [] }: { images: string[] }) {
  if (!images?.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {images.map((img, i) => (
        <img
          key={i}
          loading="lazy"
          src={img}
          className="h-28 w-full object-cover rounded-lg border"
        />
      ))}
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}