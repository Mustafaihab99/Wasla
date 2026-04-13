import { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { showAllRestaurants } from "../../types/restaurant/restaurant-types";

interface SpicialzedcatData {
  id:number,
  name:{
    english : string,
    arabic: string,
  }
};
export async function allRestaurantSpecialzed(): Promise<SpicialzedcatData[]> {
  const response = await axiosInstance.get(`RestaurantCategory/GetAll`);
  return response.data.data;
}

export async function setRestaurantProfile(formData: FormData) {
  try {
    const response = await axiosInstance.post("Restaurant/CompleteProfile", formData, {
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

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export async function fetchAllRestaurant(
  pageNumber: number = 1,
  pageSize: number = 6,
  id : number
): Promise<PaginatedResponse<showAllRestaurants>> {
  try {
    const response = await axiosInstance.get(
      `Restaurant/Restaurants?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
    const result = response.data;
    return {
      data: result.data?.data || [],
      totalCount: result.data?.totalCount || 0,
      currentPage: result.data?.pageNumber || pageNumber,
      pageSize: result.data?.pageSize || pageSize,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch restaurants";
    toast.error(errorMessage);
    throw error;
  }
}