import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/store";
const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}
