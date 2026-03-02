import { CarouselDemo } from "./Carousel";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-linear-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT: TEXT */}
          <div className="text-center md:text-left">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Find the Best Courses for You
            </h1>

            <p className="text-gray-200 dark:text-gray-400 mb-8 text-lg">
              Discover, learn, and upskill with our wide range of courses.
            </p>

            <Button
              onClick={() => navigate("/course/search")}
              className="bg-white text-blue-600 hover:bg-gray-300 px-8 py-4 rounded-full font-semibold cursor-pointer"
            >
              Explore Courses
            </Button>
          </div>

          {/* RIGHT: CAROUSEL */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
              <CarouselDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
