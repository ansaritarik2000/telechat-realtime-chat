import React, { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";

const description = (
  <>
    <span className="text-red-500">*</span> The reset link will be sent to this
    email address.
  </>
);

export default function AdminReset({ backAction }) {
  const [timer, setTimer] = useState(60);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (isCodeSent) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isCodeSent]);

  const handleSendResetLink = (e) => {
    e.preventDefault();
    // Logic to send the reset link goes here
    console.log("Sending reset link to:", email);
    setIsCodeSent(true);
    setTimer(60); // Reset timer to 30 seconds
  };

  return (
    <div className="flex flex-col gap-4">
      {!isCodeSent ? (
        <>
          <Input
            isRequired
            placeholder="Admin Email Address"
            name="admin email"
            type="email"
            variant="flat"
            size="lg"
            radius="sm"
            description={description}
            classNames={{
              inputWrapper: [
                "group-data-[focus=true]:border-success",
                "!cursor-text",
              ],
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startContent={
              <Icon
                icon="ic:round-email"
                width={25}
                className="text-default-400"
              />
            }
          />
          <Button
            variant="shadow"
            color="success"
            type="submit"
            radius="sm"
            className="text-white"
            onClick={handleSendResetLink}
          >
            Send Reset Link
          </Button>
        </>
      ) : (
        <div className="flex flex-col  gap-4">
          <p className="text-default-500 text-sm">
            A reset link has been sent to {email}. Please check your inbox!
          </p>

          <div className="flex justify-start gap-1">
            <p className="text-default-400 text-xs">
              {timer > 0
                ? `You can resend in ${timer} seconds. `
                : "Didn’t receive the link? "}
            </p>
            {timer === 0 && (
              <p
                className="text-primary-400 text-xs cursor-pointer"
                onClick={handleSendResetLink}
              >
                Resend Link
              </p>
            )}
          </div>
        </div>
      )}
      <Button
        variant="faded"
        radius="sm"
        onClick={backAction}
        className="hover:bg-content3"
        startContent={
          <Icon
            className="text-default-500"
            icon="solar:arrow-left-linear"
            width={18}
          />
        }
      >
        Back
      </Button>
    </div>
  );
}
