import { toast } from "sonner";
import axiosInstance from "../axios-instance";
import axios, { AxiosError } from "axios";
import { userActivityData } from "../../types/userEvent/userEvent-typs";

export async function createUserEvent (userId : string , serviceProviderId : string , eventType: number) {
  try {
    const response = await axiosInstance.post("UserEvent/CreateUserEvent" , {
      userId , serviceProviderId , eventType
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Event failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function getUserActivity(userId: string): Promise<userActivityData[]> {
  try {
    const response = await axiosInstance.get(`UserEvent/GetTopServiceProviders?userId=${userId}&top=5`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Fetched failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}