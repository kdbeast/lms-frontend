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
// import {
//   useEditCourseMutation,
//   useGetCourseByIdQuery,
//   usePublishCourseMutation,
// } from "@/api/courseApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Editor } from "primereact/editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const BasicCourseTab = ({ courseId }) => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const isLoading = false;

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  //   const { data: courseData, refetch } = useGetCourseByIdQuery(courseId, {
  //     refetchOnMountOrArgChange: true,
  //   });
  //   const [editCourse, { data, error, isLoading, isSuccess }] =
  //     useEditCourseMutation();
  //   const [publishCourse] = usePublishCourseMutation();
  const [prevThumbnail, setPrevThumbnail] = useState(null);
  //   const course = courseData?.course;

  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (course) {
  //       setInput({
  //         courseTitle: course.courseTitle,
  //         subTitle: course.subTitle,
  //         description: course.description,
  //         category: course.category,
  //         courseLevel: course.courseLevel,
  //         coursePrice: course.coursePrice,
  //         courseThumbnail: "",
  //       });
  //       setPrevThumbnail(course.courseThumbnail);
  //     }
  //   }, [course]);

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

  const submitHandler = async () => {
    console.log(input);
    //     const formData = new FormData();
    //     Object.entries(input).forEach(([key, value]) => {
    //       if (value) formData.append(key, key === "price" ? Number(value) : value);
    //   });

    //     await editCourse({ id: courseId, formData });
  };

  //   const togglePublishUnpublishCourse = async (action) => {
  //     try {
  //       const response = await publishCourse({ courseId, query: action });
  //       if (response.data) {
  //         refetch();
  //         toast.success(
  //           response.data.message ||
  //             `Course ${
  //               action === "true" ? "published" : "unpublished"
  //             } successfully.`
  //         );
  //       }
  //     } catch (error) {
  //       toast.error(
  //         `Failed to ${action === "true" ? "publish" : "unpublish"} the course.`
  //       );
  //     }
  //   };

  //   useEffect(() => {
  //     if (isSuccess && data) {
  //       toast.success(data?.message || "Course updated successfully.");
  //     }
  //     if (error) {
  //       toast.error(error.data.message);
  //     }
  //   }, [data, isSuccess, error]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {/* <Button
            onClick={() =>
              togglePublishUnpublishCourse(
                course?.isPublished ? "false" : "true"
              )
            }
            variant="outline"
            disabled={course?.lectures.length === 0}
          >
            {course?.isPublished ? "Unpublish" : "Publish"}
          </Button> */}
          <Button>Remove Course</Button>
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
          <div>
            <Label className="mb-1">Description</Label>
            <Editor
              value={input.description}
              style={{ height: "320px" }}
              onTextChange={(e) => setInput({ ...input, description: e.value })}
            />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label className="mb-1">Category</Label>
              <Select
                defaultValue={input.category}
                onValueChange={handleSelectChange("category")}
              >
                <SelectTrigger className="w-[180px]">
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
                defaultValue={input.courseLevel}
                onValueChange={handleSelectChange("courseLevel")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="mb-1">Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
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
                className="w-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={submitHandler}>
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
