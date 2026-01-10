import { useParams } from "react-router-dom";
import useGetDoctorProfile from "../../hooks/doctor/useDoctorProfile";
import useGetDoctorServices from "../../hooks/doctor/useGetDoctorService";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {
  FaStar,
  FaUserTie,
  FaUsers,
  FaFilePdf,
  FaPhoneAlt,
  FaUniversity,
  FaHospital,
  FaCalendarAlt,
} from "react-icons/fa";
import noData from "../../assets/images/nodata.webp";
import BookServiceModal from "../../components/resident/modal/BookServiceModal";
import { useState } from "react";
import ReviewSection from "../../components/resident/ReviewSection";

export default function DoctorViewDetailes() {
  const { doctorId } = useParams();
  const userId = sessionStorage.getItem("user_id");
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<null | {
    serviceId: number;
    serviceProviderId: string;
    price: number;
    serviceDays: {
      dayOfWeek: number;
      timeSlots: {
        id: number;
        start: string;
        end: string;
        isBooking: boolean;
      }[];
    }[];
  }>(null);

  const { data: profile, isLoading: loadingProfile } = useGetDoctorProfile(
    doctorId!
  );
  const { data: services, isLoading: loadingServices } = useGetDoctorServices(
    doctorId!
  );

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
      <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-3xl border shadow-sm">
        {/* Profile Image */}
        <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-primary/30 shadow-md">
          <img
            src={import.meta.env.VITE_USER_IMAGE + profile?.image}
            alt={profile?.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <h1 className="text-xl md:text-4xl font-extrabold text-foreground">
            {profile?.fullName}
          </h1>

          <p className="text-primary text-xl font-semibold">
            {profile?.specializationName}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 text-dried text-sm space-y-1">
            <p className="flex gap-2 items-center">
              <span>
                <FaPhoneAlt className="text-red-700 inline" />
              </span>
              {profile?.phone}
            </p>
            <p className="flex gap-2 items-center">
              <span>
                <FaUniversity className="text-blue-400 inline" />
              </span>
              {profile?.universityName}
            </p>
            <p className="flex gap-2 items-center">
              <span>
                <FaHospital className="text-pink-400 inline" />
              </span>
              {profile?.hospitalname}
            </p>
            <p className="flex gap-2 items-center">
              <span>
                <FaCalendarAlt className="text-amber-500" />
              </span>
              {t("profile.doctor.Graduation")} {profile?.graduationYear}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
        {[
          {
            icon: FaStar,
            value: profile?.rating.toFixed(1),
            label: t("resident.rating"),
            color: "text-yellow-400",
          },
          {
            icon: FaUserTie,
            value: profile?.experienceYears,
            label: t("resident.yearsExp"),
            color: "text-primary",
          },
          {
            icon: FaUsers,
            value: profile?.numberOfpatients,
            label: t("resident.patients"),
            color: "text-green-400",
          },
          // {
          //   icon: FaStar,
          //   value: 0,
          //   label: t("resident.reviews"),
          //   color: "text-blue-400",
          // },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center p-4 rounded-2xl border hover:scale-105 transition">
              <div className="p-3 rounded-full">
                <Icon className={`${stat.color} text-3xl`} />
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
          <div className="flex flex-col gap-3 md:flex-row md:gap-0 items-center justify-between">
            <h2 className="text-2xl font-bold">{t("doctor.Bio")}</h2>

            {/* CV Button */}
            {profile?.cv && (
              <a
                href={import.meta.env.VITE_DOCTOR_CV + profile.cv}
                target="_blank"
                className="flex items-center gap-2 text-primary font-semibold hover:underline">
                <FaFilePdf className="text-red-500" /> {t("doctor.ViewCV")}
              </a>
            )}
          </div>

          <p className="text-dried text-lg leading-relaxed">
            {profile.description}
          </p>
        </div>
      )}

      {/* Services */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t("nav.service")}</h2>

        {loadingServices ? (
          <DoctorCardSkeleton />
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services?.map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-2xl border shadow-sm hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-foreground">
                  {i18next.language === "ar"
                    ? service.serviceNameArabic
                    : service.serviceNameEnglish}
                </h3>

                <p className="text-dried mt-2">
                  {i18next.language === "ar"
                    ? service.descriptionArabic
                    : service.descriptionEnglish}
                </p>

                {/* Days*/}
                <div className="flex flex-wrap gap-2 items-center mt-3">
                  {service.serviceDays?.map((day) => (
                    <div
                      key={day.dayOfWeek}
                      className="flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/30 text-primary rounded-full text-xs font-semibold shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                      {/* Icon Circle */}
                      <span className="w-2 h-2 bg-primary rounded-full"></span>

                      {/* Day Name */}
                      {daysOfWeek[day.dayOfWeek]}
                    </div>
                  ))}
                </div>

                <p className="text-primary font-bold mt-3">
                  {service.price} {t("doctor.EGP")}
                </p>

                <button
                  className="mt-4 w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90"
                  onClick={() =>
                    setSelectedService({
                      serviceId: service.id,
                      serviceProviderId: doctorId!,
                      price: service.price,
                      serviceDays: service.serviceDays.map((d) => ({
                        dayOfWeek: d.dayOfWeek,
                        timeSlots: d.timeSlots || [],
                      })),
                    })
                  }>
                  {t("resident.bookNow")}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-10">
            <img src={noData} alt="no data found" className="opacity-80" />
          </div>
        )}
      </div>
      {/* reviews */}
      <ReviewSection
        doctorId={doctorId!}
        currentUserId={userId!}
        />
      {selectedService && (
        <BookServiceModal
          serviceId={selectedService.serviceId}
          serviceProviderId={selectedService.serviceProviderId}
          price={selectedService.price}
          availableDays={selectedService.serviceDays.map((day) => ({
            dayOfWeek: day.dayOfWeek,
            timeSlots: day.timeSlots || [],
          }))}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
