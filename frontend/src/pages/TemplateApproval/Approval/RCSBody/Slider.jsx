import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { useRcsStore } from "../../../../store/rcsStore";
import "../../../../assets/css/carouselStyles.css";

const Slider = ({ sections }) => {
    const { currentSlide, setCurrentSlide } = useRcsStore();

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative">
            {/* Carousel */}
            <Carousel
                showThumbs={false}
                showIndicators={false} // Hide default indicators
                showArrows={false}
                infiniteLoop
                autoPlay={false}
                className="custom-carousel"
                selectedItem={currentSlide}
                onChange={handleSlideChange}
                statusFormatter={() => null} // Disable the "1 of 2" text
            >
                {sections &&
                    sections.length > 0 &&
                    sections.map((section, index) => (
                        <div key={index}>{section}</div>
                    ))}
            </Carousel>

            {/* Custom Indicators */}
            <div className="custom-carousel-indicators">
                {sections &&
                    sections.length > 0 &&
                    sections.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full mx-1 border border-success ${
                                currentSlide === index
                                    ? "bg-green-400"
                                    : "bg-white"
                            }`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Slider;
