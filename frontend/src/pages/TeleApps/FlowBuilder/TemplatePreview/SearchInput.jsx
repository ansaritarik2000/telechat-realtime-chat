import { Input } from "@heroui/react";

const SearchInput = () => {
  return (
    <div className="mb-4">
      <Input
        clearable
        bordered
        placeholder="Search templates"
        className="w-full"
      />
    </div>
  );
};

export default SearchInput;
