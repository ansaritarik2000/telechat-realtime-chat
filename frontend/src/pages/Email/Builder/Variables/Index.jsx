import React, { useState } from "react";
import { Card, CardBody, Button, Alert, Snippet } from "@heroui/react";
import VariableList from "../Data/VariableList";
import { CopyIcon } from "../../../../utils/ReusableIcons";

export default function VariablesIndex() {
  const [copied, setCopied] = useState(false);
  const [variableValue, setVariableValue] = useState("");
  const [variableLabel, setVariableLabel] = useState("");

  const handleCopyVariableValue = (variable) => {
    navigator.clipboard.writeText(variable.value);
    setVariableValue(variable.value);
    // setVariableLabel(variable.label);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div className="px-2 flex flex-col gap-2">
      {/* Show Alert on Copy */}
      {copied && (
        <Alert
          // hideIconWrapper
          color="success"
          radius="md"
          title={`${variableValue} copied to clipboard`}
        />
      )}

      {/* Variables */}
      {VariableList.map((variable, index) => (
        <Card key={index} radius="sm" shadow="sm">
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-sm ">{variable.label}</p>
              {/* Copy button */}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                radius="sm"
                onPress={() => handleCopyVariableValue(variable)}
              >
                <CopyIcon size="1.5em" />
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}

      {/* <Snippet>npm install @heroui/react</Snippet> */}
      {/* {VariableList.map((variable, index) => (
        <Snippet symbol=" " variant="bordered" key={index}>
          {variable.value}
        </Snippet>
      ))} */}
    </div>
  );
}
