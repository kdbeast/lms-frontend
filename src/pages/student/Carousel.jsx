import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  "/css.png",
  "/docker.png",
  "/html.jpg",
  "/javascript.png",
  "/mern.webp",
  "/mongo.png",
  "/next.jpg",
];

export function CarouselDemo() {
  const [api, setApi] = useState(null);
  const autoplayRef = useRef(null);

  useEffect(() => {
    if (!api) return;

    autoplayRef.current = setInterval(() => {
      api.scrollNext();
    }, 3000); // ⏱️ 3 seconds

    return () => clearInterval(autoplayRef.current);
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      className="max-w-md h-full lg:ml-5"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-500 border-0 cursor-pointer" />
      <CarouselNext className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-500 border-0 cursor-pointer" />
    </Carousel>
  );
}
