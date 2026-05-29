import React from "react";
import { DatePicker, cn } from "@heroui/react";
import {
    parseAbsoluteToLocal,
    parseZonedDateTime,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { useSendWhatsappStore } from "../../store/whatsapp/whatsappStore";
export default function CampaignScheduler({ onDateChange }) {
    let [date, setDate] = React.useState(
        parseZonedDateTime("2025-03-01T12:00:00+05:30[Asia/Kolkata]")
    ); // No default value

    // Zustand store
    // const { setSelectedDate } = useSendWhatsappStore();

    return (
        <I18nProvider locale="en-GB">
            <DatePicker
                className="w-full"
                granularity="second"
                value={date}
                hideTimeZone
                onChange={(newDate) => {
                    setDate(newDate);
                    // setSelectedDate(newDate); // Update Zustand store
                    onDateChange(newDate);
                }}
                size="md"
                placeholder="Select a date and time" // Optional placeholder
                aria-label="Select expiration date and time"
            />
        </I18nProvider>
    );
}
