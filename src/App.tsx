import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import Spinner from "@components/common/Spinner";

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={routes} />
    </Suspense>
  );
}
