import { Button } from "@heroui/react";
import React from "react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

const SelectTemplateButton = (props) => {
  const { t } = useTranslation();
  const { openTemplateModal, templateType, color = "primary" } = props;
  return (
    <Button
      size="md"
      variant="bordered"
      radius="sm"
      color={color}
      className="py-4"
      onPress={() => openTemplateModal(templateType)}
      startContent={
        <Icon
          icon="codicon:layout"
          width={"1.8em"}
          // Color should be dynamic {color} i.e text-$[color]
          className={`text-${color}`}
        />
      }
    >
      {t("Select Template")}
    </Button>
  );
};

export default SelectTemplateButton;
