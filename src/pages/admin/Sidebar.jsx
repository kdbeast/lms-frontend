import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LibraryBig, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Constants to avoid "magic numbers"
  const expandedWidth = 240;
  const collapsedWidth = 80;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-white dark:bg-[#0A0A0A]">
      {/* DESKTOP SIDEBAR */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="relative hidden lg:flex flex-col border-r border-gray-100 dark:border-gray-800 transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] z-20"
        style={{
          width: isExpanded ? `${expandedWidth}px` : `${collapsedWidth}px`,
        }}
      >
        <div className="flex flex-col gap-2 mt-8 w-full">
          <NavItem
            to="dashboard"
            icon={<LayoutDashboard size={22} />}
            label="Dashboard"
            isExpanded={isExpanded}
          />
          <NavItem
            to="course"
            icon={<LibraryBig size={22} />}
            label="Courses"
            isExpanded={isExpanded}
          />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-[#0F0F0F] p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* MOBILE TRIGGER */}
      <div className="lg:hidden absolute m-2 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-2xl bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white border-none cursor-pointer"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-white dark:bg-[#0A0A0A]">
            <div className="flex flex-col gap-2 mt-10">
              <NavItem
                to="dashboard"
                icon={<LayoutDashboard size={22} />}
                label="Dashboard"
                isExpanded={true}
                mobile
                onClick={() => setIsOpen(false)}
              />
              <NavItem
                to="course"
                icon={<LibraryBig size={22} />}
                label="Courses"
                isExpanded={true}
                mobile
                onClick={() => setIsOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

// Sub-component to isolate the animation logic for the labels
const NavItem = ({ to, icon, label, isExpanded, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center rounded-xl px-3 py-3 transition-all duration-200 group relative
        ${isActive ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"} 
        ${isExpanded ? "mx-3 gap-3" : "mx-auto w-12 justify-center"}
      `}
    >
      <div className="shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <span
        className={`font-semibold whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isExpanded
            ? "opacity-100 translate-x-0 visible"
            : "opacity-0 -translate-x-4 invisible absolute"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
};

export default Sidebar;
