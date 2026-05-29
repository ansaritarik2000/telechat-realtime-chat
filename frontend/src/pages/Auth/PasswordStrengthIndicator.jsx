import React from "react";

const PasswordStrengthIndicator = ({ password = "" }) => {
    // Function to determine password strength
    const getPasswordStrength = () => {
        if (password.length >= 14) return "strong";
        if (password.length >= 10) return "medium";
        if (password.length >= 6) return "weak";
        return "none";
    };

    // Determine the color of the strength line
    const strengthColor = {
        strong: "bg-green-500",
        medium: "bg-yellow-500",
        weak: "bg-red-500",
    };

    const passwordStrength = getPasswordStrength();
    return (
        <>
            {/* Password Strength Indicator */}
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                {passwordStrength !== "none" && (
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${strengthColor[passwordStrength]}`}
                        style={{
                            width:
                                passwordStrength === "weak"
                                    ? "33%"
                                    : passwordStrength === "medium"
                                    ? "66%"
                                    : "100%",
                        }}
                    />
                )}
            </div>

            {passwordStrength !== "none" && (
                <p
                    className={`mt-1 text-sm ${
                        passwordStrength === "strong"
                            ? "text-green-500"
                            : passwordStrength === "medium"
                            ? "text-yellow-500"
                            : "text-red-500"
                    }`}>
                    {passwordStrength.charAt(0).toUpperCase() +
                        passwordStrength.slice(1)}
                </p>
            )}
        </>
    );
};

export default PasswordStrengthIndicator;
