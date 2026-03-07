import {
  BadgeInfo,
  Lock,
  PlayCircle,
  Globe,
  Users,
  Calendar,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import BuyCourseButton from "../../components/BuyCourseButton";
import { useGetCourseDetailWithStatusQuery } from "../../features/api/purchaseApi";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <PacmanLoader color="#3b82f6" size={20} />
      </div>
    );
  if (isError)
    return (
      <div className="p-10 text-center">Failed to load course details.</div>
    );

  const { course, purchased } = data;

  const previewLecture = course.sections
    .flatMap((section) => section.lectures)
    .find((lecture) => lecture.isPreviewFree);

  const videoUrl = previewLecture?.videoUrl;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      {/* HEADER SECTION - Udemy Style Dark Hero */}
      <div className="bg-[#1C1D1F] text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {course.courseTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              {course.subTitle ||
                "Master the fundamentals and advanced concepts in this comprehensive guide."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
              <p className="text-[#C0C4FC] font-semibold underline cursor-pointer">
                Created by {course?.creator?.name || "Karan Jamwal"}
              </p>
              <div className="flex items-center gap-1">
                <BadgeInfo size={16} />
                <span>Last updated {course.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe size={16} />
                <span>English</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: Description & Curriculum */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-10">
            {/* Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Description</h2>

              <div className="relative">
                <div
                  className={`prose dark:prose-invert transition-all duration-300 overflow-hidden ${
                    !isExpanded ? "max-h-48" : "max-h-full"
                  }`}
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />

                {/* Gradient Overlay for the "Fade out" effect when collapsed */}
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-background to-transparent" />
                )}
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-purple-700 dark:text-purple-400 cursor-pointer font-bold hover:text-purple-800 text-sm mt-2"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            </section>

            {/* CURRICULUM SECTION (Accordion) */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-400">
                <span>
                  {course?.sections?.length} sections •{" "}
                  {course?.sections?.reduce(
                    (total, section) => total + section.lectures.length,
                    0,
                  )}{" "}
                  lectures
                </span>
              </div>

              <Accordion
                type="single"
                collapsible
                className="border rounded-md"
              >
                {course?.sections?.map((section, index) => (
                  <AccordionItem
                    value={`item-${index}`}
                    key={section._id}
                    className="px-4"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 cursor-pointer">
                      <span className="font-semibold text-left">
                        {section.sectionTitle}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      {section.lectures.map((lecture) => (
                        <div
                          key={lecture._id}
                          className="flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            {lecture.isPreviewFree ? (
                              <PlayCircle size={18} className="text-blue-600" />
                            ) : (
                              <Lock size={18} className="text-gray-400" />
                            )}
                            <span className="text-gray-700 dark:text-gray-300 transition-colors">
                              {lecture.lectureTitle}
                            </span>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* RIGHT COLUMN: Floating Purchase Card */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-10 z-10">
              <Card className="overflow-hidden shadow-2xl border-none ring-1 ring-gray-200 dark:ring-gray-800">
                <div className="aspect-video w-full bg-black flex items-center justify-center relative group">
                  {videoUrl ? (
                    <ReactPlayer
                      src={videoUrl}
                      width="100%"
                      height="100%"
                      controls={true}
                    />
                  ) : (
                    <div className="text-white text-center p-4">
                      <PlayCircle
                        size={48}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p className="text-sm font-medium">
                        Preview not available
                      </p>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold">
                      ₹{course.coursePrice}
                    </span>
                    <span className="text-gray-500 line-through text-lg">
                      ₹{course.coursePrice * 2}
                    </span>
                    <span className="text-orange-600 font-bold">50% off</span>
                  </div>

                  <div className="space-y-3">
                    {purchased ? (
                      <button
                        onClick={() => navigate(`/course-progress/${courseId}`)}
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 transition-all cursor-pointer"
                      >
                        Go to Course
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <BuyCourseButton courseId={courseId} />
                        <p className="text-center text-xs text-gray-500 mt-2">
                          30-Day Money-Back Guarantee
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <p className="font-bold text-sm mb-2">
                      This course includes:
                    </p>
                    <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        {" "}
                        <PlayCircle size={14} /> On-demand video
                      </li>
                      <li className="flex items-center gap-2">
                        {" "}
                        <Users size={14} /> Lifetime access
                      </li>
                      <li className="flex items-center gap-2">
                        {" "}
                        <Calendar size={14} /> Access on mobile and TV
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
