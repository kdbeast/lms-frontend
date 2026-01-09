import React from "react";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetContent,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { useEffect } from "react";
import DarkMode from "../DarkMode";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { SheetClose, SheetTrigger } from "./ui/sheet";
import { Menu, School } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Separator } from "./ui/separator";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logout successful");
    }
  }, [isSuccess, data, navigate]);

  return (
    <div
      className={`h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10`}
    >
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 m-5 p-5 cursor-pointer"
        >
          <School size={"30"} />
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-Learning
          </h1>
        </div>

        {/* User icon and dark mode icon */}
        <div className="flex items-center gap-5 m-5 p-5">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="size-10">
                  <AvatarImage
                    src={user.user.photoUrl || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black m-0.5" />
                <DropdownMenuItem>
                  <Link to="/my-learning">My Learning</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/profile">Edit Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user?.user?.role === "instructor" && (
                  <DropdownMenuItem>
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant={"default"}
                onClick={() => navigate("/login?tab=login")}
                className="dark:bg-white dark:text-black"
              >
                Login
              </Button>
              <Button
                variant={"default"}
                onClick={() => navigate("/login?tab=signup")}
                className="dark:bg-white dark:text-black"
              >
                Register
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <h1 onClick={() => navigate("/")} className="font-extrabold text-2xl">
            E-Learning
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <MobileNavbar
            navigate={navigate}
            user={user}
            handleLogout={handleLogout}
          />
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ navigate, user, handleLogout }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className={
            "p-2 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-800 hover:shadow-md dark:hover:shadow-md hover:scale-110 dark:hover:scale-110 transition-all duration-300 rounded-full hover:cursor-pointer"
          }
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle
            onClick={() => navigate("/")}
            className="text-center font-extrabold text-2xl"
          >
            E-Learning
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-2" />
        <nav className="flex flex-col gap-2 p-2">
          {user ? (
            <>
              <SheetClose asChild>
                <Link
                  to="/my-learning"
                  className="font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 rounded-lg p-2 flex items-center gap-2"
                >
                  My Learning
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="/profile"
                  className="font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 rounded-lg p-2 flex items-center gap-2"
                >
                  Edit Profile
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 rounded-lg p-2 flex justify-start items-center gap-2"
                >
                  Logout
                </Button>
              </SheetClose>
              {user?.user?.role === "instructor" && (
                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      onClick={() => navigate("/admin/dashboard")}
                      type="submit"
                      variant="outline"
                      className="w-full"
                    >
                      Dashboard
                    </Button>
                  </SheetClose>
                </SheetFooter>
              )}
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button
                  variant={"default"}
                  onClick={() => navigate("/login?tab=login")}
                  className="dark:bg-white dark:text-black w-full"
                >
                  Login
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant={"default"}
                  onClick={() => navigate("/login?tab=signup")}
                  className="dark:bg-white dark:text-black w-full"
                >
                  Register
                </Button>
              </SheetClose>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
