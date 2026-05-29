import React, { useEffect } from "react";
import {
    DateRangePicker,
    Radio,
    RadioGroup,
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
    getLocalTimeZone,
} from "@internationalized/date";
import { useLocale, useDateFormatter, I18nProvider } from "@react-aria/i18n";

export default function RangeCal({ onDateRangeChange }) {
    let defaultDate = {
        start: today(getLocalTimeZone()).subtract({ days: 7 }),
        end: today(getLocalTimeZone()),
    };
    let [value, setValue] = React.useState(defaultDate);

    let { locale } = useLocale();
    let formatter = useDateFormatter({ dateStyle: "full" });
    let now = today(getLocalTimeZone());

    // Previous week
    let previousWeek = {
        start: now.subtract({ days: 14 }),
        end: now.subtract({ days: 7 }),
    };

    // Previous month: From the same day last month to today
    let previousMonth = {
        start: now.subtract({ months: 1 }),
        end: now,
    };

    const CustomRadio = (props) => {
        const { children, ...otherProps } = props;

        useEffect(() => {
            if (onDateRangeChange) {
                onDateRangeChange({
                    start: value.start
                        .toDate(getLocalTimeZone())
                        .toISOString()
                        .split("T")[0],
                    end: value.end
                        .toDate(getLocalTimeZone())
                        .toISOString()
                        .split("T")[0],
                });
            }
        }, [value, onDateRangeChange]);

        return (
            <Radio
                {...otherProps}
                classNames={{
                    base: cn(
                        "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
                        "cursor-pointer rounded-full border-2 border-default-200/60",
                        "data-[selected=true]:border-primary"
                    ),
                    label: "text-tiny text-default-500",
                    labelWrapper: "px-1 m-0",
                    wrapper: "hidden",
                }}>
                {children}
            </Radio>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-fit max-w-sm">
            <DateRangePicker
                CalendarBottomContent={
                    <RadioGroup
                        aria-label="Date precision"
                        classNames={{
                            base: "w-full pb-2",
                            wrapper:
                                "-my-2.5 py-2.5 px-3 gap-1 flex-nowrap max-w-[w-[calc(var(--visible-months)_*_var(--calendar-width))]] overflow-scroll",
                        }}
                        defaultValue="exact_dates"
                        orientation="horizontal">
                        <CustomRadio value="exact_dates">
                            Exact dates
                        </CustomRadio>
                        <CustomRadio value="1_day">1 day</CustomRadio>
                        <CustomRadio value="2_days">2 days</CustomRadio>
                        <CustomRadio value="3_days">3 days</CustomRadio>
                        <CustomRadio value="7_days">7 days</CustomRadio>
                        <CustomRadio value="14_days">14 days</CustomRadio>
                    </RadioGroup>
                }
                CalendarTopContent={
                    <ButtonGroup
                        fullWidth
                        className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                        radius="full"
                        size="sm"
                        variant="bordered">
                        <Button
                            onPress={() => {
                                const newValue = {
                                    start: now.subtract({ days: 7 }),
                                    end: now,
                                };
                                setValue(newValue);
                                onDateRangeChange({
                                    start: newValue.start
                                        .toDate(getLocalTimeZone())
                                        .toISOString()
                                        .split("T")[0],
                                    end: newValue.end
                                        .toDate(getLocalTimeZone())
                                        .toISOString()
                                        .split("T")[0],
                                });
                            }}>
                            This week
                        </Button>
                        <Button
                            onPress={() => {
                                const newValue = previousWeek;
                                setValue(newValue);
                                onDateRangeChange({
                                    start: newValue.start
                                        .toDate(getLocalTimeZone())
                                        .toISOString()
                                        .split("T")[0],
                                    end: newValue.end
                                        .toDate(getLocalTimeZone())
                                        .toISOString()
                                        .split("T")[0],
                                });
                            }}>
                            Last week
                        </Button>
                        <Button
                            onPress={() => {
                                const newValue = previousMonth;
                                setValue(newValue);
                                onDateRangeChange({
                                    start: newValue.start
                                        .toDate(getLocalTimeZone())
                                        .toISOString()
                                        .split("T")[0],
                                    end: newValue.end
                                        .toDate(getLocalTimeZone())
                                        .toISOString()
                                        .split("T")[0],
                                });
                            }}>
                            Last month
                        </Button>
                    </ButtonGroup>
                }
                calendarProps={{
                    focusedValue: value.start,
                    onFocusChange: (val) => setValue({ ...value, start: val }),
                    nextButtonProps: {
                        variant: "bordered",
                    },
                    prevButtonProps: {
                        variant: "bordered",
                    },
                }}
                value={value}
                onChange={setValue}
                label=""
                labelPlacement="outside-left"
            />
        </div>
    );
}
