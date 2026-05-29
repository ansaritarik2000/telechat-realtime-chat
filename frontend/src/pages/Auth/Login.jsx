import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Checkbox, Link, Image } from "@heroui/react";
import { IPInfoContext } from "ip-info-react";
import { Icon } from "@iconify/react";
import { AnimatePresence, m, domAnimation, LazyMotion } from "framer-motion";
import PhoneVerification from "./PhoneVerification";
import EmailVerification from "./EmailVerification";
import AdminReset from "./AdminVerification";
import SocialMediaFooter from "./SocialMediaFooter";
import FirstTimeLoginForm from "./FirstTimeLoginForm";
import LeftColContent from "./LeftColContent";
import { loginService } from "../../services/auth/loginService";
import { updateIpInfoService } from "../../services/profile/profileService";

export default function LoginAuth() {
    const [isVisible, setIsVisible] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
    const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
    const [resetMethod, setResetMethod] = useState(null);
    const navigate = useNavigate();
    const [authValue, setAuthValue] = useState({
        email: "",
        password: "",
    });
    const { email, password } = authValue;
    const userInfo = useContext(IPInfoContext);

    console.log("userInfo", userInfo);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const variants = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 10 },
    };

    // this function is used for update ip info
    const updateIpInfo = async (token) => {
        const { ip, city, country_name, region } = userInfo;
        try {
            // ip info data
            const ipInfoData = {
                ip,
                city,
                country: country_name,
                region,
            };
            const response = await updateIpInfoService(ipInfoData, token);
            if ((response.status = "SUCCESS")) {
                console.log("Ip info updated succesfully");
            } else {
                console.log("Ip info update failed.");
            }
        } catch (error) {
            console.log("update ip info error:", error);
        }
    };

    // login handller
    const loginHandller = async (e) => {
        e.preventDefault();
        try {
            if (showTwoFactorAuth) {
                // Show 2FA form instead of proceeding with login
                setShowTwoFactorAuth(true);
                return;
            }

            const response = await loginService(authValue); // Call login service
            console.log(response);

            if (response.status === "SUCCESS") {
                localStorage.setItem("loginUser_id", response.user.id); // handling for chat
                localStorage.setItem("token", response.token); // Store token in localStorage
                localStorage.setItem("first_name", response.user.first_name);
                localStorage.setItem("last_name", response.user.last_name);
                localStorage.setItem("role", response.user.role);
                localStorage.setItem("avatar_type", response.user.avatar_type);
                localStorage.setItem(
                    "avatar_value",
                    response.user.avatar_value
                );
                localStorage.setItem("user_id", response.user.id);

                if (rememberMe) {
                    localStorage.setItem("email", email);
                    localStorage.setItem("password", password);
                } else {
                    localStorage.removeItem("email");
                    localStorage.removeItem("password");
                }

                // this function is calling for update ip info
                updateIpInfo(response.token);
                navigate("/"); // Redirect to home page
            } else {
                // Display error message (you can use a notification or toast here)
                console.error(response.message);
            }
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");

        if (savedEmail && savedPassword) {
            setAuthValue({ email: savedEmail, password: savedPassword });
            setRememberMe(true);
        }
    }, []);

    return (
        <div
            className={`relative overflow-hidden flex h-screen w-screen items-center justify-center `}
            style={{
                backgroundImage: "url(login-bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundBlendMode: "overlay",
            }}
        >
            {/* Left Mockup Section */}
            <div className="w-1/2 h-full pl-4 flex flex-col items-start justify-between relative">
                {/* Logo */}
                <Image
                    src="logo-dark.svg"
                    width={150}
                    height={150}
                    radius="none"
                    className="-mt-10"
                />

                {/* Mockup */}
                <div className="flex justify-end w-full pl-32 -mt-20 z-40">
                    <LeftColContent />
                </div>

                {/* Bg Glow */}
                <div className="bottom-0 absolute  ">
                    <Image
                        src="login-green-glow.png"
                        weight="50"
                        height="50"
                        alt="Green Glow"
                        className="ml-8"
                    />
                </div>

                <p className="text-sm text-white mb-2">
                    Telepie Technology Pvt. Ltd. © {new Date().getFullYear()}
                </p>
            </div>
            {/* RIght Section: Login Form */}
            <div className="w-1/2 h-full flex justify-center items-center ">
                <div class=" -z-2 flex items-center overflow-hidden rounded-xl p-[2px] min-w-[400px] ">
                    <div
                        className={` h-full   p-2
                    flex flex-col gap-4  px-10 pb-10 py-10 w-full rounded-xl bg-[#3f3f46] z-40 `}
                    >
                        <div className="flex gap-4 items-end mb-4">
                            {/* Header Icon  */}
                            <Image
                                src={
                                    isForgotPassword
                                        ? "reset-password.png"
                                        : "login-profile.png"
                                }
                                width={70}
                                radius="none"
                            />

                            {/* Header Labels */}
                            <div className="flex flex-col justify-end text-gray-50 gap-2">
                                {/* For Login */}
                                {isForgotPassword ? (
                                    <p className="font-semibold text-xl">
                                        Reset Password
                                    </p>
                                ) : (
                                    <p className="font-semibold text-xl">
                                        Welcome{" "}
                                        <span className="animate-wave">👋🏻</span>
                                    </p>
                                )}

                                {/* For Reset Password */}
                                {resetMethod == null && (
                                    <>
                                        {!isForgotPassword ? (
                                            <p className="text-sm text-gray-50/60">
                                                Please Log In to continue
                                            </p>
                                        ) : (
                                            <p className="text-sm">
                                                Proceed to reset the password
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <LazyMotion features={domAnimation}>
                            <AnimatePresence initial={false} mode="popLayout">
                                {/* Handle First Time Login */}

                                {/* {isFirstTimeLogin ? (
                                    <div className="max-w-xs">
                                        <m.div
                                            animate="visible"
                                            exit="hidden"
                                            initial="hidden"
                                            variants={variants}
                                        >
                                            <FirstTimeLoginForm />
                                        </m.div>
                                    </div>
                                ) : null} */}

                                {/* Handle Forgot Password */}
                                {isForgotPassword ? (
                                    resetMethod === null ? (
                                        <m.div
                                            animate="visible"
                                            exit="hidden"
                                            initial="hidden"
                                            variants={variants}
                                        >
                                            <div className="flex flex-col gap-4">
                                                <Button
                                                    onPress={() =>
                                                        setResetMethod("sms")
                                                    }
                                                    radius="sm"
                                                    variant="shadow"
                                                    color="success"
                                                    className="hover:scale-105"
                                                >
                                                    Get SMS Verification Code
                                                </Button>
                                                <Button
                                                    onPress={() =>
                                                        setResetMethod("email")
                                                    }
                                                    radius="sm"
                                                    variant="shadow"
                                                    color="success"
                                                    className="hover:scale-105"
                                                >
                                                    Send Reset Link via Email
                                                </Button>
                                                <Button
                                                    onPress={() =>
                                                        setResetMethod("admin")
                                                    }
                                                    radius="sm"
                                                    variant="shadow"
                                                    color="success"
                                                    className="hover:scale-105"
                                                >
                                                    Send Reset Link to Admin
                                                </Button>
                                                {/* Back To Login */}
                                                <Button
                                                    variant="faded"
                                                    radius="sm"
                                                    onPress={() =>
                                                        setIsForgotPassword(
                                                            false
                                                        )
                                                    }
                                                    className="mt-6 hover:bg-content3 "
                                                    startContent={
                                                        <Icon
                                                            className="text-default-500"
                                                            icon="solar:arrow-left-linear"
                                                            width={18}
                                                        />
                                                    }
                                                >
                                                    Back to Login
                                                </Button>
                                            </div>
                                        </m.div>
                                    ) : resetMethod === "sms" ? (
                                        <m.form
                                            animate="visible"
                                            exit="hidden"
                                            initial="hidden"
                                            variants={variants}
                                            onSubmit={(e) => e.preventDefault()}
                                        >
                                            <PhoneVerification
                                                backAction={() =>
                                                    setResetMethod(null)
                                                }
                                            />
                                        </m.form>
                                    ) : resetMethod === "email" ? (
                                        <m.form
                                            animate="visible"
                                            exit="hidden"
                                            initial="hidden"
                                            variants={variants}
                                            onSubmit={(e) => e.preventDefault()}
                                        >
                                            <EmailVerification
                                                backAction={() =>
                                                    setResetMethod(null)
                                                }
                                            />
                                        </m.form>
                                    ) : (
                                        <m.form
                                            animate="visible"
                                            exit="hidden"
                                            initial="hidden"
                                            variants={variants}
                                            onSubmit={loginHandller}
                                        >
                                            <AdminReset
                                                backAction={() =>
                                                    setResetMethod(null)
                                                }
                                            />
                                        </m.form>
                                    )
                                ) : (
                                    // First login form
                                    <m.form
                                        animate="visible"
                                        className="flex flex-col gap-6"
                                        exit="hidden"
                                        initial="hidden"
                                        variants={variants}
                                        onSubmit={loginHandller}
                                    >
                                        {showTwoFactorAuth ? (
                                            <TwoFactorAuthForm
                                                email={email}
                                                phone="9876543210" // Replace with actual phone from your state
                                                medium="email" // Can be "email", "sms", or "whatsapp"
                                                onVerify={() => {
                                                    setShowTwoFactorAuth(false);
                                                }}
                                                onCancel={() =>
                                                    setShowTwoFactorAuth(false)
                                                }
                                            />
                                        ) : isFirstTimeLogin ? (
                                            <FirstTimeLoginForm />
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                {/* Email Phone Input */}
                                                <Input
                                                    placeholder="Enter Email or Phone Number"
                                                    onChange={(e) =>
                                                        setAuthValue({
                                                            ...authValue,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    value={email}
                                                    name="email"
                                                    type="email"
                                                    radius="sm"
                                                    variant="flat"
                                                    size="lg"
                                                    startContent={
                                                        <Icon
                                                            icon="bi:person-fill"
                                                            width={25}
                                                            className="text-default-400 "
                                                        />
                                                    }
                                                    classNames={{
                                                        inputWrapper: [
                                                            "group-data-[focus=true]:border-success",
                                                            "!cursor-text",
                                                        ],
                                                    }}
                                                />
                                                {/* Password */}
                                                <div className="flex flex-col gap-2">
                                                    <Input
                                                        endContent={
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    toggleVisibility
                                                                }
                                                            >
                                                                {isVisible ? (
                                                                    <Icon
                                                                        className="pointer-events-none text-2xl text-default-400"
                                                                        icon="solar:eye-closed-linear"
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        className="pointer-events-none text-2xl text-default-400"
                                                                        icon="solar:eye-bold"
                                                                    />
                                                                )}
                                                            </button>
                                                        }
                                                        startContent={
                                                            <Icon
                                                                icon="solar:key-minimalistic-square-3-bold"
                                                                width={25}
                                                                className="text-default-400 "
                                                            />
                                                        }
                                                        onChange={(e) =>
                                                            setAuthValue({
                                                                ...authValue,
                                                                password:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        value={password}
                                                        placeholder="Password"
                                                        name="password"
                                                        radius="sm"
                                                        type={
                                                            isVisible
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        variant="flat"
                                                        size="lg"
                                                        classNames={{
                                                            inputWrapper: [
                                                                "group-data-[focus=true]:border-success",
                                                                "!cursor-text",
                                                            ],
                                                        }}
                                                    />
                                                    {/* Checkbox */}
                                                    <div className="flex items-center justify-between px-1 ">
                                                        <Checkbox
                                                            color="primary"
                                                            name="remember"
                                                            size="sm"
                                                            isSelected={
                                                                rememberMe
                                                            }
                                                            onChange={(e) =>
                                                                setRememberMe(
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                        >
                                                            <span className="text-gray-50/60">
                                                                Remember me
                                                            </span>
                                                        </Checkbox>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!showTwoFactorAuth && (
                                            <div className="flex flex-col gap-6 mt-2">
                                                {/* Login Button */}
                                                <Button
                                                    color="success"
                                                    className="w-full text-white hover:scale-105 "
                                                    type="submit"
                                                    variant="shadow"
                                                    radius="sm"
                                                    startContent={
                                                        <Icon
                                                            icon="fluent:key-24-regular"
                                                            width={"1.3em"}
                                                            className="hover:rotate-45"
                                                        />
                                                    }
                                                >
                                                    Log In
                                                </Button>

                                                <div className="text-xs gap-2 flex justify-between items-center px-1">
                                                    <p className="text-gray-50/60">
                                                        Having trouble logging
                                                        in?
                                                    </p>
                                                    <Link
                                                        size="xsm"
                                                        className="text-success text-xs cursor-pointer"
                                                        onPress={() =>
                                                            setIsForgotPassword(
                                                                true
                                                            )
                                                        }
                                                    >
                                                        Forgot password
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        {/* Social Media Footer */}
                                        <div className="flex flex-col gap-3 justify-center items-center ">
                                            <div className="flex items-center w-full">
                                                <hr className="flex-grow border-t border-stone-300 " />
                                                <span className="mx-2 text-gray-50/70  text-xs w-fit">
                                                    Connect with us
                                                </span>
                                                <hr className="flex-grow border-t border-stone-300 " />
                                            </div>
                                            <SocialMediaFooter />
                                        </div>
                                    </m.form>
                                )}
                            </AnimatePresence>
                        </LazyMotion>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TwoFactorAuthForm = ({ email, phone, medium = "email", onCancel }) => {
    const [timer, setTimer] = useState(60);
    const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);

    // Mask email or phone for display
    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, "$1****$3")
        : "";
    const maskedPhone = phone
        ? phone.replace(/(\d{2})(\d+)(\d{2})/, "$1******$3")
        : "";

    // Determine which contact to display based on medium
    const contactDisplay = medium === "email" ? maskedEmail : maskedPhone;

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleCodeChange = (index, value) => {
        const newCode = [...verificationCode];
        newCode[index] = value.slice(-1); // Keep only the last character
        setVerificationCode(newCode);

        // Move to the next input box
        if (value && index < 3) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-xs">
            <div className="text-white text-xs text-center space-y-1">
                <p>
                    A verification code has been sent to your{" "}
                    {medium === "email"
                        ? "email"
                        : medium === "sms"
                        ? "number"
                        : "WhatsApp"}
                </p>

                <p className="font-semibold text-lg flex items-center justify-center">
                    {medium === "email" ? (
                        <Icon icon="mdi:email" className="mr-1  size-5" />
                    ) : medium === "sms" ? (
                        <Icon icon="mdi:phone" className="mr-1 size-5" />
                    ) : (
                        <Icon
                            icon="mdi:whatsapp"
                            className="mr-1 text-success size-5"
                        />
                    )}
                    {contactDisplay}
                </p>

                <p>Please enter the code below to continue.</p>
            </div>

            <div className="flex gap-2 justify-center">
                {verificationCode.map((code, index) => (
                    <Input
                        key={index}
                        id={`code-input-${index}`}
                        value={code}
                        onChange={(e) =>
                            handleCodeChange(index, e.target.value)
                        }
                        maxLength={1}
                        className="w-12 h-12 text-center"
                        variant="flat"
                        size="lg"
                        radius="sm"
                    />
                ))}
            </div>

            <div className="flex justify-between mt-3">
                <p className="text-default-400 text-xs">
                    {timer > 0
                        ? `You can resend in ${timer} seconds.`
                        : "Didn't receive the code?"}
                </p>

                {timer === 0 && (
                    <p
                        className="text-primary-400 text-xs cursor-pointer"
                        onClick={() => setTimer(60)}
                    >
                        Resend Code
                    </p>
                )}
            </div>

            <Button
                variant="shadow"
                color="success"
                type="submit"
                radius="sm"
                className="text-white mt-2"
            >
                Verify
            </Button>

            <Button
                variant="faded"
                radius="sm"
                onPress={onCancel}
                className="hover:bg-content3"
                startContent={
                    <Icon
                        className="text-default-500"
                        icon="solar:arrow-left-linear"
                        width={18}
                    />
                }
            >
                Back to Login
            </Button>
        </div>
    );
};
