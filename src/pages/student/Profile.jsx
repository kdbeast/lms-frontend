/* eslint-disable react-hooks/set-state-in-effect */
import Course from "./Course";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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

import { useUser } from "@clerk/clerk-react";
import { useGetEnrolledCoursesQuery } from "@/features/api/courseApi"; // create this if not exists

const Profile = () => {
  const { user, isLoaded } = useUser();

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data: coursesData, isLoading } = useGetEnrolledCoursesQuery();

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
    }
  }, [user]);

  if (!isLoaded || isLoading)
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
    try {
      await user.update({
        firstName: name,
      });

      if (profilePhoto) {
        await user.setProfileImage({ file: profilePhoto });
      }

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Profile update failed");
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        <div className="w-full md:w-auto text-center md:text-left">
          <div className="mb-2">
            <h2 className="font-semibold">
              Name:
              <span className="ml-2 font-normal">{user?.fullName}</span>
            </h2>
          </div>

          <div className="mb-2">
            <h2 className="font-semibold">
              Email:
              <span className="ml-2 font-normal">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </h2>
          </div>

          <div className="mb-2">
            <h2 className="font-semibold">
              Role:
              <span className="ml-2 font-normal">
                {user?.publicMetadata?.role?.toUpperCase() || "STUDENT"}
              </span>
            </h2>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>

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
                    value={name}
                    className="col-span-3"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={profileUpdateHandle}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {coursesData?.courses?.length === 0 ? (
            <h1 className="text-center">You haven't enrolled yet</h1>
          ) : (
            coursesData?.courses?.map((course) => (
              <Course key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
