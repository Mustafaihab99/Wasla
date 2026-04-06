import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import useGetTechnicianProfile from "../../hooks/technican/useGetTechnicianProfile";
import ReviewSection from "../../components/resident/ReviewSection";

export default function TechnicianViewDetails() {
  const { techniciansId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useGetTechnicianProfile(techniciansId!);

  if (isLoading) return <DoctorCardSkeleton />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8"
    style={{direction: "ltr"}}
    >
      {/* 🔥 HEADER CARD */}
      <div className="bg-background border rounded-3xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={profile?.profilePhotoUrl}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20"
          />

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full shadow text-sm flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {profile?.rate?.toFixed(1) || "0.0"}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold">
            {profile?.fullName}
          </h1>

          <p className="text-primary font-medium">
            🛠 {profile?.experienceYears} {t("resident.yearsExp")}
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-3">
            {/* Chat */}
            <button
              onClick={() => navigate(`/chat/${techniciansId}`)}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl shadow hover:bg-primary/90 transition">
              <FiMessageCircle />
              {t("chat.message")}
            </button>

            {/* Book */}
            <button className="flex items-center gap-2 px-5 py-2 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition">
            {t("tech.bookNow")}
            </button>
          </div>

          {/* CONTACT */}
          <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
            {profile?.phone && (
              <button
                onClick={() => window.open(`tel:${profile.phone}`)}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100">
                <FaPhoneAlt className="inline mr-1" />
                {profile.phone}
              </button>
            )}

            {profile?.email && (
              <button
                onClick={() => window.open(`mailto:${profile.email}`)}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100">
                <FaEnvelope className="inline mr-1" />
                {profile.email}
              </button>
            )}
          </div>
        </div>
      </div>

      {profile?.description && (
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold text-lg mb-2">{t("tech.about")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {profile.description}
          </p>
        </div>
      )}

      {profile!.documentsUrls.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-4">{t("tech.documents")}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile?.documentsUrls.map((doc) => (
              <div className="overflow-hidden rounded-xl group cursor-pointer">
                <img
                  src={doc}
                  className="w-full h-36 object-cover group-hover:scale-110 transition"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Reviews */}
      <ReviewSection
        doctorId={techniciansId!}
        currentUserId={sessionStorage.getItem("user_id")!}
      />
    </div>
  );
}
