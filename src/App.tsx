import AppRoutes from "./routes";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      {/* Sidebar */}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
