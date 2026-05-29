import React, { useEffect, useState } from "react";
import WhatsappCard from "../../../../../TeleApps/FlowBuilder/TemplatePreview/WhatsAppCard";
import SearchInput from "../../../../../../components/Buttons/Search";
import { t } from "i18next";
import { useSendWhatsappStore } from "../../../../../../store/whatsapp/whatsappStore";
import { Select, SelectItem } from "@heroui/react";
import { getTemplateTypesService } from "../../../../../../services/Whatsapp/template/templateServices";
import toast from "react-hot-toast";

const WhatsappTemplate = () => {
  const { selectedSendTemplate } = useSendWhatsappStore();
  const [templateTypes, setTemplateTypes] = useState([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // get template types
      const getTemplateTypes = async () => {
        const response = await getTemplateTypesService({ token });
        if (response.status === "SUCCESS") {
          setTemplateTypes(response.data);
        } else {
          toast.error(response.message || "Something went wrong");
        }
      };
      getTemplateTypes();
    }
  }, [token]);
  console.log("selectedSendTemplate", selectedSendTemplate);
  // hard coded whatsapp templates
  const whatsappTemplates = [
    {
      id: 1,
      name: "Restaurant Reservation",
      card_heading: "Book a Table at {{var1}} Restaurant",
      card_subheading:
        "Reserve a table at your favorite restaurant today. Enjoy delicious meals with great ambiance {{var2}}.",
      imageUrl:
        "https://www.deonde.co/blog/wp-content/uploads/2022/04/Restaurant-Reservation-System-Features-1024x538.png",

      action_buttons: [
        {
          id: 1,
          created_at: "2024-09-27T07:14:08.905112+00:00",
          type: "reply",
          suggestion_text: "stop",
          postback: "stop",
        },
      ],
      status: "approved",
    },
    {
      id: 2,
      name: "Product Promotion",
      card_heading: "Exclusive Deal on Smartwatches",
      card_subheading:
        "Get up to 30% off on the latest smartwatches. Limited-time offer!",
      imageUrl:
        "https://img.freepik.com/free-vector/website-promotion-concept-online-business-promotion-with-commercial-campaign-product-digital-advertising-social-media-marketing-isolated-flat-vector-illustration_613284-1993.jpg",
      type: "singleimg",
    },
    {
      id: 3,
      name: "Product Research",
      card_heading: "Exclusive Deal on Smartwatches",
      card_subheading:
        "Get up to 30% off on the latest smartwatches. Limited-time offer!",
      imageUrl:
        "https://img.freepik.com/free-vector/website-promotion-concept-online-business-promotion-with-commercial-campaign-product-digital-advertising-social-media-marketing-isolated-flat-vector-illustration_613284-1993.jpg",
      type: "singleimg",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-[280px]">
          <SearchInput Placeholder={t("Search...")} />
        </div>
        <div className="w-[280px]">
          <Select
            onSelectionChange={setSelectedTemplateType}
            selectedKeys={selectedTemplateType}
            defaultSelectedKeys={[6]}
            labelPlacement="outside-left"
            size="md"
            label="Filter by"
          >
            {templateTypes?.map((templateType) => (
              <SelectItem key={templateType?.id} value={templateType?.id}>
                {templateType?.template_type_name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
        {whatsappTemplates.map((template, index) => (
          <WhatsappCard
            key={index}
            template={template}
            selected={selectedSendTemplate?.template_id === template?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default WhatsappTemplate;
