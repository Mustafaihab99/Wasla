/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useState } from "react";
import { FaSearch, FaStar, FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useServices } from "../../hooks/resident/useServices";
import { useDebounce } from "../../hooks/resident/useDebounce";
import { useTranslation } from "react-i18next";
import noData from "../../assets/images/nodata.webp";
import { useGetFavourites } from "../../hooks/resident/favourites/useGetFavourite";
import { useAddToFavourite } from "../../hooks/resident/favourites/useAddToFavourite";
import { useRemoveFavourite } from "../../hooks/resident/favourites/useRemoveFavourite";

export default function ResidentServices() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { serviceName } = useParams();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const { data, loading, totalCount } = useServices(debouncedSearch, page);

  const residentId = sessionStorage.getItem("user_id")!;
  const { data: favourites = [] } = useGetFavourites(residentId);
  const addFav = useAddToFavourite(residentId);
  const removeFav = useRemoveFavourite(residentId);

  const isFav = (id: string) =>
    favourites.find((f: any) => f.serviceProviderId === id);

  const totalPages = Math.ceil(totalCount / 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-24 px-6 lg:px-16 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          {serviceName} {t("resident.services")}
        </h1>

        <p className="text-gray-500">
          {totalCount} {t("resident.resultsFound")}
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex items-center border bg-background px-4 py-2 rounded-lg gap-2 w-full md:w-80">
        <FaSearch size={16} className="text-primary" />
        <input
          type="text"
          placeholder={t("resident.searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="outline-none bg-background w-full"
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-60 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <img src={noData} alt="no data" className="w-40 opacity-80" />
          <p className="text-gray-500 text-lg font-medium text-center">
            {t("resident.noServices")}
          </p>
        </div>
      )}

      {/* CARDS */}
      {!loading && data.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((p) => {
            const rating = p.rating > 5 ? p.rating / 2 : p.rating;

            const isDriver = p.role?.toLowerCase() === "driver";

            return (
              !isDriver &&
              <div
                key={p.id}
                className="group flex flex-col rounded-2xl border bg-background shadow-sm hover:shadow-xl transition overflow-hidden">
                {/* IMAGE */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={p.photo}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* FAV */}
                  <button
                    onClick={() => {
                      const fav = isFav(p.id);
                      if (fav) removeFav.mutate(fav.id);
                      else addFav.mutate(p.id);
                    }}
                    className="absolute top-3 right-3 bg-background p-2 rounded-full shadow">
                    <FaHeart
                      className={
                        isFav(p.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  {/* NAME */}
                  <h3 className="text-lg font-bold group-hover:text-primary transition">
                    {p.name}
                  </h3>

                  {/* ROLE */}
                  <p className="text-secondary text-sm font-medium">{p.role}</p>

                  {/* CONTACT */}
                  <div className="text-xs text-dried space-y-1">
                    <p className="truncate">{p.email}</p>
                    <p>{p.phone}</p>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {p.description}
                  </p>

                  {/* RATING */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaStar className="text-yellow-500" />
                    {rating?.toFixed(1)}
                  </div>

                  {/* BUTTON */}
                    <button
                      onClick={() =>
                        navigate(`/resident/service/${p.role}s/${p.id}`)
                      }
                      className="mt-auto w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                      {t("resident.viewDetails")}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-40">
            {t("resident.prev")}
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded-lg border ${
                  page === pageNum ? "bg-primary text-white" : "bg-background"
                }`}>
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-40">
            {t("resident.next")}
          </button>
        </div>
      )}
    </motion.div>
  );
}
