import React, { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";

const countryCodes = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+856", name: "Laos", flag: "🇱🇦" },
  { code: "+855", name: "Cambodia", flag: "🇰🇭" },
];

export default function PhoneNumber(props) {
  const { size = "md" } = props;
  const [selectedCode, setSelectedCode] = useState(countryCodes[0].code);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="flex items-center border border-gray-300 dark:border-background rounded-md px-1 py-2">
      <select
        className=" rounded-l-md focus:outline-none w-1/4"
        value={selectedCode}
        onChange={(e) => setSelectedCode(e.target.value)}
      >
        {countryCodes.map(({ code, flag }) => (
          <option key={code} value={code}>
            {flag} {code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        className="flex-1 p-2 focus:outline-none"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
    </div>
  );
}
