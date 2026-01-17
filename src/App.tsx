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
        <Provider store={store}>
          <SocketProvider>
            <RouterProvider router={routes} />
          </SocketProvider>
        </Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
