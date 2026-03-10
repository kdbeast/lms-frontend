/* eslint-disable react-hooks/set-state-in-effect */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
} from "../../../features/api/courseApi";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import CourseEditor from "@/pages/admin/course/CourseEditor";

const MEDIA_API = `${import.meta.env.VITE_API_URL}/api/v1/media`;

const BasicCourseTab = ({ courseId }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseTitle: "",
      subTitle: "",
      description: "",
      category: "",
      courseLevel: "",
      coursePrice: "",
      thumbnail: null,
    },
  });
  const [prevThumbnail, setPrevThumbnail] = useState(null);

  const [editCourse, { data, error, isLoading, isSuccess }] =
    useEditCourseMutation();

  const { data: courseData, isLoading: courseLoading } =
    useGetCourseByIdQuery(courseId);

  useEffect(() => {
    if (courseData?.course) {
      const course = courseData.course;

      reset({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
      });

      setValue("category", course.category);
      setValue("courseLevel", course.courseLevel);

      setPrevThumbnail(course.courseThumbnail);
    }
  }, [courseData, reset, setValue]);

  const onSubmit = async (formData) => {
    if (!formData.thumbnail && !prevThumbnail) {
      toast.error("Thumbnail is required");
      return;
    }

    let thumbnailUrl = prevThumbnail;

    if (formData.thumbnail) {
      const uploaded = await uploadThumbnail(formData.thumbnail);
      if (!uploaded) return;
      thumbnailUrl = uploaded;
    }

    const payload = {
      courseTitle: formData.courseTitle,
      subTitle: formData.subTitle,
      description: formData.description,
      category: formData.category,
      courseLevel: formData.courseLevel,
      coursePrice: formData.coursePrice,
      courseThumbnail: thumbnailUrl,
    };

    await editCourse({
      courseId,
      formData: payload,
    });
  };

  const uploadThumbnail = async (file) => {
    try {
      const res = await axios.get(`${MEDIA_API}/get-upload-url`, {
        params: {
          filename: file.name,
          type: file.type,
        },
      });

      const { url, key } = res.data.data;

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      return `${import.meta.env.VITE_R2_PUBLIC_URL}/${key}`;
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload failed");
      return null;
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Course updated successfully.");
      navigate(`/admin/course/${courseId}/curriculum`);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [data, isSuccess, error, navigate, courseId]);

  if (courseLoading) {
    return <BasicCourseTabSkeleton />;
  }

  return (
    <Card className="py-6 w-full max-w-full overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="courseTitle">Title</Label>
              <Input
                id="courseTitle"
                type="text"
                placeholder="Ex. Fullstack development"
                {...register("courseTitle", { required: "Title is required" })}
              />
              {errors.courseTitle && (
                <p className="text-destructive text-sm font-medium">
                  {errors.courseTitle.message}
                </p>
              )}
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subTitle">Subtitle</Label>
              <Input
                id="subTitle"
                type="text"
                placeholder="Ex. Become a MERN Stack developer"
                {...register("subTitle", { required: "Subtitle is required" })}
              />
              {errors.subTitle && (
                <p className="text-destructive text-sm font-medium">
                  {errors.subTitle.message}
                </p>
              )}
            </div>

            {/* Description - Fixed for Mobile Overflow */}
            <div className="w-full max-w-full overflow-hidden space-y-2">
              <Label>Description</Label>
              <div className="rounded-md border border-input overflow-hidden">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <CourseEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.description && (
                <p className="text-destructive text-sm font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Selectors Grid - Fixed for Mobile Stacking */}
            <div className="grid grid-cols-1 md:flex md:items-start md:gap-5 gap-6">
              <div className="flex-1 space-y-2">
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      key={field.value}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full md:w-55">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Next Js">Next JS</SelectItem>
                        <SelectItem value="Data Science">
                          Data Science
                        </SelectItem>
                        <SelectItem value="Frontend Development">
                          Frontend Development
                        </SelectItem>
                        <SelectItem value="Fullstack Development">
                          Fullstack Development
                        </SelectItem>
                        <SelectItem value="Javascript">Javascript</SelectItem>
                        {/* ... other options */}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label>Course Level</Label>
                <Controller
                  name="courseLevel"
                  control={control}
                  rules={{ required: "Course level is required" }}
                  render={({ field }) => (
                    <Select
                      key={field.value}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full md:w-45">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.courseLevel && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.courseLevel.message}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <Label>Price (INR)</Label>
                <Input
                  type="number"
                  placeholder="₹499"
                  className="w-full"
                  {...register("coursePrice", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be > 0" },
                  })}
                />
                {errors.coursePrice && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.coursePrice.message}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-3">
              <Label>Course Thumbnail</Label>
              {prevThumbnail ? (
                <div className="relative group w-full md:w-fit overflow-hidden rounded-md border">
                  <img
                    src={prevThumbnail}
                    alt="Course Thumbnail"
                    className="w-full md:max-w-sm rounded-md object-cover max-h-[250px]"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <label className="cursor-pointer bg-black/70 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-black transition-colors">
                      Change
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setValue("thumbnail", file);
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setPrevThumbnail(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="bg-red-600/90 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-red-700 transition-colors"
                      onClick={() => {
                        setPrevThumbnail(null);
                        setValue("thumbnail", null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <Input
                  type="file"
                  className="w-full md:w-fit"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setValue("thumbnail", file);
                      const reader = new FileReader();
                      reader.onloadend = () => setPrevThumbnail(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto order-2 sm:order-1"
                onClick={() => navigate("/admin/course")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BasicCourseTab;

const BasicCourseTabSkeleton = () => {
  return (
    <Card className="py-6 animate-pulse">
      <CardHeader className="flex flex-row justify-between">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-gray-300 rounded"></div>
          <div className="h-4 w-96 bg-gray-300 rounded"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-300 rounded"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-20 w-full bg-gray-300 rounded"></div>
          </div>

          {/* Category, Level, Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-10 w-full md:w-fit bg-gray-300 rounded"></div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <div className="h-10 w-full sm:w-auto bg-gray-300 rounded"></div>
            <div className="h-10 w-full sm:w-auto bg-gray-300 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
