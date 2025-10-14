import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import axiosInstance from "../axios-instance";
import {
  forgetData,
  loginData,
  resendData,
  roleData,
  signData,
  verifyEmailData,
} from "../../types/auth/authData";

// login
export async function loginApi(credentials: loginData) {
  try {
    const response = await axiosInstance.post(`/Account/login`, credentials);

    if (response.status === 200) {
      toast.success(response.data?.message || "Login successful");
      sessionStorage.setItem("auth_token", response.data?.data?.token);
    }

    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Login failed";

      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}

// get roles
export async function allRoles(): Promise<roleData> {
  const response = await axiosInstance.get(`Roles`);
  return response.data;
}

// sign up
export async function signupApi(formData: signData) {
  try {
    const response = await axiosInstance.post(`Account/register`, formData);
    console.log(response);
    if (response?.status === 201) {
      console.log(response.data);
      toast.success(response?.data?.message || "Registration successful");
    }
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Registration failed";
    toast.error(errorMessage);
    console.log(error);
    throw error;
  }
}

// verify email
export async function verifyEmailApi(formData: verifyEmailData) {
  try {
    const response = await axiosInstance.post(`Account/verify-email`, formData);
    console.log(response);
    if (response?.status === 201) {
      console.log(response.data);
      toast.success(response?.data?.message || "sended successful");
    }
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Sended failed";
    toast.error(errorMessage);
    console.log(error);
    throw error;
  }
}

// resend code
export async function resendApi(formData: resendData) {
  try {
    const response = await axiosInstance.post(
      "Account/check-mail-verification",
      formData
    );
    console.log(response);
    if (response?.status === 201) {
      console.log(response.data);
      toast.success(response?.data?.message || "sended successful");
    }
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Sended failed";
    toast.error(errorMessage);
    console.log(error);
    throw error;
  }
}

// forget pass
export async function forgetPassApi(formData: forgetData) {
  try{
    const response = await axiosInstance.post("Account/forget-password" , formData);
    console.log(response);
    if(response?.status === 201)
      toast.success(response?.data?.message || "Reseted Successful");
    return response;
  }catch(error){
    const axiosError = error as AxiosError<{message?: string}>;
    const errorMessage = axiosError.response?.data?.message || "Reseted Failed";
    toast.error(errorMessage);
    console.log(error);
    throw error;
  }
}