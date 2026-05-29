import React from "react";
import { DatePicker } from "@heroui/react";
import {parseAbsoluteToLocal,parseZonedDateTime} from '@internationalized/date';
import { useSendWhatsappStore } from "../../store/whatsapp/whatsappStore";

export default function ExpirationTime() {
  // Initialize date state with null or a default value
  const [date, setDate] = React.useState(parseZonedDateTime('2023-06-01T12:00:00+05:30[Asia/Kolkata]'));

  // Zustand store
  const { setSelectedExpirationDate ,selectedExpirationDate} = useSendWhatsappStore();
  // console.log("Selected Date Expiration Time and Date:", selectedExpirationDate);
  
  return (
    <div>
      <DatePicker
        className="max-w-xs"
        granularity="second" // Allows selecting date and time
        hideTimeZone
        showMonthAndYearPickers
        value={date}
        onChange={(newDate) => {
          setDate(newDate); // Update local state
          setSelectedExpirationDate(newDate); // Update Zustand store
        }}
        size="md"
        placeholder="Select a date and time" // Optional placeholder
        label="Select Expiration Time"
        aria-label="Select expiration date and time" // Add aria-labe
      />
    </div>
  );
}
