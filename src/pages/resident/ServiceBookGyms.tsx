import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useGetAllGyms from "../../hooks/gym/useGetAllGyms";
import { useGetFavourites } from "../../hooks/resident/favourites/useGetFavourite";
import { useAddToFavourite } from "../../hooks/resident/favourites/useAddToFavourite";
import { useRemoveFavourite } from "../../hooks/resident/favourites/useRemoveFavourite";
import noData from "../../assets/images/nodata.webp";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";

export default function ServiceBookGyms() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data, isLoading, isFetching } = useGetAllGyms(page, pageSize);

  const residentId = sessionStorage.getItem("user_id")!;
  const { data: favourites = [] } = useGetFavourites(residentId);
  const addFav = useAddToFavourite(residentId);
  const removeFav = useRemoveFavourite(residentId);

  const isFav = (gymId: string) =>
    favourites.find(
      (f: { serviceProviderId: string }) => f.serviceProviderId === gymId,
    );

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">
        {t("resident.gyms")}
      </h2>
      {isLoading ? (
         <DoctorCardSkeleton />
      ) : data?.data?.length ? (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {isFetching && ( <DoctorCardSkeleton />
            )}

            {data.data.map((gym) => (
              <div
                key={gym.id}
                className="
              group flex flex-col
              rounded-2xl border border-border
              bg-background
              shadow-sm hover:shadow-xl
              transition-all duration-300
              overflow-hidden
            ">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={import.meta.env.VITE_GYM_IMAGE + gym.imageUrl}
                    alt={gym.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Favourite */}
                  <button
                    onClick={() => {
                      const fav = isFav(gym.id);
                      if (fav) removeFav.mutate(fav.id);
                      else addFav.mutate(gym.id);
                    }}
                    className="absolute top-3 right-3 bg-background rounded-full p-2 shadow-md">
                    <FaHeart
                      size={18}
                      className={
                        isFav(gym.id)
                          ? "text-red-500 fill-red-500"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                      {gym.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[40px]">
                      {gym.description}
                    </p>

                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                      ⭐ {gym.rating?.toFixed(1)}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`${gym.id}`)}
                    className="
                  mt-4 w-full py-2
                  bg-primary text-white
                  rounded-lg font-medium
                  hover:bg-primary/90
                  transition
                ">
                    {t("resident.ViewDetails")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="
              px-4 py-2 rounded-lg border border-border
              bg-background hover:bg-muted
              disabled:opacity-40 disabled:cursor-not-allowed
            ">
                {t("resident.Prev")}
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`
                  w-10 h-10 rounded-lg border
                  transition
                  ${
                    page === pageNumber
                      ? "bg-primary text-white border-primary"
                      : "border-border bg-background hover:bg-muted"
                  }
                `}>
                    {pageNumber}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="
              px-4 py-2 rounded-lg border border-border
              bg-background hover:bg-muted
              disabled:opacity-40 disabled:cursor-not-allowed
            ">
                {t("resident.Next")}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center mt-10">
          <img src={noData} alt="no data found" className="opacity-80" />
        </div>
      )}
    </div>
  );
}
