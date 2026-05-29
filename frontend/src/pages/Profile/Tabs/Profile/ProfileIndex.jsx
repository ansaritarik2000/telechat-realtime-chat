import { useState, useEffect } from "react";
import { Divider } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import PasswordChange from "./PassChange";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "../../../../store/profile/profileStore";
import AvatarIndex from "../../../../components/AvatarGen/Index";
import {
  Minipfp,
  NameSkeleton,
} from "../../../../components/Common/ShimmerUI/Index";

export default function Profile() {
  // zustand store
  const { rel_mng_name, rel_mng_phone, rel_mng_email } = useProfileStore();

  const { t } = useTranslation();

  // Get Initial of subAccountName only function
  const getInitials = (name) => {
    // const parts = name.split(" ");
    // let initials = parts.map((part) => part.charAt(0)).join("");
    // return initials;

    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex gap-4 justify-between">
      {/* Left Section  */}

      {/* Password Area */}
      <div className="flex flex-col gap-6 w-1/2">
        <PasswordChange />
      </div>

      {/* Right Section */}

      <div className="w-1/2 ">
        <div className=" flex flex-col gap-6 w-fit ">
          {/* Card */}
          <div className="rounded-lg border-1 border-success bg-gradient-to-r from-green-50 dark:from-success-50/80 to-green-200 dark:to-success-100 dark:border-success-300 w-full py-4 px-5">
            <div className="flex justify-between gap-2 items-center w-full">
              {/* Avatar + Info */}
              <div className="flex  gap-4 w-full items-center p-6 ">
                {/* Left Avatar */}
                <div className="flex items-center ">
                  <div className=" rounded-full  h-30 w-30">
                    {/* Circle Custom Tailwind Avatar with text initial */}
                    <div className=" flex items-center justify-center shadow-sm rounded-full ">
                      {/* Shimmer PFP */}
                      {!rel_mng_name && <Minipfp />}

                      {/* Avatar */}
                      {rel_mng_name && (
                        <AvatarIndex
                          value={rel_mng_name} // Pass computed initials as value
                          avatarType={"character"}
                          shadow={true}
                          size={80}
                          border={false}
                          borderSize={3}
                          borderColor={"#14A44D"}
                          isEditable={false}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Text Info Right */}
                <div className="flex flex-col  ">
                  <p className="text-lg capitalize text-primary-700 font-semibold -mb-1">
                    {!rel_mng_name && (
                      <div className="mb-2">
                        <NameSkeleton />
                      </div>
                    )}

                    {rel_mng_name}
                  </p>

                  {/* Subheading */}
                  <p className="text-[0.7em] text-default-600 mb-1">
                    {`${t("Your Relationship Manager")}`}
                  </p>

                  <div className="flex flex-col gap-1">
                    <Divider />

                    {/* Contact Icons */}
                    <div className="text-sm items-center gap-11 flex ">
                      <a href={`tel:${rel_mng_phone}`}>
                        <Icon
                          icon="solar:outgoing-call-rounded-bold-duotone"
                          width={"1.6em"}
                          className="text-primary-700"
                        />
                      </a>
                      {/* Whatsapp */}
                      <a href={`https://wa.me/${rel_mng_phone}`}>
                        <Icon icon="logos:whatsapp-icon" width={"1.5em"} />
                      </a>

                      {/* Email */}
                      <a href={`mailto:${rel_mng_email}`}>
                        <Icon icon="skill-icons:gmail-light" width={"1.5em"} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
