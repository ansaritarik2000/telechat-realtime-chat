import React, { useEffect, useState } from "react";
import Crumb from "../../components/Breadcrumb/Crumb";
import TabsSwitcher from "./Tabs/TabsSwitcher";
import { useTranslation } from "react-i18next";
import {
    Chip,
    Button,
    Modal,
    ModalHeader,
    ModalContent,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Divider,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import ProfileInfo from "./Tabs/Profile/ProfileInfo";
import {
    getProfileDetailsService,
    updateProfileService,
} from "../../services/profile/profileService";
import { useProfileStore } from "../../store/profile/profileStore";
import AvatarIndex from "../../components/AvatarGen/Index";
import { ProfileInfoSkeleton } from "../../components/Common/ShimmerUI/Index";

export default function ProfilePage() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { t } = useTranslation();
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(true);

    const {
        business_name,
        email,
        first_name,
        last_name,
        phone_no,
        country_dial_code,
        role,
        avatar_type,
        isProfileChanged,
        avatar_value,
        setCountryDialCode,
        setRelMngEmail,
        setRelMngPhone,
        setRelMngCountryDialCode,
        setRelMngName,
        setRole,
        setPhoneNo,
        setLastName,
        setFirstName,
        setEmail,
        setBusinessName,
        setAvatarType,
        setAvatarValue,
        setIsProfileChanged,
        resetSubAccounts,
    } = useProfileStore();

    // Handle Save Profile
    const handleSaveProfile = async () => {
        try {
            const response = await updateProfileService(
                {
                    first_name,
                    last_name,
                    email,
                    phone_no,
                    business_name,
                    avatar_type,
                    avatar_value,
                },
                token
            ); // Call your service

            console.log("response", response);
            if (response.status === "SUCCESS") {
                addToast({
                    color: "success",
                    title: "Profile updated successfully",
                });

                const response = await fetchProfileDetails();
                setIsProfileChanged(false);
                onClose(); // Close the modal
            } else {
                addToast({
                    color: "danger",
                    title: "Failed to update profile",
                });
            }
        } catch (error) {
            addToast({
                color: "danger",
                title: "Error while updating profile",
            });
        }
    };

    // Function to fetch profile details
    const fetchProfileDetails = async () => {
        const response = await getProfileDetailsService(token);

        if (response.status === "SUCCESS") {
            const profileData = response.data;
            setIsLoading(false);
            setRelMngEmail(profileData.rel_mng_email),
                setRelMngPhone(profileData.rel_mng_phone),
                setRelMngCountryDialCode(profileData.rel_mng_country_dial_code),
                setRelMngName(profileData.rel_mng_name),
                setAvatarValue(profileData.avatar_value),
                setAvatarType(profileData.avatar_type),
                setRole(profileData.role),
                setPhoneNo(profileData.phone_no),
                setCountryDialCode(profileData.country_dial_code),
                setLastName(profileData.last_name),
                setFirstName(profileData.first_name),
                setAvatarType(profileData.avatar_type);
            setAvatarValue(profileData.avatar_value);
            setEmail(profileData.email),
                setBusinessName(profileData.business_name);
        } else {
            console.error(response.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfileDetails();
        }
    }, [token]);

    useEffect(() => {
        setAvatarValue(`${first_name}${last_name ? " " : ""}${last_name}`);
    }, [first_name, last_name]);

    console.log("avatar_type", avatar_type);

    return (
        <div className="flex flex-col gap-4 ">
            <Crumb secondSib={t("Profile Settings")} />

            <div>
                {/* Card */}
                <Card
                    // isFooterBlurred
                    className="w-full h-[300px] col-span-12 sm:col-span-5 z-0 relative"
                >
                    <CardHeader className="absolute z-30 top-1 right-0 flex justify-end">
                        {/* Edit Logo */}
                        <div
                            className="justify-end mr-2 mt-2 self-start"
                            onClick={onOpen}
                        >
                            <Button
                                size="sm"
                                radius="full"
                                variant="bordered"
                                color="success"
                                className="text-white"
                                startContent={
                                    <Icon
                                        icon={
                                            "material-symbols:person-edit-outline"
                                        }
                                        width={"1.4em"}
                                    />
                                }
                                onPress={onOpen}
                            >
                                Edit Info
                            </Button>

                            {/* Profile Edit Modal */}
                            <Modal
                                isOpen={isOpen}
                                onClose={onClose}
                                onOpenChange={onOpenChange}
                                placement="top-center"
                                size="xl"
                            >
                                <ModalContent>
                                    {(onClose) => (
                                        <ModalContent>
                                            <ModalHeader className="flex flex-col gap-1">
                                                {t("Profile Info")}
                                            </ModalHeader>
                                            <ModalBody>
                                                {/* Component */}
                                                <ProfileInfo />
                                                <Divider />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    variant="light"
                                                    color="danger"
                                                    radius="sm"
                                                    onPress={() => {
                                                        onClose();
                                                    }}
                                                >
                                                    {t("Cancel")}
                                                </Button>
                                                <Button
                                                    variant="flat"
                                                    color={"success"}
                                                    radius="sm"
                                                    isDisabled={
                                                        !isProfileChanged
                                                    }
                                                    onPress={handleSaveProfile}
                                                >
                                                    {t("Save")}
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    )}
                                </ModalContent>
                            </Modal>
                        </div>
                    </CardHeader>

                    {/* Card Body */}
                    <CardBody className="relative z-10">
                        {/* Bg Image */}
                        <div className="opacity-90">
                            <Image
                                removeWrapper
                                alt="Card example background"
                                className="absolute top-0 left-0  object-cover w-full h-full z-0"
                                src="profile-endless-constellation.svg"
                            />
                        </div>

                        {/* Avatar + Info */}
                        <div className="flex gap-4 z-10 items-center h-full ml-[3em]">
                            {!isLoading && (
                                <>
                                    <div className="p-8">
                                        <AvatarIndex
                                            value={
                                                avatar_value ||
                                                `${first_name}${
                                                    last_name ? " " : ""
                                                }${last_name}`
                                            } // Pass computed initials as value
                                            avatarType={avatar_type}
                                            shadow={true}
                                            size={150}
                                            border={false}
                                            borderSize={3}
                                            borderColor={"#14A44D"}
                                            isEditable={false}
                                        />
                                    </div>
                                    {/* Text Info */}
                                    <div className="flex flex-col gap-1">
                                        {/* Business Name */}
                                        <p className="text-3xl text-white font-semibold">
                                            {business_name}
                                        </p>

                                        <div className="flex flex-col gap-6 text-white ">
                                            <div className="flex gap-2 items-center">
                                                {/* Person Name */}
                                                <p className="text-2xl capitalize font-medium">
                                                    {first_name} {last_name}
                                                </p>
                                                <Chip
                                                    size="sm"
                                                    variant="shadow"
                                                    className="capitalize "
                                                    color="success"
                                                >
                                                    {role === "superadmin"
                                                        ? "Super Admin"
                                                        : role}
                                                </Chip>
                                            </div>

                                            <div className="text-sm items-center  flex gap-4 mt-2">
                                                <span className="items-center justify-center flex gap-1">
                                                    <Icon
                                                        icon="iconamoon:email-duotone"
                                                        width={"1.3em"}
                                                        className="text-success"
                                                    />
                                                    {email}
                                                </span>

                                                <span className="items-center justify-center flex gap-1">
                                                    <Icon
                                                        icon="ph:phone-duotone"
                                                        width={"1.3em"}
                                                        className="text-success"
                                                    />
                                                    {phone_no}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ProfileInfoSkeleton */}
                            {isLoading && (
                                <div className="w-full ml-[2.5em]">
                                    <ProfileInfoSkeleton />
                                </div>
                            )}
                        </div>
                    </CardBody>

                    <CardFooter className="absolute bg-white dark:bg-content2 bottom-0 border-t-1 dark:border-none h-[3.5em] border-zinc-100/50 z-10 justify-between">
                        <span></span>
                    </CardFooter>
                </Card>

                {/* Tabs */}
                <div className="-mt-14">
                    <TabsSwitcher />
                </div>
            </div>
        </div>
    );
}
