// For Timer: Add, Delay Value & Unit (Add this ). Add timer icon in Start content. . Render based on toggle action (with icons: time, )
import { useState } from "react";
import { Input, Button, Switch, DatePicker } from "@heroui/react";
import {
    parseZonedDateTime,
    parseAbsoluteToLocal,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export default function Timer({ routeBack, nodeId }) {
    const [isToggleEnabled, setIsToggleEnabled] = useState(false);
    const { t } = useTranslation();
    const zonedDateTime = parseZonedDateTime(
        "2022-11-07T00:45[America/Los_Angeles]"
    );
    let [date, setDate] = useState(
        parseAbsoluteToLocal("2024-09-07T18:45:22Z")
    );
    return (
        <div className="flex flex-col gap-6 w-full ">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
                {/* Icon to Label Text */}
                <div className="flex gap-1 items-center ">
                    <Icon icon="icon-park:timer" width={"1.7em"} />
                    <p className="font-medium text-md text-foreground">
                        {t("Wait Timer")}
                    </p>
                </div>
                <Button
                    size="sm"
                    radius="sm"
                    variant="flat"
                    onPress={routeBack}
                >
                    {t("Back")}
                </Button>
            </div>

            {/* Switch / Toggler */}
            <div className="w-full p-3 flex justify-between items-center bg-content2 rounded-lg">
                <p className="text-sm font-medium text-foreground">
                    {isToggleEnabled ? t("Calendar") : t("Timer")} {t("Input")}
                </p>
                <Switch
                    defaultSelected
                    size="md"
                    color="primary"
                    variant="flat"
                    isSelected={isToggleEnabled}
                    onValueChange={setIsToggleEnabled}
                    thumbIcon={({ isSelected, className }) =>
                        isSelected ? (
                            <Icon
                                icon="mdi:calendar-outline"
                                className={className}
                            />
                        ) : (
                            <Icon
                                icon="stash:clock"
                                width={"1.4em"}
                                className={className}
                            />
                        )
                    }
                />
            </div>

            {/* Conditionally rendered Input Fields */}

            {isToggleEnabled ? (
                <div className="w-full">
                    {/* Calendar / Date Picker */}
                    <I18nProvider
                        // locale="en-IN"
                        dateTimeFormatterOptions={{
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                        }}
                    >
                        <DatePicker
                            label={t("Zoned Date Time")}
                            className="max-w-xs"
                            value={date}
                            onChange={setDate}
                            labelPlacement="outside"
                            formatOptions={{
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                            }}
                            format="dd/MM/yyyy"
                        />
                    </I18nProvider>
                </div>
            ) : (
                <Input
                    isRequired
                    label={t("Delay Value")}
                    placeholder="00"
                    labelPlacement="outside"
                    startContent={
                        <div className="pointer-events-none flex items-center text-default-400">
                            <Icon
                                icon="stash:clock"
                                width="1.2em"
                                height="1.2em"
                            />
                        </div>
                    }
                    endContent={
                        <div className="flex items-center">
                            <label className="sr-only" htmlFor="unit">
                                {t("Currency")}
                            </label>
                            <select
                                className="outline-none border-0 bg-transparent text-default-400 text-small"
                                id="unit"
                                name="unit"
                            >
                                <option>{t("hours")}</option>
                                <option>{t("secs")}</option>
                                <option>{t("mins")}</option>
                                <option>{t("days")}</option>
                                <option>{t("months")}</option>
                            </select>
                        </div>
                    }
                    type="number"
                />
            )}

            <Button
                size="sm"
                color="primary"
                variant="solid"
                className="w-fit self-end"
            >
                Save
            </Button>
        </div>
    );
}
