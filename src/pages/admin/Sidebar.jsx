import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex dark:bg-[#121212] bg-white h-full">
      {/* Left Sidebar (Desktop) */}
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden lg:flex flex-col mr-5 border-r border-gray-300 dark:border-gray-700 dark:bg-[#0A0A0A] bg-[#f0f0f0] sticky top-0 h-screen overflow-hidden transition-[width] duration-500 ease-out ${isExpanded ? "w-40" : "w-20"}`}
      >
        <div className="space-y-4 mt-5">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              } ${isExpanded ? "gap-3 justify-start" : "justify-center"}`
            }
          >
            <ChartNoAxesColumn size={22} className="shrink-0" />

            <span
              className={`whitespace-nowrap transition-all duration-200 ${
                isExpanded
                  ? "opacity-100 ml-1"
                  : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="course"
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              } ${isExpanded ? "gap-3 justify-start" : "justify-center"}`
            }
          >
            <SquareLibrary size={22} className="shrink-0" />

            <span
              className={`whitespace-nowrap transition-all duration-200 ${
                isExpanded ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Courses
            </span>
          </NavLink>
        </div>
      </div>

      {/* Mobile Sidebar (using ShadCN UI Sheet) */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-4 text-gray-700 dark:text-gray-300">
              <span className="text-xl cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 bg-gray-300 dark:bg-gray-700 p-2 rounded-lg">
                ☰
              </span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="bg-[#f0f0f0] dark:bg-[#0A0A0A] p-5"
          >
            <div className="space-y-4 mt-5">
              <NavLink
                to="dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center gap-4 font-semibold transition ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  } hover:text-blue-600 dark:hover:text-blue-400`
                }
                onClick={() => setIsOpen(false)}
              >
                <ChartNoAxesColumn size={22} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="course"
                className={({ isActive }) =>
                  `flex items-center gap-4 font-semibold transition ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  } hover:text-blue-600 dark:hover:text-blue-400`
                }
                onClick={() => setIsOpen(false)}
              >
                <SquareLibrary size={22} />
                <span>Courses</span>
              </NavLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Outlet Content */}
      <div className="flex-1 p-2 dark:bg-[#121212] bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
