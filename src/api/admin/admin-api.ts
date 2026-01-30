import axios, { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";
import { AdminOverviewData, AdminUsersResponse, GetUserDetailsResponse, ReportsData } from "../../types/admin/adminTypes";

// reports
export async function getAdminReports() : Promise<ReportsData[]> {
    try{
    const response = await axiosInstance.get(`Admin/GetContacts`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}

// pagination users
export async function getAdminUsers(roleId:string | undefined , pageNumber: number , pageSize: number) : Promise<AdminUsersResponse> {
    try{
    const response = await axiosInstance.get(`Admin/UserApprove?roleId=${roleId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}
// change stauts
interface changeUserData{
  userId : string,
  status:number
}
export async function changeUserStatus(params:changeUserData) {
  try{
      const response = await axiosInstance.post("Admin/ChangeUserStatus" , params);
      toast.success(response?.data?.message || "changed successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "changed failed";
    toast.error(errorMessage);
    throw error;
  }
}
// admin overview
export async function getAdminOverview() : Promise<AdminOverviewData> {
    try{
    const response = await axiosInstance.get(`Admin/CollectedCountBookings/2`);
    return response.data.data;
    }
    catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "fetch failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
    }
}
// view detaailes
export async function getAdminUserDetails(
  userId: string,
): Promise<GetUserDetailsResponse> {
  try {
    const response = await axiosInstance.get(
      `Admin/GetUserDetails?userId=${userId}`
    );
    return response.data;
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
