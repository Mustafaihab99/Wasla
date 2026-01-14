import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getDoctorReview } from "../../api/doctor/doctor-api";
import { getReview } from "../../api/resident/resident-api";

export default function useGetDoctorReviews(
  id: string,
  rating: number
) {
  return useQuery({
    queryKey: ["doctor-reviews", id, rating, i18next.language],
    queryFn: () => {
      if (rating === 0) {
        return getReview(id);
      }
      return getDoctorReview(id, rating);
    },
    enabled: !!id,
  });
}
