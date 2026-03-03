/* eslint-disable react-hooks/exhaustive-deps */
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../../components/ui/button";
import { Link, useSearchParams } from "react-router";
import { Skeleton } from "../../components/ui/skeleton";
import { useSearchCoursesQuery } from "../../features/api/courseApi";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("keyword") || "";
  const categories = searchParams.get("category");
  const sortByPrice = searchParams.get("sortByPrice") || "";
  const priceRange = searchParams.get("priceRange") || "";

  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useSearchCoursesQuery({
    searchQuery: query,
    categories,
    sortByPrice,
    priceRange,
  });

  const isEmpty = !isLoading && data?.courses?.length === 0;
  const DEFAULT_PRICE_RANGE = [0, 15000];

  const handleFilterChange = (
    categories = [],
    sortByPrice = "",
    priceRange,
    keyword = searchQuery,
  ) => {
    const params = {};

    if (categories.length > 0) params.category = categories.join(",");
    if (sortByPrice) params.sortByPrice = sortByPrice;
    const isDefaultPrice =
      Array.isArray(priceRange) &&
      priceRange[0] === DEFAULT_PRICE_RANGE[0] &&
      priceRange[1] === DEFAULT_PRICE_RANGE[1];

    if (priceRange && !isDefaultPrice) {
      params.priceRange = JSON.stringify(priceRange);
    }
    if (keyword && keyword.trim() !== "") params.keyword = keyword;

    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // when user stops typing, update URL
      handleFilterChange(
        categories ? categories.split(",") : [],
        sortByPrice,
        priceRange ? JSON.parse(priceRange) : undefined,
        searchQuery,
      );
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer); // cancel previous timer
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <form className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Search Courses"
        />
      </form>

      {query && (
        <div className="my-6">
          <h1 className="font-bold text-xl md:text-2xl">
            {data?.courses?.length || 0} result {query}
          </h1>
          <p>
            Showing results for{" "}
            <span className="text-blue-800 font-bold italic">{query}</span>
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-10">
        <Filter
          onFilterChange={handleFilterChange}
          initialCategories={categories}
          initialSort={sortByPrice}
          initialPriceRange={priceRange}
        />
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses?.map((course) => (
              <SearchResult key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/" className="italic">
        <Button variant="link">Browse All Courses</Button>
      </Link>
    </div>
  );
};

const CourseCardSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 mt-2" />
      </div>

      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  );
};
