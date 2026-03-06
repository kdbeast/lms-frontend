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
    const data = new FormData();

    data.append("courseTitle", formData.courseTitle);
    data.append("subTitle", formData.subTitle);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("courseLevel", formData.courseLevel);
    data.append("coursePrice", formData.coursePrice);

    if (formData.thumbnail) {
      data.append("courseThumbnail", formData.thumbnail);
    }

    await editCourse({
      courseId,
      formData: data,
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Course updated successfully.");
      navigate(`/admin/course/${courseId}/lecture`);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [data, isSuccess, error, navigate, courseId]);

  if (courseLoading) {
    return <BasicCourseTabSkeleton />;
  }

  return (
    <Card className="py-6">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label className="mb-1">Title</Label>
              <Input
                type="text"
                placeholder="Ex. Fullstack development"
                {...register("courseTitle", { required: "Title is required" })}
              />

              {errors.courseTitle && (
                <p className="text-red-500 text-sm">
                  {errors.courseTitle.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1">Subtitle</Label>
              <Input
                type="text"
                placeholder="Ex. Become a MERN Stack developer from Zero to Hero in 2 months"
                {...register("subTitle", { required: "Subtitle is required" })}
              />

              {errors.subTitle && (
                <p className="text-red-500 text-sm">
                  {errors.subTitle.message}
                </p>
              )}
            </div>

            <div className="w-full overflow-hidden">
              <Label className="mb-1">Description</Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <CourseEditor value={field.value} onChange={field.onChange} />
                )}
              />

              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-5">
              <div>
                <Label className="mb-1">Category</Label>
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
                      <SelectTrigger className="w-55">
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
                        <SelectItem value="MERN Stack Development">
                          MERN Stack Development
                        </SelectItem>
                        <SelectItem value="Backend Development">
                          Backend Development
                        </SelectItem>
                        <SelectItem value="Javascript">Javascript</SelectItem>
                        <SelectItem value="Python">Python</SelectItem>
                        <SelectItem value="Docker">Docker</SelectItem>
                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                        <SelectItem value="HTML">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1">Course Level</Label>
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
                      <SelectTrigger className="w-45">
                        <SelectValue placeholder="Select course level" />
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
                  <p className="text-red-500 text-sm">
                    {errors.courseLevel.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1">Price in (INR)</Label>
                <Input
                  type="number"
                  placeholder="₹499"
                  {...register("coursePrice", {
                    required: "Price is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be greater than 0" },
                  })}
                />

                {errors.coursePrice && (
                  <p className="text-red-500 text-sm">
                    {errors.coursePrice.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label className="mb-2">Course Thumbnail</Label>

              {/* If thumbnail already exists */}
              {prevThumbnail ? (
                <div className="relative w-fit">
                  <img
                    src={prevThumbnail}
                    alt="Course Thumbnail"
                    className="rounded-md max-h-[250px]"
                  />

                  {/* Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {/* Change Image */}
                    <label className="cursor-pointer bg-black/50 text-white px-3 py-1 rounded text-sm hover:bg-black">
                      Change
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setValue("thumbnail", file);

                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setPrevThumbnail(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {/* Remove Image */}
                    <button
                      type="button"
                      className="bg-red-600 text-white px-3 py-1 cursor-pointer rounded text-sm hover:bg-red-700"
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
                /* If no image yet */
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setValue("thumbnail", file);

                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPrevThumbnail(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate("/admin/course")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Save"
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
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-72 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-5 mt-5">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-56 w-full bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>

          {/* Row */}
          <div className="flex gap-5">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-72 bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-md" />
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
