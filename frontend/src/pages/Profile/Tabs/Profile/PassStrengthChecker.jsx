import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";

const PassStrengthChecker = ({ password }) => {
  const [strength, setStrength] = useState("");
  const [color, setColor] = useState("");
  const [stripWidth, setStripWidth] = useState(0);
  const [message, setMessage] = useState("");
  const [conditions, setConditions] = useState({
    length: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      const lengthCheck = password.length >= 12;
      const numberCheck = /\d/.test(password);
      const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      // Set the conditions for each rule
      setConditions({
        length: lengthCheck,
        number: numberCheck,
        specialChar: specialCharCheck,
      });

      // Increment score based on password strength
      if (lengthCheck) score++;
      if (numberCheck) score++;
      if (specialCharCheck) score++;

      // Determine strength based on score
      if (score === 3) {
        setStrength("Strong");
        setColor("#28a745"); // Green
        setStripWidth(100); // Full green strip
        setMessage("Your password is strong. Great work 😍");
      } else if (score === 2) {
        setStrength("Average");
        setColor("#fd7e14"); // Orange
        setStripWidth(66); // Orange and red mixed
        setMessage("Your password is somewhat better but still breakable 😐");
      } else {
        setStrength("Poor");
        setColor("#dc3545"); // Red
        setStripWidth(33); // Mostly red strip
        setMessage("Your password is guessable you can do better 😟");
      }
    };

    if (password) {
      calculateStrength();
    }
  }, [password]);

  return (
    <div className="flex flex-col gap-1 mt-2">
      {/* Strength Progress Bar */}
      <div className="relative w-full bg-gray-200 h-2 rounded-full mt-1">
        <div
          className="h-full rounded-full"
          style={{
            width: `${stripWidth}%`,
            backgroundColor:
              stripWidth <= 33
                ? "#dc3545"
                : stripWidth <= 66
                ? "#fd7e14"
                : "#28a745",
          }}
        ></div>
      </div>

      {/* Strength Message */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-default-500 ">{message}</p>
        <div className="flex gap-1 items-center">
          <Icon
            icon="ant-design:check-circle-filled"
            width="1.2em"
            height="1.2em"
            style={{ color }}
          />
          <p style={{ color }} className="text-sm">
            {strength}
          </p>
        </div>
      </div>

      {/* Password Criteria List */}
      <ul className="text-sm text-default-500 mt-2">
        <li className="flex items-center">
          <Icon
            icon={
              conditions.length
                ? "ant-design:check-circle-filled"
                : "ant-design:close-circle-filled"
            }
            width="1.2em"
            height="1.2em"
            style={{ color: conditions.length ? "#28a745" : "#dc3545" }}
          />
          <span className="ml-2">Minimum 12 characters</span>
        </li>
        <li className="flex items-center">
          <Icon
            icon={
              conditions.number
                ? "ant-design:check-circle-filled"
                : "ant-design:close-circle-filled"
            }
            width="1.2em"
            height="1.2em"
            style={{ color: conditions.number ? "#28a745" : "#dc3545" }}
          />
          <span className="ml-2">
            Contains at least one number (e.g., 123..)
          </span>
        </li>
        <li className="flex items-center">
          <Icon
            icon={
              conditions.specialChar
                ? "ant-design:check-circle-filled"
                : "ant-design:close-circle-filled"
            }
            width="1.2em"
            height="1.2em"
            style={{ color: conditions.specialChar ? "#28a745" : "#dc3545" }}
          />
          <span className="ml-2">
            Contains at least one special character (e.g., @#..)
          </span>
        </li>
      </ul>
    </div>
  );
};

export default PassStrengthChecker;
