import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DarkMode from "../DarkMode";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Menu, School } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useGetEnrolledCoursesQuery } from "@/features/api/authApi";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { data } = useGetEnrolledCoursesQuery(undefined, {
    skip: !isSignedIn,
  });

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 z-10">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center h-full px-4">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <School size={30} />
          <h1 className="font-extrabold text-2xl">E-Learning</h1>
        </div>

        <div className="flex items-center gap-5 m-5 p-5">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-10 cursor-pointer">
                  <AvatarImage
                    src={data?.photoUrl || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black m-0.5" />
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" to="/my-learning">
                    My Learning
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" to="/profile">
                    Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut(() => navigate("/"))}
                >
                  Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user?.unsafeMetadata?.role === "instructor" && (
                  <DropdownMenuItem asChild>
                    <Link className="cursor-pointer" to="/admin/dashboard">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant={"default"}
                onClick={() => navigate("/auth?tab=login")}
                className="dark:bg-white dark:text-black"
              >
                Login
              </Button>
              <Button
                variant={"default"}
                onClick={() => navigate("/auth?tab=signup")}
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
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <School size={28} />
          <h1 className="font-extrabold text-xl">E-Learning</h1>
        </div>

        <div className="flex items-center gap-4">
          <MobileNavbar />
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

/* ----------------- Mobile Navbar ----------------- */

const MobileNavbar = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { data } = useGetEnrolledCoursesQuery(undefined, {
    skip: !isSignedIn,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="cursor-pointer">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-center font-extrabold text-2xl">
            E-Learning
          </SheetTitle>
        </SheetHeader>

        <Separator className="my-4" />

        <nav className="flex flex-col gap-2 justify-center text-center">
          <div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="size-10 cursor-pointer">
                    <AvatarImage
                      src={data?.photoUrl || "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black m-0.5" />
                  <DropdownMenuItem asChild>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut(() => navigate("/"))}
                  >
                    Logout
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user?.unsafeMetadata?.role === "instructor" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={"default"}
                  onClick={() => navigate("/auth?tab=login")}
                  className="dark:bg-white dark:text-black"
                >
                  Login
                </Button>
                <Button
                  variant={"default"}
                  onClick={() => navigate("/auth?tab=signup")}
                  className="dark:bg-white dark:text-black"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
