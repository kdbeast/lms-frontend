import React from "react";
import {
  Sheet,
  SheetTitle,
  SheetClose,
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
import DarkMode from "../DarkMode";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Menu, School } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { SheetDescription, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";

const Navbar = () => {
  const user = true;
  return (
    <div
      className={`h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10`}
    >
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2 m-5 p-5">
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
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black m-0.5" />
                <DropdownMenuItem>My Learning</DropdownMenuItem>
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline">Login</Button>
              <Button>Register</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <h1 className="font-extrabold text-2xl">E-Learning</h1>
        </div>
        <div className="flex items-center gap-5">
          <MobileNavbar />
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const role = "instructor";
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
          <SheetTitle className="text-center font-extrabold text-2xl">
            E-Learning
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <nav className="flex flex-col gap-2 p-2">
          <span className="font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-800 hover:shadow-md dark:hover:shadow-md rounded-full hover:cursor-pointer p-2 flex justify-center items-center gap-2">
            My Learning
          </span>
          <span className="font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-800 hover:shadow-md dark:hover:shadow-md rounded-full hover:cursor-pointer p-2 flex justify-center items-center gap-2">
            Edit Profile
          </span>
          <span className="font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-800 hover:shadow-md dark:hover:shadow-md rounded-full hover:cursor-pointer p-2 flex justify-center items-center gap-2">
            Logout
          </span>
          {role === "instructor" && (
            <SheetFooter>
              <Button type="submit" variant="outline">
                Dashboard
              </Button>
            </SheetFooter>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
