import { Navigate, Outlet } from "react-router-dom";
import { ApiLimitWarning } from "..";
import { Toaster } from "@/components/ui/toaster"
const AuthLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return !user ? (
    <div className="h-screen">
      <ApiLimitWarning />
      <Outlet />
      <Toaster />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AuthLayout;
