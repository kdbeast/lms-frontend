import { useState } from "react";
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
  selectedCategories: initialSelectedCategories,
  sortByPrice: initialSortByPrice,
}) => {
  const [sortByPrice, setSortByPrice] = useState(initialSortByPrice || "");
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [selectedCategories, setSelectedCategories] = useState(
    initialSelectedCategories || [],
  );

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];
      onFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    onFilterChange(selectedCategories, selectedValue);
  };

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler}>
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
      <Separator className="my-4" />
      <div className="mb-4 px-2">
        <h1 className="font-semibold mb-2">{`Price Range ₹${priceRange[0]}-₹${priceRange[1]}`}</h1>
        <Slider
          max={5000}
          step={500}
          value={priceRange}
          defaultValue={[25, 50]}
          onValueChange={(value) => setPriceRange(value)}
        />
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
            onFilterChange([], ""); // Clear filters in parent component
            setSelectedCategories([]);
            setSortByPrice("");
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
