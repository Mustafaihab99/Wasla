import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookService } from "../../api/resident/resident-api";

export default function useBookService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["book-service"],
    mutationFn: (values: FormData) => bookService(values),
      onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctor-services"], exact: false });
    },
  });
}
