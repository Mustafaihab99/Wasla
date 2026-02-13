import axios, { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { doctorBookingListData, doctorChartsData, doctorProfileData, doctorServiceAdd, doctorServiceData, doctorServiceEdit, doctorUpdateBookData } from "../../types/doctor/doctorTypes";
import { reviewGet } from "../../types/resident/residentData";

// profile
export async function getDoctorProfile(id :string) : Promise<doctorProfileData> {
    try{
    const response = await axiosInstance.get(`Doctor/GetDoctorProfile/${id}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetched failed";
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
    const response = await axiosInstance.get(`DoctorService/GetServices/${id}`);
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
      const response = await axiosInstance.post("DoctorService/AddService" , params);
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
    const response = await axiosInstance.put(`DoctorService/UpdateService`, payload);
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
    const response = await axiosInstance.delete(`DoctorService/DeleteService/${serviceID}`);
      toast.success(response?.data?.message || "delete successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "deleted failed";
    toast.error(errorMessage);
    throw error;
  }
}
// charts data 
export async function fetchChartsData(id :string) : Promise<doctorChartsData> {
    try{
    const response = await axiosInstance.get(`Doctor/GetDoctorChart/${id}`);
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
// bookingList 
export async function fetchBookingList(id :string , type:number) : Promise<doctorBookingListData[]> {
    try{
    const response = await axiosInstance.get(`Doctor/GetAllBookingsOfDoctor/${id}/${type}`);
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
// Edit Profile
export async function EditDoctorProfile(formData: FormData) {
   try {
    const response = await axiosInstance.put(`Doctor/UpdateDoctorProfile`, formData, {
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
// cancel Book
export async function cancelDoctorBook(bookingId: number) {
   try {
    const response = await axiosInstance.put(`DoctorBook/UpdateBookingStatus?bookingId=${bookingId}&status=3`);
    toast.success(response.data.message || "Book Canceled successfully");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "canceled failed";
    toast.error(errorMessage);
    throw error;
  }
}
// update time Book
export async function updateDoctorBook(updataData: doctorUpdateBookData) {
   try {
    const response = await axiosInstance.put(`DoctorBook/UpdateBooking` , updataData);
    toast.success(response.data.message || "Book Updated successfully");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "updated failed";
    toast.error(errorMessage);
    throw error;
  }
}

// get doctor reviews
export async function getDoctorReview(id :string , rating: number) : Promise<reviewGet[]> {
    try{
    const response = await axiosInstance.get(`Review/ratings/${rating}/service-providers/${id}`);
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