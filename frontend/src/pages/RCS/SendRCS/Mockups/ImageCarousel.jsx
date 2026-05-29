import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import "../../../../assets/css/carouselStyles.css"; // Include your custom CSS
import RichCard from "./RichCard";
import { useRcsStore } from "../../../../store/rcsStore";

const ImageCarousel = ({ items = [] }) => {
  const { currentSlide, setCurrentSlide } = useRcsStore();

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative">
      {/* Carousel */}
      <Carousel
        width={245}
        showThumbs={false}
        showIndicators={false} // Hide default indicators
        showArrows={true}
        infiniteLoop={true}
        autoPlay={false}
        className="custom-carousel"
        selectedItem={currentSlide}
        onChange={handleSlideChange}
      >
        {items?.map((item, index) => (
          <div key={index}>
            <RichCard
              title={item.title || item.card_heading}
              buttons={item.buttons || item.action_buttons}
              description={item.description || item.card_subheading}
              imageUrl={item.imageUrl || item.thumbnailUrl}
            />
          </div>
        ))}
      </Carousel>

      {/* Custom Indicators */}
      <div className="custom-carousel-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full  ${
              currentSlide === index ? "bg-gray-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
