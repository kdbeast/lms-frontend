import React from "react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Course = ({ course }) => {
  return (
    <Card
      key={course._id}
      className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 "
    >
      <div className="relative">
        <img
          src={course.courseImage}
          alt={course.courseTitle}
          className="w-full h-56 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent rounded-t-lg"></div>
      </div>
      <CardContent className="px-5 py-2 space-y-2">
        <Link to={`/course-details/${course._id}`}>
          <h1 className="hover:underline font-bold text-lg truncate">
            {course.courseTitle}
          </h1>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course.photoUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">{course.name}</h1>
          </div>
          <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
            {course.courseLevel}
          </Badge>
        </div>
        <div className="text-lg font-bold ">
          <span>₹{course.coursePrice}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Course;
