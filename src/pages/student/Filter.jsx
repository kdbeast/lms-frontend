/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Separator } from "../../components/ui/separator";
import { Slider } from "@/components/ui/slider";

const categories = [
  { id: "Next JS", label: "Next JS" },
  { id: "Data Science", label: "Data Science" },
  { id: "Frontend Development", label: "Frontend Development" },
  { id: "Fullstack Development", label: "Fullstack Development" },
  { id: "MERN Stack Development", label: "MERN Stack Development" },
  { id: "Backend Development", label: "Backend Development" },
  { id: "Javascript", label: "Javascript" },
  { id: "Python", label: "Python" },
  { id: "Docker", label: "Docker" },
  { id: "MongoDB", label: "MongoDB" },
  { id: "HTML", label: "HTML" },
];

const Filter = ({
  onFilterChange,
  initialCategories,
  initialSort,
  initialPriceRange,
}) => {
  const [sortByPrice, setSortByPrice] = useState(initialSort || "");
  const [priceRange, setPriceRange] = useState(
    initialPriceRange ? JSON.parse(initialPriceRange) : [0, 5000],
  );
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategories ? initialCategories.split(",") : [],
  );

  const handleCategoryChange = (catId) => {
    const updated = selectedCategories.includes(catId)
      ? selectedCategories.filter((id) => id !== catId)
      : [...selectedCategories, catId];

    setSelectedCategories(updated);
  };

  const selectByPriceHandler = (val) => {
    setSortByPrice(val);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(selectedCategories, sortByPrice, priceRange);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategories, sortByPrice, priceRange]);

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler} value={sortByPrice}>
          <SelectTrigger className="w-25">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By Price</SelectLabel>
              <SelectItem value="lowest">Lowest</SelectItem>
              <SelectItem value="highest">Highest</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <button
        onClick={() => {
          setSortByPrice("");
        }}
        className="text-sm text-blue-500 hover:underline mt-6"
      >
        Clear
      </button>
      <Separator className="my-4" />
      <div className="mb-4 px-2">
        <h1 className="font-semibold mb-2">{`Price ₹${priceRange[0]}-₹${priceRange[1]}`}</h1>
        <Slider
          max={5000}
          step={500}
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value);
          }}
        />
        <button
          onClick={() => {
            setSortByPrice("");
            setPriceRange([0, 5000]);
          }}
          className="text-sm text-blue-500 hover:underline mt-6"
        >
          Clear
        </button>
      </div>
      <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.label}
            </label>
          </div>
        ))}
        <button
          onClick={() => {
            setSelectedCategories([]);
          }}
          className="text-sm text-blue-500 hover:underline mt-6"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filter;
