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

const RadioInfoContent = () => {
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
          <div className="text-sm font-bold mb-2">
            This agent sends a combination of transactional and promotional
            messages. For e.g
          </div>
          <ul className="text-xs list-inside pl-4">
            <CheckItem text="A transaction that leads to related promotions or sales" />
            <CheckItem
              text=" A promotion that leads to a purchase, payment confirmation,
              shipping notifications."
            />
            <CheckItem
              text=" A promotion that leads to an account creation, regular account
              updates, notifications & reminders."
            />

            <CheckItem
              text={
                "Delivery of pins, passwords, and passcodes for completing transactions."
              }
            />
          </ul>

          {/* Second Section */}
          <div className=" py-4">
            <div className="text-sm font-bold mb-2">
              This agent doesn’t include:
            </div>

            <ul className="list-inside pl-4">
              <CheckItem text="OTP / 2FA for account log-in" />
              <CheckItem text=" Password resets & any other information for secure account access" />
              <CheckItem text=" Transactional-only use messages" />
              <CheckItem text=" Promotional-only use messages" />
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RadioInfoContent;
