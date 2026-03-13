import { toast } from "sonner";
import { AxiosError } from "axios";
import axiosInstance from "../axios-instance";
import {
  ChatConversation,
  ChatUser,
  DeleteChatParams,
  DeleteMessageParams,
  EditMessageParams,
  Message,
  PaginationResponse,
  RecentChat,
  SendMessageParams,
  UpdateBioParams,
  UserProfile,
} from "../../types/chat/chat-types";

export async function getChatUsers(
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginationResponse<ChatUser>> {
  try {
    const { data } = await axiosInstance.get("Chats/Users", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to fetch users");
    throw error;
  }
}


export async function getRecentChats(
  userId: string,
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<PaginationResponse<RecentChat>> {
  try {
    const { data } = await axiosInstance.get("Chats", {
      params: { id: userId, PageNumber: pageNumber, PageSize: pageSize },
    });
    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to fetch chats");
    throw error;
  }
}


export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const { data } = await axiosInstance.get("Chats/UserProfile", {
      params: { Id: userId },
    });
    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to fetch profile");
    throw error;
  }
}


export async function getChatConversation(
  senderId: string,
  receiverId: string,
  pageNumber: number = 1,
  pageSize: number = 30
): Promise<ChatConversation> {
  try {
    const { data } = await axiosInstance.get("Chats/Chat", {
      params: { senderId, receiverId, PageNumber: pageNumber, PageSize: pageSize },
    });
    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to fetch conversation");
    throw error;
  }
}


export async function deleteChat({ chatId, userId }: DeleteChatParams): Promise<void> {
  try {
    const { data } = await axiosInstance.delete("Chats/Chat", {
      params: { chatId, userId },
    });
    console.log(data.message);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to delete chat");
    throw error;
  }
}


export async function updateBio({ userId, bio }: UpdateBioParams): Promise<void> {
  try {
    const { data } = await axiosInstance.put("Chats/Bio", { userId, bio });
    console.log(data?.message || "Bio updated!");
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to update bio");
    throw error;
  }
}


export async function sendMessage(params: SendMessageParams): Promise<Message> {
  try {
    const formData = new FormData();
    if (params.audio) formData.append("audio", params.audio);
    if (params.files) params.files.forEach((f) => formData.append("files", f));

    const { data } = await axiosInstance.post("Chats/Message", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: {
        senderId: params.senderId,
        reciverId: params.reciverId,
        messageText: params.messageText,
        type: params.type,
      },
    });
    return data.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to send message");
    throw error;
  }
}


export async function editMessage(params: EditMessageParams): Promise<void> {
  try {
    const formData = new FormData();
    if (params.newFiles) params.newFiles.forEach((f) => formData.append("newFiles", f));

    await axiosInstance.put("Chats/Message", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: {
        senderId: params.senderId,
        messageId: params.messageId,
        messageText: params.messageText,
        type: params.type,
        existFiles: params.existFiles,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to edit message");
    throw error;
  }
}


export async function deleteMessage({ messageId, senderId }: DeleteMessageParams): Promise<void> {
  try {
    await axiosInstance.delete("Chats/Message", {
      params: { messageId, senderId },
    });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    toast.error(axiosError.response?.data?.message || "Failed to delete message");
    throw error;
  }
}