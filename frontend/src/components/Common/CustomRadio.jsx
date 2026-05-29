import { Radio, cn } from "@heroui/react";

const CustomRadio = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex items-center justify-between  ",
          "flex-row-reverse w-[300px] cursor-pointer rounded-lg mr-3 gap-4 p-1 border-1 border-transparent",
          "data-[selected=true]:border-primary",
          "bg-content1 hover:bg-content2 4"
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default CustomRadio;
