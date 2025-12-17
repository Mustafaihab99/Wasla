import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useGetReviews from "../../hooks/resident/useGetReviews";
import useAddReviews from "../../hooks/resident/useAddReviews";
import useDeleteReview from "../../hooks/resident/useDeleteReview";
import useEditReview from "../../hooks/resident/useEditReview";
import { toast } from "sonner";

interface Props {
  doctorId: string;
  currentUserId: string;
}

export default function ReviewSection({ doctorId, currentUserId }: Props) {
  const { t } = useTranslation();
  const { data: reviews, isLoading } = useGetReviews(doctorId);
  const { mutate: addReview, isPending } = useAddReviews();
  const { mutate: updateReview, isPending: isUpdating } = useEditReview();
  const { mutate: deleteReview } = useDeleteReview();

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  const handleAdd = () => {
    if (!content.trim() || isPending) return;

    if(content.length > 30){
        toast.error(t("resident.longRev"));
        return;
    }
    addReview({
      content,
      rating,
      userId: currentUserId,
      serviceProviderId: doctorId,
    });

    setContent("");
    setRating(5);
  };

  return (
    <div className="space-y-12">
      {/* Header*/}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-extrabold">
        {t("resident.reviews")}
        <span className="text-primary ml-2"> ({reviews?.length || 0})</span>
      </motion.h2>

      {/* Add Review */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 space-y-5">
        {/* glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />

        <h3 className="font-bold text-lg relative">{t("resident.addRev")}</h3>

        {/* Stars */}
        <div className="flex gap-2 relative">
          {[1, 2, 3, 4, 5].map((s) => (
            <FaStar
              key={s}
              onClick={() => setRating(s)}
              className={`cursor-pointer text-2xl transition-all ${
                rating >= s
                  ? "text-yellow-400 scale-110"
                  : "text-gray-300 hover:scale-105"
              }`}
            />
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("resident.write")}
          rows={4}
          disabled={isPending}
          className="relative w-full text-xs md:text-sm rounded-2xl border bg-background p-4 resize-none focus:ring-2 focus:ring-primary outline-none disabled:opacity-60"
        />

        <button
          onClick={handleAdd}
          disabled={isPending}
          className="relative w-full py-3 rounded-xl bg-primary text-white font-bold tracking-wide transition hover:bg-primary/90 disabled:opacity-40">
          {isPending ? t("resident.Sending...") : t("resident.publish")}
        </button>
      </motion.div>

      {/* Reviews List  */}
      {isLoading ? (
            <motion.div
            className="mt-8 w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin"
          />
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {reviews?.map((review) => {
            const isOwner = review.userId === currentUserId;
            const isEditing = editingId === review.reviewId;

              return (
                <motion.div
                  key={review.reviewId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border bg-card p-6 shadow-sm hover:shadow-lg transition">
                  {/* Header */}
                  <div className="flex flex-col gap-3 md:flex-row md:gap-0 justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <img
                        src={
                          import.meta.env.VITE_USER_IMAGE + review.userImageUrl
                        }
                        className="w-14 h-14 rounded-full object-cover border"
                      />

                      <div>
                        <h4 className="font-bold">{review.reviewerName}</h4>
                        <div className="flex text-yellow-400 text-sm">
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

                    <span className="text-xs text-dried self-end">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Content */}
                  {!isEditing ? (
                    <p className="mt-4 text-dried leading-relaxed break-words whitespace-pre-wrap transition-all duration-300">
                      {review.comment}
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            onClick={() => setEditRating(s)}
                            className={`cursor-pointer ${
                              editRating >= s
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full rounded-xl border p-3 resize-none"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  {isOwner && (
                    <div className="flex justify-end gap-4 mt-5">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(review.reviewId);
                              setEditContent(review.comment);
                              setEditRating(review.rating);
                            }}
                            className="text-blue-500 text-sm flex items-center gap-1 hover:underline">
                            <FaEdit /> {t("resident.Edit")}
                          </button>

                          <button
                            onClick={() => deleteReview(review.reviewId)}
                            className="text-red-500 text-sm flex items-center gap-1 hover:underline">
                            <FaTrash /> {t("resident.Delete")}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                           disabled={isUpdating}
                            onClick={() => {
                              setEditingId(null);
                              updateReview({
                                reviewId: review.reviewId,
                                content: editContent,
                                rating: editRating,
                              });
                              setEditingId(null);
                            }}
                            className="text-green-500 text-sm flex items-center gap-1">
                            <FaCheck /> {t("resident.Save")}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 text-sm flex items-center gap-1">
                            <FaTimes /> {t("resident.Cancel")}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
