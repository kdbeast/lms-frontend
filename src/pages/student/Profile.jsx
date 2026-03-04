import Course from "./Course";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  useGetEnrolledCoursesQuery,
  useUpdateProfileMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
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
    if (isSuccess) {
      toast.success(updateProfileData?.message || "Profile updated.");
      refetch();
    }
    if (isError) {
      toast.error(updateProfileData?.message || "Failed to update profile");
    }
  }, [isSuccess, isError, updateProfileData, refetch]);

  if (isLoading)
    return (
      <div className="my-24">
        <ProfileSkeleton />
      </div>
    );

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const profileUpdateHandle = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    await updateProfile(formData);
    setOpen(!open);
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src={data?.photoUrl} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        <div className="w-full md:w-auto text-center md:text-left">
          <div className="mb-2">
            <h2 className="font-semibold">
              Name:
              <span className="ml-2 font-normal">{data?.name}</span>
            </h2>
          </div>

          <div className="mb-2">
            <h2 className="font-semibold">
              Email:
              <span className="ml-2 font-normal">{data?.email}</span>
            </h2>
          </div>

          <div className="mb-2">
            <h2 className="font-semibold">
              Role:
              <span className="ml-2 font-normal">
                {data?.role?.toUpperCase()}
              </span>
            </h2>
          </div>

          <Dialog
            open={open}
            onOpenChange={() => {
              setOpen(!open);
            }}
          >
            {/* <DialogTrigger asChild> */}
            <Button size="sm" className="mt-2" onClick={() => setOpen(true)}>
              Edit Profile
            </Button>
            {/* </DialogTrigger> */}

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Update your profile information.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    placeholder="Name"
                    className="col-span-3"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <DialogFooter>
                {updateProfileLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </Button>
                ) : (
                  <Button onClick={profileUpdateHandle} type="submit">
                    Save changes
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {data?.enrolledCourses?.length === 0 ? (
            <h1 className="text-center">
              You haven't enrolled yet in any Course{" "}
            </h1>
          ) : (
            data?.enrolledCourses?.map((course) => (
              <Course key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
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
