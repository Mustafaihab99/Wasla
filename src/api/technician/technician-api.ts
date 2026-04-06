import axios, { AxiosError } from "axios";
import { showAllTechnicians, techProfileData } from "../../types/technician/technician-types";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";

export async function getTechnicinaProfile(id: string): Promise<techProfileData> {
  try {
    const response = await axiosInstance.get(`Technician/GetProfile?id=${id}`);
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
// edit prof
export async function EditTechnicianProfile(formData: FormData) {
   try {
    const response = await axiosInstance.put(`Technician/UpdateProfile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(response.data.message || "profile Updated successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Updated failed";
    toast.error(errorMessage);
    throw error;
  }
}
// all technicians
interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export async function fetchAllTechnicians(
  pageNumber: number = 1,
  pageSize: number = 6,
  specialityId? : number
): Promise<PaginatedResponse<showAllTechnicians>> {
  try {
    const response = await axiosInstance.get(
      specialityId ?
      `Technician/GetBySpecialty?specialty=${specialityId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      :
      `Technician/GetBySpecialty?&pageNumber=${pageNumber}&pageSize=${pageSize}`
      ,
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
      axiosError.response?.data?.message || "Failed to fetch technicians";
    toast.error(errorMessage);
    throw error;
  }
}