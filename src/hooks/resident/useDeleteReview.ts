import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview } from "../../api/resident/resident-api";

export default function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-review"],
    mutationFn: (reviewID: number) => deleteReview(reviewID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allreviews"] });
    },
  });
}
