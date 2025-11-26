import { useMutation } from "@tanstack/react-query";
import { bookService } from "../../api/resident/resident-api";

export default function useBookService() {
  return useMutation({
    mutationKey: ["book-service"],
    mutationFn: (values: FormData) => bookService(values),
  });
}
