import { Icon } from "@iconify/react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";

const CheckItem = ({ text }) => {
  return (
    <li className="flex items-center">
      <Icon
        icon="humbleicons:check-circle"
        width="15"
        height="15"
        className="mr-1 text-success"
      />
      <p className="text-sm">{text}</p>
    </li>
  );
};

const RadioInfoContent = ({typeValue}) => {
  return (
    <Popover showArrow placement="bottom" backdrop="blur">
      <PopoverTrigger>
        <Button isIconOnly variant="none" radius="full" size="sm">
          <Icon icon="formkit:info" width="16" height="16" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-2 py-4">
          {/* First section */}
          {typeValue ==="custom" ? (
            <>
            <div className="text-sm font-bold mb-2">
            Custom
            </div>
            <ul className="text-xs list-inside">
             <CheckItem
                text="Send promotional offers, announcements and more to increase awareness and engagement"
              />
              
            </ul>
            </>
          ): typeValue ==="product_messages"? (
            <>
            <div className="text-sm font-bold mb-2">
            Product Messages
            </div>
            <ul className="text-xs list-inside pl-4">
             <CheckItem
                text="Send message about your entire catalogue or multiple product from it"
              />
            </ul>
            </>
          ) : typeValue ==="lto"? (
            <>
            <div className="text-sm font-bold mb-2">
            LTO
            </div>
            <ul className="text-xs list-inside pl-4">
             <CheckItem
                text="Limited-time offer templates allow you to display expiration dates and running countdown timers for offer codes in template messages"
              />
              
            </ul>
            </>
          ): typeValue ==="catalogue"? (
            <>
            <div className="text-sm font-bold mb-2">
            Catalogue message
            </div>
            <ul className="text-xs list-inside pl-4">
             <CheckItem
                text="Include the entire catalogue to give your users a comprehensive view of all of your products"
              />
              
            </ul>
            </>
          ): typeValue ==="multi_product"? (
            <>
            <div className="text-sm font-bold mb-2">
            Multi-product messages
            </div>
            <ul className="text-xs list-inside pl-4">
             <CheckItem
                text="Include upto 30 products from the catalogue. Useful for showcasing new collection or a specific product category"
              />
              
            </ul>
            </>
          ): null }
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RadioInfoContent;
