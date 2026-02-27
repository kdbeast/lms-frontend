import React from "react";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "./ui/sheet";
import DarkMode from "../DarkMode";
import { Button } from "./ui/button";
import { Menu, School } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Separator } from "./ui/separator";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

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

        <div className="flex items-center gap-5">
          {/* AUTHED USER */}
          <SignedIn>
            <div className="flex items-center gap-4">
              <InstructorLink />

              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </SignedIn>

          {/* GUEST USER */}
          <SignedOut>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/auth")}
                className="dark:bg-white dark:text-black"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/auth?mode=sign-up")}
                className="dark:bg-white dark:text-black"
              >
                Register
              </Button>
            </div>
          </SignedOut>

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
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

        <nav className="flex flex-col gap-2">
          <SignedIn>
            <SheetClose asChild>
              <Link to="/my-learning" className="menu-item">
                My Learning
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link to="/profile" className="menu-item">
                Profile
              </Link>
            </SheetClose>

            <SheetFooter className="mt-4">
              <UserButton afterSignOutUrl="/" />
            </SheetFooter>
          </SignedIn>

          <SignedOut>
            <SheetClose asChild>
              <Button onClick={() => navigate("/auth")} className="w-full">
                Login
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button
                onClick={() => navigate("/auth?mode=sign-up")}
                className="w-full"
              >
                Register
              </Button>
            </SheetClose>
          </SignedOut>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

/* ----------------- Instructor Dashboard Button ----------------- */

const InstructorLink = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role;

  if (role !== "instructor") return null;

  return (
    <Button
      variant="outline"
      onClick={() => (window.location.href = "/admin/dashboard")}
    >
      Dashboard
    </Button>
  );
};
