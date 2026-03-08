/* eslint-disable react-hooks/exhaustive-deps */
import Course from "./Course";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  useGetEnrolledCoursesQuery,
  useUpdateProfileMutation,
} from "@/features/api/authApi";
import { Loader2, Mail, User, ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const Profile = () => {
  const { isSignedIn } = useUser();
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const { data, isLoading, refetch } = useGetEnrolledCoursesQuery(undefined, {
    skip: !isSignedIn,
  });
  const [
    updateProfile,
    {
      isError,
      isSuccess,
      data: updateProfileData,
      isLoading: updateProfileLoading,
    },
  ] = useUpdateProfileMutation();

  useEffect(() => {
    if (data) setName(data.name);
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateProfileData?.message || "Profile updated.");
      refetch();
      setOpen(false);
    }
    if (isError) {
      toast.error("Failed to update profile");
    }
  }, [isSuccess, isError]);

  if (isLoading)
    return (
      <div className="pt-20">
        <ProfileSkeleton />
      </div>
    );

  const profileUpdateHandle = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    await updateProfile(formData);
  };

  return (
    <div className="max-w-5xl mx-auto pt-16 pb-12 px-4 md:px-8">
      <h1 className="font-extrabold text-3xl mb-8 tracking-tight">
        Account Settings
      </h1>

      {/* PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-sm mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-900 shadow-xl">
              <AvatarImage src={data?.photoUrl} />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                {data?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h2 className="text-3xl font-bold">{data?.name}</h2>
                <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 capitalize">
                  {data?.role}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {data?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <ShieldCheck size={18} className="text-green-500" />
                <span>Verified Student</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User size={18} className="text-blue-500" />
                <span>Joined 2026</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setOpen(true)}
              className="mt-4 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
              Edit Profile Details
            </Button>
          </div>
        </div>
      </div>

      {/* ENROLLED COURSES SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">My Learning</h3>
          <span className="text-sm font-medium text-blue-600">
            {data?.enrolledCourses?.length} Courses
          </span>
        </div>

        {data?.enrolledCourses?.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-muted-foreground">
              You haven't enrolled in any courses yet.
            </p>
            <Button variant="link" className="mt-2 text-blue-600 cursor-pointer">
              Browse Catalog
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.enrolledCourses?.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                className="rounded-xl bg-gray-50 dark:bg-gray-800 border-none"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo" className="text-sm font-bold">
                Profile Picture
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="rounded-xl cursor-pointer file:bg-blue-50 file:text-blue-700 file:border-none file:rounded-lg file:px-3 file:mr-4 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0])}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={profileUpdateHandle}
              disabled={updateProfileLoading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-11 cursor-pointer"
            >
              {updateProfileLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto my-10 px-4">
    <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
      <div className="flex flex-col items-center">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-24 w-24 md:h-32 md:w-32 mb-4 animate-pulse"></div>
      </div>
      <div className="w-full md:w-auto text-center md:text-left">
        <div className="mb-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            <span className="inline-block bg-gray-300 dark:bg-gray-700 h-6 w-48 ml-2 animate-pulse"></span>
          </h2>
        </div>
        <div className="mb-2">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            <span className="inline-block bg-gray-300 dark:bg-gray-700 h-6 w-64 ml-2 animate-pulse"></span>
          </h2>
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-10 w-32 animate-pulse mx-auto md:mx-0"></div>
      </div>
    </div>
    <div>
      <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"></div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"></div>
        <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"></div>
      </div>
    </div>
  </div>
);
