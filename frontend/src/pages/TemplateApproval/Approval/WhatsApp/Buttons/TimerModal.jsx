import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";

export default function TimerModal({ path, onClose }) {
  const [time, setTime] = useState(2); // Timer for redirection
  const [iconClass, setIconClass] = useState([
    "text-default",
    "text-default",
    "text-default",
  ]); // Initial icon classes
  const [currentStep, setCurrentStep] = useState(0); // Step tracker for progress
  const [redirectTimerStarted, setRedirectTimerStarted] = useState(false); // Track if redirect timer has started
  const navigate = useNavigate();

  // Steps for progress display
  const steps = [
    "Ensuring compliance & submitting for review.",
    "This process usually takes up to 12 hours, but we’re on it!",
    "You can track the status of your template in reports & overview.",
  ];

  // Change icon color after a delay
  useEffect(() => {
    if (currentStep < steps.length) {
      const timeout = setTimeout(() => {
        setIconClass((prev) => {
          const newClasses = [...prev];
          newClasses[currentStep] = "text-success"; // Change the current icon's class to success
          return newClasses;
        });
        setCurrentStep(currentStep + 1); // Move to next step
      }, 1000 * (currentStep + 1)); // Delay each step by 1 second
      return () => clearTimeout(timeout);
    } else if (currentStep === steps.length && !redirectTimerStarted) {
      // Once all steps are completed, start the redirect timer
      setRedirectTimerStarted(true);
    }
  }, [currentStep, redirectTimerStarted]);

  // Countdown timer and redirect after all icons have changed
  useEffect(() => {
    if (redirectTimerStarted) {
      if (time === 0) {
        navigate(path); // Redirect to the given path
      } else {
        const timer = setInterval(() => {
          setTime((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [time, navigate, path, redirectTimerStarted]);

  return (
    <>
      <Modal
        isOpen={true}
        aria-labelledby="timer-modal"
        size="lg"
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3 w-full">
              {/* Gif */}
              <div className="w-full flex justify-center items-center ">
                <Image
                  src="/Gifs/ModalTimer.gif"
                  alt="gif"
                  width="380"
                  height="380"
                />
              </div>
              {/* Steps */}
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:check-circle"
                    width={30}
                    height={30}
                    className={iconClass[index]}
                  />
                  <span className="text-sm">{step}</span>
                </div>
              ))}

              {/* Divider */}
              <Divider />

              {/* Timer  */}
              <div className="flex justify-center items-center flex-col  ">
                <p className="text-sm text-default-500">
                  {redirectTimerStarted
                    ? `Redirecting in ${time} seconds...`
                    : ""}
                </p>

                {/* Hyperlink to stay on the page */}
                {redirectTimerStarted && (
                  <div
                    className="text-sm w-full text-center text-blue-500 underline cursor-pointer "
                    onClick={(e) => {
                      onClose(); // Close the modal
                    }}
                  >
                    Stay on this page
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
