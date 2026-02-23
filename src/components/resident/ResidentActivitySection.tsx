import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useGetUserActivity from "../../hooks/userEvent/useGetUserActivity";
import { FaStar } from "react-icons/fa";

interface Props {
  userId: string;
}

export default function ResidentActivitySection({ userId }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: activity, isLoading } = useGetUserActivity(userId);

  if (!isLoading && (!activity || activity.length === 0)) return null;

  return (
    <section className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center"
      >
        {t("resident.topForYou")}
      </motion.h2>

      {isLoading ? (
        <div className="text-center py-10 text-muted">
          {t("resident.loading")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {activity?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {item.name}
                </h3>

                <p className="text-sm text-muted line-clamp-2">
                  {item.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar />
                  <span className="text-sm font-medium">
                    {item.rating.toFixed(1)}
                  </span>
                </div>

                {/* Button */}
                <button
                  onClick={() =>
                    navigate(`/resident/provider/${item.id}`)
                  }
                  className="mt-3 w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
                >
                  {t("resident.viewProfile")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}