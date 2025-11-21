import axios from "axios";
import { residentProfile } from "../../types/resident/residentData";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";

export async function getResidentProfile(id :string) : Promise<residentProfile> {
    try{
    const response = await axiosInstance.get(`Account/get-Profile?userId=${id}`);
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