import { MessageType } from "../../utils/enum";

export type MessageTypeValue = (typeof MessageType)[keyof typeof MessageType];


export interface PaginationResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}


export interface ChatUser {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
}

export interface UserProfile {
  id: string;
  name: string | null;
  profileImage: string | null;
  bio: string | null;
  phone: string | null;
  isOnline : boolean;
  lastSeen: string;
}


export interface Message {
  messageId?: number;
  senderId : string;
  receiverId : string;
  messageText: string | null;
  audio: string | null;
  type: MessageTypeValue;
  sentAt: string;
  readAt: string | null;
  isEdited: boolean;
  files: string[];
  isMine : boolean
}

export interface RecentChat {
  receiverId: string;
  senderId: string,
  chatId: number;
  name: string | null;
  profileReceiver: string | null;
  messageText: string | null;
  audio: string | null;
  isEdit: boolean;
  isMine: boolean;
  type: MessageTypeValue;
  files: string[];
  sentAt: string;
  readAt: string | null;
  unreadMessageCount : number;
}

export interface ChatConversation {
  chatId: number;
  senderId: string;
  receiverId: string;
  messages: PaginationResponse<Message>;
}

export interface SendMessageParams {
  senderId: string;
  reciverId: string;
  messageText?: string;
  type: MessageTypeValue;
  audio?: File;
  files?: File[];
}

export interface EditMessageParams {
  senderId: string;
  messageId: number;
  messageText?: string;
  type: MessageTypeValue;
  existFiles?: string[];
  newFiles?: File[];
}

export interface DeleteMessageParams {
  messageId: number;
  senderId: string;
}

export interface DeleteChatParams {
  chatId: number;
  userId: string;
}

export interface UpdateBioParams {
  userId: string;
  bio: string;
}

// SignalR Typing

export interface TypingEvent {
  senderId: string;
  receiverId: string;
}