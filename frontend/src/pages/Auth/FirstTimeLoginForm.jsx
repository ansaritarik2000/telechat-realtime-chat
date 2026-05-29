import React from "react";
import { Button, InputOtp, Form } from "@heroui/react";

export default function FirstTimeLoginForm() {
    const [otp, setOtp] = React.useState("");
    return (
        <div className="flex flex-col gap-4 max-w-xs">
            <p className="text-sm text-white">
                We have sent a code to you email address. Enter the code below
                to continue.
            </p>

            <Form
                className="flex  flex-col items-center gap-4"
                validationBehavior="native"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const otp = formData.get("otp");

                    setOtp(otp);
                }}
            >
                <InputOtp
                    isRequired
                    aria-label="OTP input field"
                    length={4}
                    name="otp"
                    placeholder="Enter code"
                    validationBehavior="native"
                    size="lg"
                    variant="faded"
                />
                {/* <Button size="sm" type="submit" variant="bordered">
          Submit
        </Button> */}
            </Form>
        </div>
    );
}
