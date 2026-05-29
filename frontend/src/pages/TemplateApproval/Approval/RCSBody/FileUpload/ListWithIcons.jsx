import { Icon } from "@iconify/react";
import { useImageUploadStore } from "../../../../../store/templateApprovalStore";

export const ListWithIcons = () => {
  const { imageUploadconditons } = useImageUploadStore();

  return (
    <div className="w-1/3 ml-4">
      <div className="flex items-center text-sm font-medium text-gray-700">
        <span>Instructions</span>
        <Icon icon="mdi:information" className="text-lg ml-1 text-gray-500" />
      </div>

      <ul className="space-y-2 ">
        {imageUploadconditons.map((item, index) => (
          <li
            key={index}
            className={`flex items-center rounded-xl text-xs p-2 ${
              item.condition
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Icon icon="ph:tilde-thin" className="text-sm mr-2 text-gray-500" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
