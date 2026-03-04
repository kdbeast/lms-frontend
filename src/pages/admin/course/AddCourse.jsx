import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useGetAllAdminCourseQuery,
} from "../../../features/api/courseApi";

const AddCourse = () => {
  const navigate = useNavigate();

  const [createCourse, { data, error, isLoading, isSuccess }] =
    useCreateCourseMutation();

  const { data: getCourse } = useGetAllAdminCourseQuery();

  const courseId = getCourse?.courses[getCourse?.courses.length - 1]?._id;

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course created successfully");
      navigate(`/admin/course/${courseId}`);
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, error, data, navigate, courseId]);

  const [category, setCategory] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const createCourseHandler = () => {
    createCourse({ courseTitle, category });
  };

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  return (
    <div className="flex-1 mx-10 mt-20">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course, add some basic details for your new course
        </h1>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="mb-2">Title</Label>
          <Input
            type="text"
            value={courseTitle}
            placeholder="Your Course Name"
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2">Category</Label>
          <Select onValueChange={(value) => getSelectedCategory(value)}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next Js">Next JS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
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
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
