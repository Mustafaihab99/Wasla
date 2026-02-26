import { toast } from "sonner";
import axiosInstance from "../axios-instance";
import { AxiosError } from "axios";
import { userCreatePaymentData } from "../../types/resident/residentData";

export async function createPayment(payload :userCreatePaymentData) {
  try {
    const response = await axiosInstance.post(
      `payment/create-payment-token`,
      payload 
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Error");
    throw error;
  }
}