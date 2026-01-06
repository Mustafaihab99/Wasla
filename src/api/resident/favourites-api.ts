import { toast } from "sonner";
import axiosInstance from "../axios-instance";
import { AxiosError } from "axios";
import { FavouriteResponse } from "../../types/resident/residentData";

// get favourites
export async function getFavourites(residentId: string): Promise<FavouriteResponse[]> {
  try {
    const response = await axiosInstance.get(
      `Favourite/GetAllFavourites?residentId=${residentId}`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Error");
    throw error;
  }
}

// add fav
export async function addFavorite(residentId: string, serviceProviderId: string) {
  try {
    const response = await axiosInstance.post(
      `Favourite/AddFavourite`,
      null,
      { params: { residentId, serviceProviderId } }
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Error");
    throw error;
  }
}

// remove fav
export async function removeFavorite(favouriteId: number) {
  try {
    const response = await axiosInstance.delete(
      `Favourite/RemoveFavourite`,
      { params: { favouriteId } }
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Error");
    throw error;
  }
}
