import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import useGetDoctorReviews from "../../hooks/doctor/useGetDoctorReviews";
import { useTranslation } from "react-i18next";

export default function DoctorReviews() {
  const {t} = useTranslation();
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const doctorId = sessionStorage.getItem("user_id")!;
  const { data: reviews, isLoading } = useGetDoctorReviews(
    doctorId,
    ratingFilter
  );

  const hasNoData = !isLoading && (!reviews || reviews.length === 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        {t("doctor.reviews")}
        <span className="text-primary ml-2">
          ({reviews?.length || 0})
        </span>
      </motion.h2>

      {/* Rating Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-3 flex-wrap"
      >
        {[0, 5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setRatingFilter(r)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full border transition
              ${
                ratingFilter === r
                  ? "bg-primary text-white border-primary"
                  : "bg-card hover:bg-primary/10"
              }`}
          >
            {r === 0 ? (
              t("doctor.All")
            ) : (
              <>
                {r}
                <FaStar className="text-yellow-400" />
              </>
            )}
          </button>
        ))}
      </motion.div>

      {/* Skeleton */}
      {isLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border bg-card animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-300" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-4/5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* No Data */}
      {hasNoData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 border rounded-2xl bg-card"
        >
          <p className="text-lg font-semibold text-dried">
            {t("doctor.noRev")}
          </p>
        </motion.div>
      )}

      {/* Reviews */}
      {!isLoading && reviews && reviews.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.reviewId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-2xl border bg-card shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        import.meta.env.VITE_USER_IMAGE + review.userImageUrl
                      }
                      alt={review.reviewerName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />

                    <div>
                      <h4 className="font-bold">
                        {review.reviewerName}
                      </h4>
                      <div className="flex text-yellow-400 text-sm mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating
                                ? "fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-dried">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-4 text-sm text-dried leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
