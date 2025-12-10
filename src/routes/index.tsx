import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./config";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
