import { useMutation } from "@tanstack/react-query";
import { createPayment } from "../../../api/resident/payment-api";
import { userCreatePaymentData } from "../../../types/resident/residentData";

export default function useCreatePayment() {
  return useMutation({
    mutationKey: ["create-payment"],
    mutationFn: (payload: userCreatePaymentData) =>
      createPayment(payload),
  });
}