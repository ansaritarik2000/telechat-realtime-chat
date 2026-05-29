import React from "react";
import { Spinner } from "@heroui/react"; // Use any available spinner component

const LoadingSpinner = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}>
            <Spinner size="lg" />{" "}
            {/* Adjust the size or use a different Spinner */}
        </div>
    );
};

export default LoadingSpinner;
