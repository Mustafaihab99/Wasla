import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FaHeart } from "react-icons/fa";
import useFetchTechnicians from "../../hooks/technican/useFetchTechnicians";
import useGetTechnicanSpecial from "../../hooks/technican/useGetTechnicanSpecial";
import { useGetFavourites } from "../../hooks/resident/favourites/useGetFavourite";
import { useAddToFavourite } from "../../hooks/resident/favourites/useAddToFavourite";
import { useRemoveFavourite } from "../../hooks/resident/favourites/useRemoveFavourite";
import useCreateEvent from "../../hooks/userEvent/useCreateEvent";
import { UserEvent } from "../../utils/enum";
import noData from "../../assets/images/nodata.webp";

export default function ServiceBookTechnician() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedSpec, setSelectedSpec] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const residentId = sessionStorage.getItem("user_id")!;

  const createEvent = useCreateEvent();

  const { data: specs } = useGetTechnicanSpecial();

  const { data, isLoading } = useFetchTechnicians(
    page,
    6,
    selectedSpec ?? undefined,
  );

  const technicians = data?.data || [];

  const { data: favourites = [] } = useGetFavourites(residentId);

  const addFav = useAddToFavourite(residentId);
  const removeFav = useRemoveFavourite(residentId);

  const isFav = (id: string) =>
    favourites.find(
      (f: { serviceProviderId: string }) => f.serviceProviderId === id,
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Swiper spaceBetween={10} slidesPerView="auto" className="mb-6">
        <SwiperSlide style={{ width: "auto" }}>
          <button
            onClick={() => {
              setSelectedSpec(null);
              setPage(1);
            }}
            className={`px-5 py-2 rounded-2xl ${
              selectedSpec === null ? "bg-primary text-white" : "bg-gray-100"
            }`}>
            {t("resident.All")}
          </button>
        </SwiperSlide>

        {specs?.map((spec) => (
          <SwiperSlide key={spec.id} style={{ width: "auto" }}>
            <button
              onClick={() => {
                setSelectedSpec(spec.id);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-2xl ${
                selectedSpec === spec.id
                  ? "bg-primary text-white"
                  : "bg-gray-100"
              }`}>
              {spec.name}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {isLoading ? (
        <p>{t("tech.loading")}...</p>
      ) : technicians.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="rounded-2xl shadow-md hover:shadow-xl overflow-hidden flex flex-col h-full">
                <div className="relative h-52">
                  <img
                    src={tech.imageUrl}
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => {
                      const fav = isFav(tech.id);
                      if (fav) removeFav.mutate(fav.id);
                      else addFav.mutate(tech.id);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full">
                    <FaHeart
                      className={
                        isFav(tech.id) ? "text-red-500" : "text-gray-400"
                      }
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{tech.name}</h3>

                    <p className="text-primary text-sm">
                      {tech.specialization}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {tech.description}
                    </p>

                    <div className="flex gap-3 mt-2 text-sm">
                      <span>⭐ {tech.rating}</span>
                      <span>
                        🛠 {tech.yearsOfExperience} {t("resident.yearsExp")}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    className="mt-4 bg-primary text-white py-2 rounded-lg"
                    onClick={() => {
                      createEvent.mutate(
                        {
                          userId: residentId,
                          serviceProviderId: tech.id,
                          eventType: UserEvent.viewDetails,
                        },
                        {
                          onSettled: () => {
                            navigate(`${tech.id}`);
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

          {/* 🔥 Pagination */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded">
              {t("tech.prev")}
            </button>

            <span className="px-4 py-2">{data?.currentPage}</span>

            <button
              disabled={page >= Math.ceil((data?.totalCount || 0) / 6)}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded">
              {t("tech.next")}
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center mt-10">
          <img src={noData} />
        </div>
      )}
    </div>
  );
}
