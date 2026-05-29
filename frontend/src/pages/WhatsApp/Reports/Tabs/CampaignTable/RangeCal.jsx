import React, { useEffect } from "react";
import {
    DateRangePicker,
    Button,
    ButtonGroup,
    cn,
} from "@heroui/react";
import {
    today,
    startOfWeek,
    startOfMonth,
    endOfWeek,
    endOfMonth,
    startOfYear,
    getLocalTimeZone
} from "@internationalized/date";
import { useLocale, I18nProvider } from "@react-aria/i18n";

export default function RangeCal({ onDateRangeChange }) {
    let { locale } = useLocale();
    let now = today(getLocalTimeZone());
    // This Year
    let thisYear = {
        start: startOfYear(now),
        end:  now.add({ days: 1 })
    };
    //  "This week" to start 7 days ago
    let thisWeek = {
        start: now.subtract({ days: 7 }),
        end: now,
    };          
      // "This month" starts from the 1st of the current month
        let thisMonth = {
            start: startOfMonth(now),
            end: now,
        };
    
    let lastMonth = {
           start: startOfMonth(now.subtract({ months: 1 })),
           end: endOfMonth(now.subtract({ months: 1 })),
       };
    
    let [value, setValue] = React.useState(thisYear);
    let [focusedDate, setFocusedDate] = React.useState(value.start);

    // Handle date range changes
    const handleRangeChange = (range) => {
        setValue(range);
        setFocusedDate(range.start);
    };

    // Update focused date when range changes
    useEffect(() => {
        setFocusedDate(value.start);
    }, [value]);

    // Notify parent of date changes
    useEffect(() => {
        if (onDateRangeChange && value) {
            onDateRangeChange({
                start: value.start.toDate(getLocalTimeZone()).toISOString().split("T")[0],
                end: value.end.toDate(getLocalTimeZone()).toISOString().split("T")[0],
            });
        }
    }, [value, onDateRangeChange]);

    return (
        <I18nProvider locale={locale}>
            <div className="flex flex-col gap-4 w-fit max-w-sm">
                <DateRangePicker
                    aria-label="Select a range"
                    CalendarTopContent={
                        <ButtonGroup
                            fullWidth
                            className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                            radius="full"
                            size="sm"
                            variant="bordered">
                            <Button onPress={() => handleRangeChange(thisWeek)}>
                                This week
                            </Button>
                            <Button onPress={() => handleRangeChange(thisMonth)}>
                                This month
                            </Button>
                            <Button onPress={() => handleRangeChange(lastMonth)}>
                                Last month
                            </Button>
                        </ButtonGroup>
                    }
                    calendarProps={{
                        focusedValue: focusedDate,
                        onFocusChange: setFocusedDate,
                        nextButtonProps: { variant: "bordered" },
                        prevButtonProps: { variant: "bordered" },
                    }}
                    value={value}
                    onChange={handleRangeChange}
                    label=""
                    labelPlacement="outside-left"
                />
            </div>
        </I18nProvider>
    );
}