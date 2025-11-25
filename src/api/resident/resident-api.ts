import axios from "axios";
import { doctorsToResidentData, residentProfile } from "../../types/resident/residentData";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";

// profile
export async function getResidentProfile(id :string) : Promise<residentProfile> {
    try{
    const response = await axiosInstance.get(`Resident/get-Profile?userId=${id}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}

// doctors to resident
export async function fetchDoctorsToResident(specialid :string) : Promise<doctorsToResidentData[]> {
    try{
    const response = await axiosInstance.get(`Doctor/GetDoctorBySpecialist/${specialid}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}