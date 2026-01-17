import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import useBookingHub from "./utils/singlr/useBookingHub";
import useServiceHub from "./utils/singlr/useServiceHub";
import useReviewHub from "./utils/singlr/useReviewHub";

const queryClient = new QueryClient();

function App() {
  const token = localStorage.getItem("auth_token") ?? "";
  
  return (
    <QueryClientProvider client={queryClient}>
      <SignalRListener token={token} />
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
function SignalRListener({ token }: { token: string }) {
  useBookingHub(token);
  useServiceHub(token);
  useReviewHub(token);
  return null; 
}
