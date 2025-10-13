import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AppRoutes from "./routes/AppRoutes"
import { Toaster } from "sonner";

function App() {
const queryClient = new QueryClient();
  return (
    <>
    <QueryClientProvider client={queryClient}>
    <AppRoutes />
    <Toaster richColors position="top-center"/>
    </QueryClientProvider>
    </>
  )
}

export default App
