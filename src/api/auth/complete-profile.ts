import { toast } from "sonner";
import axiosInstance from "../axios-instance";
import { AxiosError } from "axios";

// get doctor specialezed
export interface SpicialzedData{
    id : number;
    name:string;
}
export async function allSpecialzed(): Promise<SpicialzedData[]> {
  const response = await axiosInstance.get(`Doctor/DoctorSpecializations`);
  return response.data.data;
}

// post doctor data
export async function setDoctorProfile(formData: FormData) {
  try {
    const response = await axiosInstance.post("Doctor/CompleteData", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Doctor profile completed successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Registration failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function setResidentProfile(formData: FormData) {
  try {
    const response = await axiosInstance.post("Resident/CompleteRegister", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Resident profile completed successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Registration failed";
    toast.error(errorMessage);
    throw error;
  }
}
