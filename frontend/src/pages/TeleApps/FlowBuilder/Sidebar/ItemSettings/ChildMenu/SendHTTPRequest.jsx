import React, { useState } from "react";
import {
  Select,
  SelectItem,
  Input,
  Form,
  Button,
  Switch,
  cn,
  Textarea,
} from "@heroui/react";
import { PlusIcon } from "../../../../../../utils/ReusableIcons";

// HTTP Method options
const methodOptions = [
  { label: "GET", value: "get" },
  { label: "POST", value: "post" },
  { label: "PUT", value: "put" },
  { label: "DELETE", value: "delete" },
  { label: "PATCH", value: "patch" },
];

// Common Input Component
const InputComponent = function ({
  label,
  type = "text",
  placeholder,
  name,
  ...props
}) {
  return (
    <Input
      radius="sm"
      size="md"
      variant="bordered"
      label={label}
      labelPlacement="outside"
      placeholder={placeholder || `Enter ${label}`}
      name={name || label.toLowerCase().replace(/\s+/g, "_")}
      type={type}
      {...props}
    />
  );
};

// Common Select Component
const SelectComponent = function ({
  label,
  options,
  selectedValue,
  setSelectedValue,
  name,
  placeholder,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <Select
        radius="sm"
        size="md"
        variant="bordered"
        label={label}
        labelPlacement="outside"
        placeholder={placeholder || `Select ${label}`}
        value={selectedValue}
        name={name || label.toLowerCase().replace(/\s+/g, "_")}
        onChange={(e) => setSelectedValue && setSelectedValue(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

// Parameter Row Component (for Headers, Query Params, Body)
const ParameterRow = ({ index, type, onDelete }) => {
  const label = `${type} #${index + 1}`;
  const keyName = `${type.toLowerCase()}_key_${index}`;
  const valueName = `${type.toLowerCase()}_value_${index}`;

  return (
    <div className="flex flex-col  gap-2 w-full">
      <div className="text-sm font-medium min-w-[80px]">{label}:</div>
      <div className="flex-center gap-1">
        <Input
          radius="sm"
          size="sm"
          variant="bordered"
          placeholder="Key"
          name={keyName}
          className="flex-1"
        />
        <div className="mx-1">:</div>
        <Input
          radius="sm"
          size="sm"
          variant="bordered"
          placeholder="Value"
          name={valueName}
          className="flex-1"
        />
        <Button
          size="sm"
          isIconOnly
          variant="light"
          color="danger"
          onPress={() => onDelete(index)}
        >
          ✕
        </Button>
      </div>
    </div>
  );
};

export const SendHTTPRequest = function () {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [headers, setHeaders] = useState([]);
  const [queryParams, setQueryParams] = useState([]);
  const [bodyParams, setBodyParams] = useState([]);
  const [includeResponse, setIncludeResponse] = useState(false);
  const [errors, setErrors] = useState({});

  const addHeader = () => {
    setHeaders([...headers, {}]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, {}]);
  };

  const removeQueryParam = (index) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const addBodyParam = () => {
    setBodyParams([...bodyParams, {}]);
  };

  const removeBodyParam = (index) => {
    setBodyParams(bodyParams.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Validation logic
    const newErrors = {};
    if (!selectedMethod) {
      newErrors.method = "HTTP method is required";
    }
    if (!data.url) {
      newErrors.url = "URL is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form data into structured format
    const requestData = {
      method: selectedMethod,
      url: data.url,
      headers: {},
      queryParams: {},
      body: {},
      includeResponse,
    };

    // Process headers
    headers.forEach((_, index) => {
      const key = data[`header_key_${index}`];
      const value = data[`header_value_${index}`];
      if (key && value) {
        requestData.headers[key] = value;
      }
    });

    // Process query params
    queryParams.forEach((_, index) => {
      const key = data[`query_key_${index}`];
      const value = data[`query_value_${index}`];
      if (key && value) {
        requestData.queryParams[key] = value;
      }
    });

    // Process body params
    bodyParams.forEach((_, index) => {
      const key = data[`body_key_${index}`];
      const value = data[`body_value_${index}`];
      if (key && value) {
        requestData.body[key] = value;
      }
    });

    // Add expected response if the toggle is on
    if (includeResponse && data.expected_response) {
      requestData.expectedResponse = data.expected_response;
    }

    console.log("HTTP Request data:", requestData);
    // Process form submission
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <SelectComponent
        label="Method"
        options={methodOptions}
        selectedValue={selectedMethod}
        setSelectedValue={setSelectedMethod}
        description="HTTP method for the request"
      />

      <InputComponent
        label="URL"
        placeholder="https://api.example.com/endpoint"
        name="url"
        description="The endpoint URL for the HTTP request"
      />

      {/* Headers Section */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center ">
          <label className="text-sm font-medium text-default-500">
            Headers (Optional)
          </label>
          <Button
            size="sm"
            variant="none"
            color="primary"
            onPress={addHeader}
            className="py-0 px-2"
            startContent={<PlusIcon />}
          >
            Add Header
          </Button>
        </div>

        {headers.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 p-3 bg-gray-50 rounded-md">
            {headers.map((_, index) => (
              <ParameterRow
                key={`header-${index}`}
                index={index}
                type="Header"
                onDelete={removeHeader}
              />
            ))}
          </div>
        )}
      </div>

      {/* Query Parameters Section */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-default-500">
            Query Parameters (Optional)
          </label>
          <Button
            size="sm"
            variant="none"
            color="primary"
            onPress={addQueryParam}
            className="py-0 px-2"
            startContent={<PlusIcon />}
          >
            Add Query
          </Button>
        </div>

        {queryParams.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 p-3 bg-gray-50 rounded-md">
            {queryParams.map((_, index) => (
              <ParameterRow
                key={`query-${index}`}
                index={index}
                type="Query"
                onDelete={removeQueryParam}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body Parameters Section */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-default-500">
            Body (Optional)
          </label>
          <Button
            size="sm"
            variant="none"
            color="primary"
            onPress={addBodyParam}
            className="py-0 px-2"
            startContent={<PlusIcon />}
          >
            Add Body
          </Button>
        </div>

        {bodyParams.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 p-3 bg-gray-50 rounded-md">
            {bodyParams.map((_, index) => (
              <ParameterRow
                key={`body-${index}`}
                index={index}
                type="Body"
                onDelete={removeBodyParam}
              />
            ))}
          </div>
        )}
      </div>

      {/* Response Toggle */}
      <Switch
        isSelected={includeResponse}
        onValueChange={setIncludeResponse}
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse w-full max-w-md bg-content2 items-center border-2 border-default ",
            "justify-between cursor-pointer rounded-lg gap-2 px-2 py-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
          wrapper: "p-0 h-4 overflow-visible ",
          thumb: cn(
            "w-6 h-6 border-2 shadow-lg",
            "group-data-[hover=true]:border-primary",
            //selected
            "group-data-[selected=true]:ms-6",
            // pressed
            "group-data-[pressed=true]:w-7",
            "group-data-[selected]:group-data-[pressed]:ms-4"
          ),
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-xs">Add expected API response (Optional)</p>
          <p className="text-xs text-default-400">
            To use the API response as a variable in the next steps, add the
            expected response (JSON).
          </p>
        </div>
      </Switch>

      {includeResponse && (
        <Textarea
          label="Expected API Response"
          radius="sm"
          variant="bordered"
        />
      )}

      <Button
        size="sm"
        radius="sm"
        variant="solid"
        color="primary"
        className="self-end mt-4"
        type="submit"
      >
        Save
      </Button>
    </Form>
  );
};
