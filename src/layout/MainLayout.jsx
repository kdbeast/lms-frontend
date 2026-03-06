import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt-16 flex-1">
        <Outlet />
      </div>
    </div>
  );
};
export default MainLayout;
