import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import noData from "../../assets/images/nodata.webp";
import useGetGymProfile from "../../hooks/gym/useGetGymProfile";
import useGetGymService from "../../hooks/gym/useGetGymService";
import useBookGymService from "../../hooks/gym/useBookGymService";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import ReviewSection from "../../components/resident/ReviewSection";
import i18next from "i18next";
import { gymServiceData } from "../../types/gym/gym-types";
import useCreatePayment from "../../hooks/resident/payment/useCreatePayment";
import { FiMessageCircle } from "react-icons/fi";
import { toast } from "sonner";

export default function GymViewDetails() {
  const { gymId } = useParams();
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<null | gymServiceData>(
    null,
  );
  const navigate = useNavigate();
  const residentId = sessionStorage.getItem("user_id") || "";
  const [paymentMethod, setPaymentMethod] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { mutate: createPaymentMutation } = useCreatePayment();
  const { data: profile, isLoading: loadingProfile } = useGetGymProfile(gymId!);
  const { data: services, isLoading: loadingServices } = useGetGymService(
    gymId!,
  );
  const { mutate: bookGym, isPending } = useBookGymService(
    gymId!,
    selectedService?.id || 0,
    residentId,
    paymentMethod === 1
  );

  if (loadingProfile) return <DoctorCardSkeleton />;

  const isArabic = i18next.language === "ar";

const handleBook = (service: gymServiceData) => {
  setSelectedService(service);
  setPaymentMethod(null); // reset
  setShowPaymentModal(true);
};

  const handleContinuePayment = (
    service?: gymServiceData,
    bookingIdParam?: number,
  ) => {
    const serviceData = service || selectedService;
    const bookingIdData = bookingIdParam;
    if (!serviceData || !bookingIdData) return;

    createPaymentMutation(
      {
        userId: residentId,
        serviceProviderId: gymId!,
        amount: serviceData.newPrice || serviceData.price,
        paymentMethod: 1,
        entityType: 0,
        entityId: bookingIdData,
        serviceType: 4,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (paymentRes: any) => {
          window.location.href = paymentRes.data;
        },
      },
    );
  };

  const confirmBooking = () => {
  if (!selectedService || !paymentMethod) return;

  bookGym(undefined, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (res: any) => {
      const bookingId = res.data.bookingId;

      if (paymentMethod === 1) {
        // CARD
        handleContinuePayment(selectedService, bookingId);
      } else {
        // CASH
        setShowPaymentModal(false);
        toast.success("Booking confirmed ✅");
      }
    },
  });
};

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Gym Header */}
      <div
        className="flex flex-col md:flex-row items-center gap-8
        p-6 rounded-3xl border border-border
        shadow-sm bg-background
        hover:shadow-md transition"
        style={{ direction: "ltr" }}>
        {/* Profile Image */}
        <div className="relative">
          <div className="w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary/30 shadow-md">
            <img
              src={profile?.profilePhoto}
              loading="lazy"
              alt={profile?.businessName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rating badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border border-border px-3 py-1 rounded-full shadow-sm flex items-center gap-1 text-sm font-semibold">
            <FaStar className="text-yellow-400" />
            {profile?.rating?.toFixed(1) || "0.0"}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 w-full text-center md:text-left space-y-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground">
              {profile?.businessName}
            </h1>
            <p className="text-primary text-lg font-semibold">
              {profile?.ownerName}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.reviewsCount} {t("resident.reviews")}
            </p>
            <button
              onClick={() => navigate(`/chat/${profile?.id}`)}
              className="flex items-center mt-2 gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-sm">
              <FiMessageCircle size={18} />
              <span className="text-sm font-medium">{t("chat.message")}</span>
            </button>
          </div>

          {/* Contact Section */}
          <div className="pt-2 space-y-3">
            {profile?.phones && profile.phones.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {profile.phones.map((ph, index) => (
                  <button
                    key={index}
                    onClick={() => window.open(`tel:${ph}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/40 text-sm font-medium hover:bg-primary hover:text-white transition">
                    <FaPhoneAlt className="text-xs" />
                    {ph}
                  </button>
                ))}
              </div>
            )}

            {profile?.email && (
              <div className="flex justify-center md:justify-start">
                <button
                  onClick={() => window.open(`mailto:${profile.email}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/40 text-sm font-medium hover:bg-primary hover:text-white transition">
                  <FaEnvelope className="text-xs" />
                  {profile.email}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gym Description */}
      {profile?.description && (
        <div className="p-6 rounded-2xl border shadow-sm bg-background">
          <h2 className="text-2xl font-bold mb-2">{t("gym.aboutGym")}</h2>
          <p className="text-muted-foreground">{profile.description}</p>
        </div>
      )}

      {/* Gym Gallery */}
      {profile?.photos && profile.photos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("gym.Gallery")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.photos.map((photo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-2xl border border-border shadow-sm bg-background">
                <img
                  src={photo}
                  loading="lazy"
                  alt={`gym-photo-${idx}`}
                  className="w-full h-36 object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t("nav.service")}</h2>
        {loadingServices ? (
          <DoctorCardSkeleton />
        ) : services && services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const hasOffer =
                service.type === 2 &&
                service.newPrice &&
                service.newPrice < service.price;
              const savedAmount = hasOffer
                ? service.price - service.newPrice
                : 0;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background to-muted/40 shadow-md hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={import.meta.env.VITE_GYM_IMAGE + service.photoUrl}
                      alt={
                        isArabic ? service.name.arabic : service.name.english
                      }
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute top-3 left-3">
                      {hasOffer ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white shadow flex items-center gap-1">
                          🔥 {service.precentage}% OFF
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white shadow">
                          {t("gym.Package")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                      {isArabic ? service.name.arabic : service.name.english}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {isArabic
                        ? service.description.arabic
                        : service.description.english}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        {hasOffer ? (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">
                                {service.newPrice} {t("doctor.EGP")}
                              </span>
                              <span className="text-sm line-through text-muted-foreground">
                                {service.price}
                              </span>
                            </div>
                            <span className="text-[11px] text-green-600 font-medium">
                              {t("gym.Save")} {savedAmount} {t("doctor.EGP")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {service.price} {t("doctor.EGP")}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {service.durationInMonths} {t("gym.mo")}
                      </span>
                    </div>

                    <button
                      disabled={isPending}
                      className="mt-auto w-full py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
                      onClick={() => handleBook(service)}>
                      {isPending ? t("gym.loading") : t("resident.bookNow")}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center mt-10 col-span-full">
            <img
              src={noData}
              loading="lazy"
              alt="no data found"
              className="w-72 opacity-80"
            />
          </div>
        )}
      </div>
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        style={{marginTop:"0"}}
        >
          <div className="bg-background p-6 rounded-2xl w-80 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-center">
              {t("restaurant.paymentMethod")}
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod(1)}
                className={`flex-1 py-2 rounded-lg border ${
                  paymentMethod === 1
                    ? "bg-primary text-white"
                    : "hover:border-primary"
                }`}>
                💳 {t("restaurant.card")}
              </button>

              <button
                onClick={() => setPaymentMethod(3)}
                className={`flex-1 py-2 rounded-lg border ${
                  paymentMethod === 3
                    ? "bg-primary text-white"
                    : "hover:border-primary"
                }`}>
                💵 {t("restaurant.cash")}
              </button>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg">
                {t("doctor.Cancel")}
              </button>

              <button
                onClick={confirmBooking}
                disabled={!paymentMethod}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">
                {t("tech.Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <ReviewSection
        doctorId={gymId!}
        currentUserId={sessionStorage.getItem("user_id")!}
      />
    </div>
  );
}
