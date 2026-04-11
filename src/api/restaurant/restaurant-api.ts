import { AxiosError } from "axios";
import { SpicialzedData } from "../auth/complete-profile";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";

export async function allRestaurantSpecialzed(): Promise<SpicialzedData[]> {
  const response = await axiosInstance.get(`RestaurantCategory/GetAll`);
  return response.data.data;
}

export async function setRestaurantProfile(formData: FormData) {
  try {
    const response = await axiosInstance.post("Restaurant/CompleteProfiler", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Restaurant profile completed successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Registration failed";
    toast.error(errorMessage);
    throw error;
  }
}