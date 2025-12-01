import axios, { AxiosError } from "axios";
import { doctorsToResidentData, myBookingDoctor, residentChartsData, residentProfile } from "../../types/resident/residentData";
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
// book a service
export async function bookService(formData: FormData) {
  try {
    const response = await axiosInstance.post("Book/BookService", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
// show my booking
export async function showMyBooking(id :string) : Promise<myBookingDoctor[]> {
    try{
    const response = await axiosInstance.get(`Book/GetBookingDetailsForUser?userId=${id}`);
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
// resident charts
export async function fetchResidentCharts(id :string) : Promise<residentChartsData> {
    try{
    const response = await axiosInstance.get(`Resident/resident-chart?residentId=${id}`);
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