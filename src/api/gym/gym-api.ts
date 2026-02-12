import axios from "axios";
import { GymProfileData } from "../../types/gym/gym-types";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";

export async function getGymProfile(id :string) : Promise<GymProfileData> {
    try{
    const response = await axiosInstance.get(`Gym/GymProfile?id=${id}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Fetched failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}