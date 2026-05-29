import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Icon } from "@iconify-icon/react";

export default function CreateBtn(props) {
  const {
    IconComponent = <Icon icon="tdesign:plus" width="1.5em" height="1.5em" />,
    Text = "Create",
    Color = "success",
    Variant = "solid",
    Path = "#",
  } = props;

  return (
    <div>
      <Link to={Path}>
        <Button
          color={Color}
          variant={Variant}
          startContent={IconComponent}
          radius="sm"
        >
          {Text}
        </Button>
      </Link>
    </div>
  );
}
