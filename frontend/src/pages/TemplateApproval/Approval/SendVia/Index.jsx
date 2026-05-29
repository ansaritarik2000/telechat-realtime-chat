import React, { useState } from "react";
import { Radio, RadioGroup } from "@heroui/react";
import Numberbox from "./NumBox";
import CSVUpload from "./CsvUpload";

export default function RadioSelector() {
  const [selectedOption, setSelectedOption] = useState("numbers");

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="flex flex-col ">
      <div className="flex justify-between items-center mb-3">
        <RadioGroup
          label="Send via:"
          orientation="horizontal"
          value={selectedOption}
          onChange={handleChange}
          color="success"
          className="font-medium mb-4"
        >
          <Radio value="numbers">Numbers</Radio>
          <Radio value="file">Upload CSV</Radio>
        </RadioGroup>
      </div>

      {/* Conditional Rendering based on selected radio option */}
      {selectedOption === "numbers" && <Numberbox />}
      {selectedOption === "file" && <CSVUpload />}
    </div>
  );
}
