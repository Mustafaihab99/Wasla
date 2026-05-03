import { toast } from "sonner";
import axiosInstance from "../../axios-instance";
import axios, { AxiosError } from "axios";
import { addAdminData, allAdminsData } from "../../../types/admin/adminTypes";

export async function addAdmin(formData: addAdminData) {
  const response = await axiosInstance.post(
    "SuperAdmin/AddAdmin",
    formData 
  );
  if (response?.status === 201) {
    toast.success(response?.data?.message || "Added successful");
  }
  return response;
}

export async function getAllAdmins(): Promise<allAdminsData[]> {
  try {
    const response = await axiosInstance.get(`SuperAdmin/GetAdmins`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}

export async function deleteAdmin(id:string) {
  try {
    const response = await axiosInstance.delete(`SuperAdmin/RemoveAdmin/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function toogleAdminStatus(id:string) {
  try {
    const response = await axiosInstance.patch(`SuperAdmin/ToggleAdminStatus/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}