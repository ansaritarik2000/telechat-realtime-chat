import React from "react";
import { Input, Select, SelectItem, Switch, Button, cn } from "@heroui/react";
import CommonHeader from "../CommonHeader";
import { CloseIcon, PlusIcon } from "../../../../../utils/ReusableIcons";
import Buttons from "./Buttons";

const rcsbots = [
    {
        key: "1",
        number: "TelepieBot",
    },
    {
        key: "2",
        number: "WiredBot",
    },
];

const collection = [
    {
        key: "1",
        label: "Personal",
    },
    {
        key: "2",
        label: "Business",
    },
];

export default function IncomingRCSConfig({ routeBack, nodeId }) {
    const [selectedBot, setSelectedBot] = React.useState(new Set([]));
    const [selectedCollection, setSelectedCollection] = React.useState(
        new Set([])
    );
    const [isPhraseMatchChecked, setPhraseMatchingChecked] =
        React.useState(false);
    const [isPhraseExclusionChecked, setPhraseExclusionChecked] =
        React.useState(false);
    const [saveBtn, setSaveBtn] = React.useState(false);

    // When selectedBot & selectedCollection is true change update saveBtn state

    React.useEffect(() => {
        // Enable save button only when both selects have values
        if (selectedBot.size > 0 && selectedCollection.size > 0) {
            setSaveBtn(false); // Enable the save button
        } else {
            setSaveBtn(true); // Disable the save button
        }
    }, [selectedBot, selectedCollection]);

    // State for phrases arrays
    const [matchPhrases, setMatchPhrases] = React.useState([
        { id: 1, value: "" },
    ]);
    const [exclusionPhrases, setExclusionPhrases] = React.useState([
        { id: 1, value: "" },
    ]);

    // Functions for phrase matching
    const addMatchPhrase = () => {
        const newId =
            matchPhrases.length > 0
                ? Math.max(...matchPhrases.map((p) => p.id)) + 1
                : 1;
        setMatchPhrases([...matchPhrases, { id: newId, value: "" }]);
    };

    const removeMatchPhrase = (id) => {
        if (matchPhrases.length > 1) {
            setMatchPhrases(matchPhrases.filter((phrase) => phrase.id !== id));
        }
    };

    const updateMatchPhrase = (id, newValue) => {
        setMatchPhrases(
            matchPhrases.map((phrase) =>
                phrase.id === id ? { ...phrase, value: newValue } : phrase
            )
        );
    };

    // Functions for phrase exclusion
    const addExclusionPhrase = () => {
        const newId =
            exclusionPhrases.length > 0
                ? Math.max(...exclusionPhrases.map((p) => p.id)) + 1
                : 1;
        setExclusionPhrases([...exclusionPhrases, { id: newId, value: "" }]);
    };

    const removeExclusionPhrase = (id) => {
        if (exclusionPhrases.length > 1) {
            setExclusionPhrases(
                exclusionPhrases.filter((phrase) => phrase.id !== id)
            );
        }
    };

    const updateExclusionPhrase = (id, newValue) => {
        setExclusionPhrases(
            exclusionPhrases.map((phrase) =>
                phrase.id === id ? { ...phrase, value: newValue } : phrase
            )
        );
    };

    return (
        <div className="w-fit">
            <CommonHeader
                name={"Incoming RCS"}
                nodeId={nodeId}
                routeBack={routeBack}
                icon="rcs"
            />

            <div className="flex flex-col gap-3 h-full mt-3">
                {/* RCS Bots */}
                <Select
                    className="max-w-xs"
                    size="sm"
                    label="Select RCS Bot"
                    placeholder=""
                    selectedKeys={selectedBot}
                    variant="bordered"
                    onSelectionChange={setSelectedBot}
                >
                    {rcsbots.map((bot) => (
                        <SelectItem key={bot.key}>{bot.number}</SelectItem>
                    ))}
                </Select>

                {/* Collection */}
                <Select
                    className="max-w-xs"
                    size="sm"
                    label="Select Collection"
                    placeholder=""
                    selectedKeys={selectedCollection}
                    variant="bordered"
                    onSelectionChange={setSelectedCollection}
                >
                    {collection.map((item) => (
                        <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                </Select>

                {/* Phrase Matching Switch */}
                <div className="flex flex-col">
                    <Switch
                        isSelected={isPhraseMatchChecked}
                        onValueChange={setPhraseMatchingChecked}
                        size="sm"
                        classNames={SwitchStyling}
                    >
                        <span className="text-xs">
                            Exact Phrase Matching Trigger (Optional)
                        </span>
                    </Switch>
                    {isPhraseMatchChecked && (
                        <p className="text-xs text-default-400">
                            The node will be triggered only when the message
                            exactly matches the provided phrases.
                        </p>
                    )}
                </div>

                {/* Render when above switch is true */}
                {isPhraseMatchChecked && (
                    <div className="flex flex-col gap-1  text-default-500 border-b pb-4 border-default">
                        <div className="flex-between ">
                            <p className="text-sm">Phrases</p>

                            <AddButton
                                label="Add Phrase"
                                onClick={addMatchPhrase}
                            />
                        </div>

                        <p className="text-xs  text-default-400">
                            Enter the exact phrases that will trigger this node
                        </p>

                        {/* Dynamic input fields for match phrases */}
                        {matchPhrases.map((phrase) => (
                            <div
                                key={phrase.id}
                                className="flex justify-between w-full gap-1"
                            >
                                <Input
                                    placeholder="Enter a phrase"
                                    className="w-full"
                                    radius="sm"
                                    variant="bordered"
                                    value={phrase.value}
                                    onChange={(e) =>
                                        updateMatchPhrase(
                                            phrase.id,
                                            e.target.value
                                        )
                                    }
                                />
                                <Button
                                    isIconOnly
                                    variant="bordered"
                                    radius="sm"
                                    className="text-xs text-default-500"
                                    onPress={() => removeMatchPhrase(phrase.id)}
                                    isDisabled={matchPhrases.length === 1}
                                >
                                    <CloseIcon size="1.5em" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Exact Phrase Exclusion Switch */}
                <div className="flex flex-col">
                    <Switch
                        isSelected={isPhraseExclusionChecked}
                        onValueChange={setPhraseExclusionChecked}
                        size="sm"
                        classNames={SwitchStyling}
                    >
                        <span className="text-xs">
                            Exact Phrase Exclusion Trigger (Optional)
                        </span>
                    </Switch>
                    {isPhraseExclusionChecked && (
                        <p className="text-xs text-default-400">
                            The node will <span className="font-bold">not</span>{" "}
                            be triggered when the message exactly matches the
                            provided phrases.
                        </p>
                    )}
                </div>

                {/* Render when above switch is true */}
                {isPhraseExclusionChecked && (
                    <div className="flex flex-col gap-1 w-full text-default-500">
                        <div className="flex-between">
                            <p className="text-sm">Phrases</p>
                            <AddButton
                                label="Add Phrase"
                                onClick={addExclusionPhrase}
                            />
                        </div>
                        <p className="text-xs w-full text-default-400">
                            Enter the exact phrases that will
                            <span className="font-bold">not</span> trigger this
                            node
                        </p>

                        {/* Dynamic input fields for exclusion phrases */}
                        {exclusionPhrases.map((phrase) => (
                            <div
                                key={phrase.id}
                                className="flex justify-between w-full gap-1"
                            >
                                <Input
                                    placeholder="Enter a phrase"
                                    className="w-full"
                                    radius="sm"
                                    variant="bordered"
                                    value={phrase.value}
                                    onChange={(e) =>
                                        updateExclusionPhrase(
                                            phrase.id,
                                            e.target.value
                                        )
                                    }
                                />
                                <Button
                                    isIconOnly
                                    variant="bordered"
                                    radius="sm"
                                    className="text-xs text-default-500"
                                    onPress={() =>
                                        removeExclusionPhrase(phrase.id)
                                    }
                                    isDisabled={exclusionPhrases.length === 1}
                                >
                                    <CloseIcon size="1.5em" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Save & Reset Buttons */}
            <div className="self-end mt-[6rem]">
                <Buttons saveBtn={saveBtn} />
            </div>
        </div>
    );
}

const SwitchStyling = {
    base: cn(
        "inline-flex flex-row-reverse w-full bg-content1 hover:bg-content2 items-center",
        "justify-between cursor-pointer rounded-lg gap-2 px-[0.5em] py-4 border-1 ",
        "data-[selected=true]:border-default"
    ),
    wrapper: "p-0 h-4 overflow-visible",
    thumb: cn(
        "w-6 h-6 border-2 shadow-lg",
        "group-data-[hover=true]:border-primary",
        //selected
        "group-data-[selected=true]:ms-6",
        // pressed
        "group-data-[pressed=true]:w-7",
        "group-data-[selected]:group-data-[pressed]:ms-4"
    ),
};

const AddButton = ({ label, onClick }) => {
    return (
        <Button
            size="sm"
            className="text-xs p-0"
            variant="none"
            startContent={<PlusIcon />}
            onPress={onClick}
            disableAnimation
        >
            {label}
        </Button>
    );
};
