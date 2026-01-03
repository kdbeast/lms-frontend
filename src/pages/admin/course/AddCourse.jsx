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
import { useCreateCourseMutation } from "../../../features/api/courseApi";

const AddCourse = () => {
  const navigate = useNavigate();

  const [createCourse, { data, error, isLoading, isSuccess }] =
    useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course created successfully");
    }
  }, [isSuccess, error, data]);

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
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="nextjs">Next JS</SelectItem>
                <SelectItem value="data science">Data Science</SelectItem>
                <SelectItem value="frontend development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="fullstack development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="mern stack development">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="backend development">
                  Backend Development
                </SelectItem>
                <SelectItem value="javascript">Javascript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
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
