import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Navbar />
      <div className="pt-16 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </div>
    </div>
  );
};
export default MainLayout;
