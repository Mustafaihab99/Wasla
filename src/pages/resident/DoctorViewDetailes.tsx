import { useParams } from "react-router-dom";
import useGetDoctorProfile from "../../hooks/doctor/useDoctorProfile";
import useGetDoctorServices from "../../hooks/doctor/useGetDoctorService";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { FaStar, FaUserTie, FaUsers, FaClock, FaFilePdf } from "react-icons/fa";

export default function DoctorViewDetailes() {
  const { doctorId } = useParams();
  const { t } = useTranslation();

  const { data: profile, isLoading: loadingProfile } = useGetDoctorProfile(doctorId!);
  const { data: services, isLoading: loadingServices } = useGetDoctorServices(doctorId!);

  if (loadingProfile) return <DoctorCardSkeleton />;

  const daysOfWeek = [
    t("doctor.Sat"),
    t("doctor.Sun"),
    t("doctor.Mon"),
    t("doctor.Tue"),
    t("doctor.Wed"),
    t("doctor.Thu"),
    t("doctor.Fri"),
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center rounded-3xl p-6 md:p-8 gap-6">
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-primary/20">
          <img
            src={import.meta.env.VITE_USER_IMAGE + profile?.image}
            alt={profile?.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start">
          <h1 className="text-lg md:text-5xl font-extrabold text-foregrund">{profile?.fullName}</h1>
          <p className="text-primary text-xl md:text-2xl mt-1 font-semibold">
            {profile?.specializationName}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { icon: FaStar, value: "0", label: t("resident.rating"), color: "yellow-400" },
          { icon: FaUserTie, value: profile?.experienceYears, label: t("resident.yearsExp"), color: "primary" },
          { icon: FaUsers, value: 0, label: t("resident.patients"), color: "green-400" },
          { icon: FaStar, value: 0, label: t("resident.reviews"), color: "blue-400" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center p-4 rounded-2xl border hover:scale-105 transition"
            >
              <div className="p-3 rounded-full">
                <Icon className={`text-${stat.color} text-3xl`} />
              </div>

              <span className="font-bold text-xl mt-2">{stat.value}</span>
              <span className="text-dried text-sm">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Bio */}
      {profile?.description && (
        <div className="p-6 rounded-2xl border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("doctor.Bio")}</h2>

            {/* CV Button */}
            {profile?.cv && (
              <a
                href={import.meta.env.VITE_DOCTOR_CV + profile.cv}
                target="_blank"
                className="flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                <FaFilePdf className="text-red-500" /> {t("doctor.ViewCV")}
              </a>
            )}
          </div>

          <p className="text-dried text-lg leading-relaxed">{profile.description}</p>
        </div>
      )}

      {/* Services */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t("nav.service")}</h2>

        {loadingServices ? (
          <DoctorCardSkeleton />
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                className="flex flex-col justify-between rounded-2xl border p-6 hover:scale-[1.03] transition-transform"
              >
                <div>
                  <h3 className="text-2xl font-bold">{i18next.language === "ar" ? service.serviceNameArabic : service.serviceNameEnglish}</h3>
                  <p className="text-dried mt-2 text-sm">
                    {i18next.language === "ar" ? service.descriptionArabic : service.descriptionEnglish}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-dried">
                    
                    {/* Days */}
                    {service.serviceDays.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {service.serviceDays
                          .sort((a,b)=>a.dayOfWeek - b.dayOfWeek)
                          .map(d => (
                            <span key={d.id} className="px-3 py-1 border border-primary text-primary rounded-full text-xs">
                              {daysOfWeek[d.dayOfWeek]}
                            </span>
                        ))}
                      </div>
                    )}

                    {/* Dates */}
                    {service.serviceDates.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {service.serviceDates.map(d => (
                          <span key={d.id} className="px-3 py-1 border rounded-full text-xs">
                            {new Date(d.date).toLocaleDateString()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Time Slots */}
                    {service.timeSlots.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center">
                        <FaClock className="text-gray-400" />
                        {service.timeSlots.map(t => (
                          <span key={t.id} className="px-2 py-1 border rounded-full text-xs">
                            {`${t.start} - ${t.end}`}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-2 font-semibold text-primary">
                      {t("resident.price")}: ${service.price}
                    </p>
                  </div>
                </div>

                <button
                  className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
                  onClick={() => console.log("Book service", service.id)}
                >
                  {t("resident.bookNow")}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t("resident.noServices")}</p>
        )}
      </div>
    </div>
  );
}
