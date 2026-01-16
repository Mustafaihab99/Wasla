import { motion } from "framer-motion";
import { FaPhone, FaTrashAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import DoctorCardSkeleton from "../../components/resident/DoctorCardSkelton";
import noData from "../../assets/images/nodata.webp";
import { useGetFavourites } from "../../hooks/resident/favourites/useGetFavourite";
import { useRemoveFavourite } from "../../hooks/resident/favourites/useRemoveFavourite";
import { FavouriteResponse } from "../../types/resident/residentData";
import { useNavigate } from "react-router-dom";

export default function ResidentMyFavourites() {
  const { t } = useTranslation();
  const residentId = sessionStorage.getItem("user_id")!;
  const navigate = useNavigate();
  const { data: favourites = [], isLoading } = useGetFavourites(residentId);
  const { mutate: removeFav, isPending } = useRemoveFavourite(residentId);

  return (
    <div className="w-full bg-background pb-20 px-4 text-foreground">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mt-2 mb-12">
        {t("resident.myFavourites")}
      </motion.h2>

      {/* Loading */}
      {isLoading && <DoctorCardSkeleton />}

      {/* No Data */}
      {!isLoading && favourites.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
          <img src={noData} alt="no data found" className="w-48 opacity-70" />
          <p className="text-gray-400 text-lg font-semibold">
            {t("resident.noFavourites")}
          </p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && favourites.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
          {favourites.map((fav: FavouriteResponse) => (
            <motion.div
              key={fav.id}
              style={{direction:"ltr"}}
              whileHover={{ scale: 1.03, y: -3 }}
              className="relative flex flex-col sm:flex-row p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg transition-all cursor-pointer"
              onClick={()=> navigate(`/resident/service/doctors/${fav.serviceProviderId}`) }
              >
              {/* Remove Button */}
              <button
                disabled={isPending}
                onClick={() => removeFav(fav.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition disabled:opacity-50"
                title={t("resident.removeFavourite")}>
                <FaTrashAlt size={18} />
              </button>

              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={
                    import.meta.env.VITE_USER_IMAGE +
                    fav.serviceProviderProfilePhoto
                  }
                  alt={fav.serviceProviderName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-md"
                />
              </div>

              {/* Info */}
              <div className="flex-1 ml-0 sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                <div>
                  {/* Name */}
                  <h3 className="text-xl font-bold text-primary break-words">
                    {fav.serviceProviderName}
                  </h3>

                  {/* Type Badge */}
                  <div className="mt-2">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold
        border border-primary text-primary bg-primary/5">
                      {fav.serviceProviderType}
                    </span>
                  </div>

                  {/* Phone */}
                  <p className="flex gap-2 items-center text-dried text-sm mt-2">
                    <FaPhone className="text-green-500"/>
                    {fav.serviceProviderPhone}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
