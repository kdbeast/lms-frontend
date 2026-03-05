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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import CourseEditor from "@/pages/admin/course/CourseEditor";

const BasicCourseTab = ({ courseId }) => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const [prevThumbnail, setPrevThumbnail] = useState(null);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const [editCourse, { data, error, isLoading, isSuccess }] =
    useEditCourseMutation();

  const { data: courseData, isLoading: courseLoading } =
    useGetCourseByIdQuery(courseId);

  useEffect(() => {
    if (courseData?.course) {
      const course = courseData?.course;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
      setPrevThumbnail(course.courseThumbnail);
    }
  }, [courseData]);

  const handleSelectChange = (name) => (value) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPrevThumbnail(fileReader.result); // Set the preview thumbnail
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value)
        formData.append(key, key === "coursePrice" ? Number(value) : value);
    });

    await editCourse({ courseId, formData });
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
    return <Loader2 className="animate-spin fixed top-1/2 left-2/3" />;
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
        <div className="space-y-4 mt-5">
          <div>
            <Label className="mb-1">Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack development"
            />
          </div>
          <div>
            <Label className="mb-1">Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a MERN Stack developer from Zero to Hero in 2 months"
            />
          </div>
          <div className="w-full overflow-hidden">
            <Label className="mb-1">Description</Label>
            <CourseEditor
              value={input.description}
              onChange={(value) =>
                setInput((prev) => ({ ...prev, description: value }))
              }
            />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label className="mb-1">Category</Label>
              <Select
                value={input.category}
                onValueChange={handleSelectChange("category")}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="mb-1">Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
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
            <div>
              <Label className="mb-1">Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={handleSelectChange("courseLevel")}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="mb-1">Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1">Price in (INR)</Label>
              <Input
                type="number"
                className="w-fit"
                placeholder="₹499"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          <div>
            <Label className="mb-1">Course Thumbnail</Label>
            <Input type="file" className="w-fit" onChange={selectThumbnail} />
            {prevThumbnail && (
              <img
                src={prevThumbnail}
                className="w-fit my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicCourseTab;
