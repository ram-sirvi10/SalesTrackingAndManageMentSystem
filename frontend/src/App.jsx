import AppRoutes from "./routes/AppRoutes";
// import "./assets/styles/global.css";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "16px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <AppRoutes />;
    </>
  );
  // return <div className="text-5xl font-bold text-red-600">TEST</div>;
}

export default App;
