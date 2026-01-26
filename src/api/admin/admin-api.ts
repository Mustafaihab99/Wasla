import axios from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { ReportsData } from "../../types/admin/adminTypes";

// reports
export async function getAdminReports() : Promise<ReportsData[]> {
    try{
    const response = await axiosInstance.get(`Admin/GetContacts`);
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