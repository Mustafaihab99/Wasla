import axios, { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { doctorProfileData, doctorServiceAdd, doctorServiceData, doctorServiceEdit } from "../../types/doctor/doctorTypes";

// profile
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
// get service
export async function getDoctorServices(id :string) : Promise<doctorServiceData[]> {
    try{
    const response = await axiosInstance.get(`Service/GetServices/${id}`);
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
// add service
export async function addDoctorService(params: doctorServiceAdd) {
  try{
      const response = await axiosInstance.post("Service/AddService" , params);
      toast.success(response?.data?.message || "Added successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Added failed";
    toast.error(errorMessage);
    throw error;
  }
}

// update service
export async function UpdateDoctorService(payload: doctorServiceEdit) {
  try {
    const response = await axiosInstance.put(`Service/UpdateService`, payload);
    toast.success(response?.data?.message || "updated successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Update failed";
    toast.error(errorMessage);
    throw error;
  }
}

// delete service
export async function DeleteDoctorService(serviceID : number) {
 try {
    const response = await axiosInstance.delete(`Service/DeleteService/${serviceID}`);
      toast.success(response?.data?.message || "delete successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Added failed";
    toast.error(errorMessage);
    throw error;
  }
}