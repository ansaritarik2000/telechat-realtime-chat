import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Store theme preference in localStorage
  };

  useEffect(() => {
    // Load theme preference from localStorage on component mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <Button
      isIconOnly
      radius="full"
      variant="light"
      onClick={toggleTheme}
      className="hidden lg:flex"
    >
      <Icon
        className="text-default-500"
        icon={theme === "light" ? "solar:sun-linear" : "solar:moon-linear"}
        width={24}
      />
    </Button>
  );
};

export default ThemeToggle;
