import React from "react";
import LectureTab from "./LectureTab";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";

const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <div className="flex-1 mx-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button className="rounded-full" size="icon" variant="outline">
              <ArrowLeft size="16" />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">Update Your Lecture </h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
};

export default EditLecture;
