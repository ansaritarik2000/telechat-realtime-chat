import React, { useState } from "react";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";
const CarouselUpload = () => {
    const {setCarouselItems, carouselItems,removeCarouselItems}  = useWhatsappTemplateStore();
  const [images, setImages] = useState([]); 
  const fileLimit = 3000000; // 3MB limit

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= fileLimit);

    if (validFiles.length !== files.length) {
      alert("Some files exceeded the 3MB limit and were not added.");
    }
    setImages((prev) => [...prev, ...validFiles]);
    const previewUrls = validFiles.map((file) => URL.createObjectURL(file));
    // setCarouselItems({imageUrl:[...previewUrls]})
  };
   console.log("carouselItems: ", carouselItems)
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => file.size <= fileLimit);
    
    if (validFiles.length !== files.length) {
      alert("Some files exceeded the 3MB limit and were not added.");
    }
    
    setImages((prev) => [...prev, ...validFiles]);
  };

//   const removeImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     const updateImgUrl = carouselItems?.imageUrl?.filter((img,ind)=> ind !== index)
//     removeCarouselItems({
//         imageUrl : updateImgUrl
//     })
//   };

  return (
    <>
    <div className="w-1/2 flex flex-col items-center border border-gray-300 rounded-lg p-6 bg-white shadow-md">
      <form className="w-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
        <div    
          className="w-full h-40 border-dashed border-2 border-blue-300 rounded-lg flex flex-col items-center justify-center relative mb-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-cloud-upload mb-2 black-500"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
              <path d="M9 15l3 -3l3 3" />
              <path d="M12 12l0 9" />
            </svg>
          </div>
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <p className="text-gray-500 text-sm">Drag & drop or click to upload images (JPEG, PNG)</p>
        </div>

        {/* Uploaded Images Preview */}
        <div className="flex flex-wrap gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative w-24 h-24 border rounded-lg overflow-hidden"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full"
                onClick={() => removeImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
 
    </>
  );
};

export default CarouselUpload;

