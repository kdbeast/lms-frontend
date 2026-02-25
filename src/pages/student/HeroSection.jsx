import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-linear-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-900 py-36 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Upskill with our wide range of courses
        </p>

        <Button
          onClick={() => navigate(`/course/search`)}
          className="bg-white dark:bg-gray-700 text-blue-600 dark:text-white px-6 py-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
