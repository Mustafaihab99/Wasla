import axios from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { doctorProfileData } from "../../types/doctor/doctorTypes";

export async function getDoctorProfile(id :string) : Promise<doctorProfileData> {
    try{
    const response = await axiosInstance.get(`Doctor/GetDoctorProfile/${id}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}