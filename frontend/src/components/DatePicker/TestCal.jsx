import React from "react";
import { DateRangePicker } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";

export default function TestCal() {
  return (
    <div>
      <I18nProvider locale="ru-RU">
        <DateRangePicker label="Stay duration" className="max-w-xs" />
      </I18nProvider>
    </div>
  );
}
