import { useParams, useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FaUtensils, FaHamburger } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { HiUser } from "react-icons/hi2";
import useGetRestaurantProfile from "../../hooks/restaurant/useGetRestaurantProfile";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import ReviewSection from "../../components/resident/ReviewSection";
import BookTableModal from "../../components/restaurant/Modal/BookTableModal";

export default function RestaurantViewDetails() {
  const { restaurantId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<
    "takeaway" | "table" | null
  >(null);

  const { data: profile, isLoading } = useGetRestaurantProfile(restaurantId!);

  if (isLoading) return <DoctorCardSkeleton />;

  return (
    <>
    <div className="max-w-6xl mx-auto p-6 space-y-8"
    style={{direction:"ltr"}}
    >
      <div className="bg-background border rounded-3xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={profile?.profile}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/20"
          />
        </div>

        {/* INFO */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold">{profile?.name}</h1>
          <p className="text-primary font-medium flex items-center gap-2">
            <MdRestaurantMenu className="text-lg" />
            {profile?.restaurantCategoryName}
          </p>

          <p className="text-gray-500 flex items-center gap-2">
            <HiUser className="text-lg" />
            {profile?.ownerName}
          </p>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-3">
            <button
              onClick={() => navigate(`/chat/${restaurantId}`)}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl shadow hover:bg-primary/90 transition">
              <FiMessageCircle />
              {t("chat.message")}
            </button>
          </div>

          {/* CONTACT */}
          <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
            {profile?.phoneNumber && (
              <button
                onClick={() => window.open(`tel:${profile.phoneNumber}`)}
                className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100">
                <FaPhoneAlt className="inline mr-1" />
                {profile.phoneNumber}
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

      {/*  DESCRIPTION */}
      {profile?.description && (
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold text-lg mb-2">{t("restaurant.about")}</h2>
          <p className="text-gray-600 leading-relaxed">{profile.description}</p>
        </div>
      )}

      {/*  GALLERY */}
      {profile!.gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile?.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              className="h-40 w-full object-cover rounded-xl hover:scale-105 transition cursor-pointer"
              onClick={() => window.open(img)}
            />
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* takeway */}
        <div
          onClick={() => {
            setSelectedBooking("takeaway");
            navigate(`/resident/service/restaurants/${restaurantId}/takeaway`);
          }}
          className={`cursor-pointer p-6 rounded-2xl border transition group ${
            selectedBooking === "takeaway"
              ? "border-primary shadow-lg"
              : "hover:shadow-xl"
          }`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaHamburger className="text-primary text-lg" />
            {t("restaurant.takeaway")}
          </h3>
          <p className="text-gray-500 text-sm">
            {t("restaurant.takeawayDesc")}
          </p>
        </div>

        {/* table */}
        <div
          onClick={() => {
  setSelectedBooking("table");
  setOpenModal(true);
}}
          className={`cursor-pointer p-6 rounded-2xl border transition group ${
            selectedBooking === "table"
              ? "border-primary shadow-lg"
              : "hover:shadow-xl"
          }`}>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaUtensils className="text-primary text-lg" />
            {t("restaurant.reserveTable")}
          </h3>
          <p className="text-gray-500 text-sm">{t("restaurant.reserveDesc")}</p>
        </div>
      </div>
      <ReviewSection
        doctorId={restaurantId!}
        currentUserId={sessionStorage.getItem("user_id")!}
      />
    </div>
    <BookTableModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  restaurantId={restaurantId!}
/>
    </>
  );
}
