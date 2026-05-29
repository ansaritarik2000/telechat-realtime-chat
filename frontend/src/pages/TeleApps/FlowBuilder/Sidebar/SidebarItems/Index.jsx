import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFlow } from "../../FlowContext";
import { ParentMenu, ChildMenu } from "./MenuData";
import DividerLabel from "../../../../../components/Common/DividerLabel/Index";

export default function SidebarItems() {
    const { menu } = useFlow();
    console.log("Menu", menu);

    const NewMenu = menu === "ParentMenu" ? ParentMenu : ChildMenu;

    return (
        <div className="-mt-6">
            <ListBoxContainer sections={NewMenu} />
        </div>
    );
}

const ListBoxContainer = ({ sections }) => {
    const { copyNode } = useFlow();
    return (
        <Listbox variant="faded" aria-label="Sidebar menu with sections">
            {sections.map((section, sectionIndex) => (
                <ListboxSection
                    key={sectionIndex}
                    title={<DividerLabel label={section.heading} size="sm" />}
                    // showDivider={sectionIndex < sections.length - 1}
                >
                    {section.items.map((item) => (
                        <ListboxItem
                            key={item.key}
                            description={item?.description}
                            startContent={
                                <Icon
                                    icon={item?.icon || "octicon:person-add-24"}
                                    width="1.2em"
                                    height="1.2em"
                                    className={`text-${item?.color}`}
                                />
                            }
                            className="bg-content2 rounded-lg m-1"
                            onPress={() => copyNode(item.key)}
                        >
                            {item.title}
                        </ListboxItem>
                    ))}
                </ListboxSection>
            ))}
        </Listbox>
    );
};
