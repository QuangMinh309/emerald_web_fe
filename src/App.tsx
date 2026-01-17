import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/store";
import { SocketProvider } from "@/sockets/socket.provider";
const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Provider store={store}>
            <RouterProvider router={routes} />
          </Provider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
