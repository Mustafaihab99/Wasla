import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  MutableRefObject,
} from "react";
import * as signalR from "@microsoft/signalr";

const CHAT_HUB_URL = "https://waslammka.runasp.net/chatHub";

interface ChatHubContextValue {
  connectionRef: MutableRefObject<signalR.HubConnection | null>;
}

const ChatHubContext = createContext<ChatHubContextValue | undefined>(undefined);

interface ChatHubProviderProps {
  token: string;
  currentUserId: string;
  children: ReactNode;
}

export function ChatHubProvider({
  token,
  currentUserId,
  children,
}: ChatHubProviderProps) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token || !currentUserId) return;

    const existingConnection = connectionRef.current;

    if (
      existingConnection &&
      existingConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      existingConnection.stop();
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(CHAT_HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("✅ SignalR Connected");
      } catch (err) {
        console.error("❌ SignalR failed:", err);
      }
    };

    startConnection();

    return () => {
      if (connection.state !== signalR.HubConnectionState.Disconnected) {
        connection.stop();
      }
    };
  }, [token, currentUserId]);

  return (
    <ChatHubContext.Provider value={{ connectionRef }}>
      {children}
    </ChatHubContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChatHubConnection() {
  const ctx = useContext(ChatHubContext);

  if (!ctx) {
    throw new Error(
      "useChatHubConnection must be used within a ChatHubProvider"
    );
  }

  return ctx.connectionRef;
}