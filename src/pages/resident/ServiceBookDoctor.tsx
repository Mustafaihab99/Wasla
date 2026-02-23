import { useState } from "react";
import useDoctorSpecialezed from "../../hooks/completeProfile/useDoctorSpecialized";
import useGetDoctorToResident from "../../hooks/resident/useGetDoctorToResident";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";
import { useGetFavourites } from "../../hooks/resident/favourites/useGetFavourite";
import { useAddToFavourite } from "../../hooks/resident/favourites/useAddToFavourite";
import { useRemoveFavourite } from "../../hooks/resident/favourites/useRemoveFavourite";
import noData from "../../assets/images/nodata.webp";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import useCreateEvent from "../../hooks/userEvent/useCreateEvent";
import { UserEvent } from "../../utils/enum";

export default function ServiceBookDoctor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedSpec, setSelectedSpec] = useState(0);
  const createEvent = useCreateEvent();

  const { data: specs } = useDoctorSpecialezed();
  const { data: doctors, isLoading } = useGetDoctorToResident(
    selectedSpec.toString(),
  );
  const residentId = sessionStorage.getItem("user_id")!;
  const { data: favourites = [] } = useGetFavourites(residentId);

  const addFav = useAddToFavourite(residentId);
  const removeFav = useRemoveFavourite(residentId);

  const isFav = (doctorId: string) =>
    favourites.find(
      (f: { serviceProviderId: string }) => f.serviceProviderId === doctorId,
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Specializations Swiper */}
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        navigation
        pagination={{ clickable: true }}
        className="mb-6">
        <SwiperSlide style={{ width: "auto" }}>
          <button
            className={`px-5 py-2 rounded-2xl font-medium transition-colors duration-200 ${
              selectedSpec === 0
                ? "bg-primary text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedSpec(0)}>
            {t("resident.All")}
          </button>
        </SwiperSlide>

        {specs?.map((spec) => (
          <SwiperSlide key={spec.id} style={{ width: "auto" }}>
            <button
              className={`px-5 py-2 rounded-2xl font-medium transition-colors duration-200 ${
                selectedSpec === spec.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedSpec(spec.id)}>
              {spec.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Doctors Grid */}
      {isLoading ? (
        <DoctorCardSkeleton />
      ) : doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Image */}
              <div className="w-full h-48 sm:h-56 md:h-48 lg:h-56 relative">
                <img
                  src={import.meta.env.VITE_USER_IMAGE + doc.imageUrl}
                  alt={doc.fullName}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    const fav = isFav(doc.id);
                    if (fav) {
                      removeFav.mutate(fav.id);
                    } else {
                      addFav.mutate(doc.id);
                    }
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                  <FaHeart
                    size={20}
                    className={
                      isFav(doc.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {doc.fullName}
                  </h3>
                  <p className="text-primary font-semibold mt-1 text-sm sm:text-base">
                    {doc.specialtyName}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    {doc.universityName} - {doc.hospitalname}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2 text-gray-600 items-center text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      ⭐ {doc.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      🩺 {doc.experienceYears} {t("resident.yearsExp")}
                    </span>
                    <span className="flex items-center gap-1">
                      👥 {doc.numberOfpatients} {t("resident.patients")}
                    </span>
                  </div>
                </div>

                <button
                  className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition text-sm sm:text-base"
                  onClick={() => {
                    createEvent.mutate(
                      {
                        userId: residentId,
                        serviceProviderId: doc.id,
                        eventType: UserEvent.viewDetails,
                      },
                      {
                        onSuccess: () => {
                          navigate(`${doc.id}`);
                        },
                        onError: () => {
                          navigate(`${doc.id}`); 
                        },
                      },
                    );
                  }}>
                  {t("resident.ViewDetails")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <img src={noData} alt="no data found" className="opacity-80" />
        </div>
      )}
    </div>
  );
}
