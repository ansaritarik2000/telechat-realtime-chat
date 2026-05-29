import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import BuilderHeader from "./Header/Header";
import Canvas from "./Canvas";
import TabsComponent from "./Tabs";
import convertEmailTemplateToHTML from "./converter";

// Contexts
const ScreenSizeContext = createContext();
const DragDropLayoutContext = createContext();
const EmailTemplateContext = createContext();
const SelectedElementContext = createContext();
const SelectedTab = createContext();
const IconStyleContext = createContext();

export default function Index() {
    const [screenSize, setScreenSize] = useState("desktop");
    const [dragElementLayout, setDragElementLayout] = useState([]);
    const [emailTemplate, setEmailTemplate] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedTab, setSelectedTab] = useState("elements");
    const [selectedIconStyle, setSelectedIconStyle] = useState("default");
    const [htmlContent, setHtmlContent] = useState("");

    console.log("Rendering Email Template", emailTemplate);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const emailTemplateStorage = JSON.parse(
                localStorage.getItem("emailTemplate")
            );
            if (emailTemplateStorage) {
                setEmailTemplate(emailTemplateStorage);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (emailTemplate && emailTemplate.length > 0) {
                localStorage.setItem(
                    "emailTemplate",
                    JSON.stringify(emailTemplate)
                );
            }
        }
    }, [emailTemplate]);

    useEffect(() => {
        if (selectedElement) {
            let updatedEmailTemplates = [];
            emailTemplate.forEach((item, index) => {
                if (item.id === selectedElement?.layout?.id) {
                    updatedEmailTemplates?.push(selectedElement?.layout);
                } else {
                    updatedEmailTemplates?.push(item);
                }
            });
            setEmailTemplate(updatedEmailTemplates);
        }
    }, [selectedElement]);

    useEffect(() => {
        setHtmlContent(convertEmailTemplateToHTML(emailTemplate));
    }, [emailTemplate]);

    return (
        <ScreenSizeContext.Provider value={{ screenSize, setScreenSize }}>
            <DragDropLayoutContext.Provider
                value={{ dragElementLayout, setDragElementLayout }}
            >
                <EmailTemplateContext.Provider
                    value={{ emailTemplate, setEmailTemplate }}
                >
                    <SelectedElementContext.Provider
                        value={{ selectedElement, setSelectedElement }}
                    >
                        <SelectedTab.Provider
                            value={{ selectedTab, setSelectedTab }}
                        >
                            <IconStyleContext.Provider
                                value={{
                                    selectedIconStyle,
                                    setSelectedIconStyle,
                                }}
                            >
                                <div className="w-full ">
                                    {/* Header */}
                                    <BuilderHeader htmlContent={htmlContent} />
                                    <div className="grid grid-cols-5 bg-gray-100">
                                        {/* Canvas */}
                                        <div className="col-span-4 bg-gray-100">
                                            <Canvas />
                                        </div>

                                        {/* Target Component */}
                                        <div className=" relative  mt-4 h-[90vh]">
                                            <TabsComponent />
                                        </div>
                                    </div>
                                </div>
                            </IconStyleContext.Provider>
                        </SelectedTab.Provider>
                    </SelectedElementContext.Provider>
                </EmailTemplateContext.Provider>
            </DragDropLayoutContext.Provider>
        </ScreenSizeContext.Provider>
    );
}

// Provider Custom Hooks
export const useScreenSize = () => {
    const context = useContext(ScreenSizeContext);
    if (!context) {
        throw new Error(
            "useScreenSize must be used within a ScreenSizeProvider"
        );
    }
    return context;
};

export const useDragDropLayout = () => {
    const context = useContext(DragDropLayoutContext);
    if (!context) {
        throw new Error(
            "useDragDropLayout must be used within a DragDropLayoutProvider"
        );
    }
    return context;
};

export const useEmailTemplate = () => {
    const context = useContext(EmailTemplateContext);
    if (!context) {
        throw new Error(
            "useEmailTemplate must be used within a EmailTemplateProvider"
        );
    }
    return context;
};

export const useSelectedElement = () => {
    const context = useContext(SelectedElementContext);
    if (!context) {
        throw new Error(
            "useSelectedElement must be used within a SelectedElementProvider"
        );
    }
    return context;
};

export const useSelectedTab = () => {
    const context = useContext(SelectedTab);
    if (!context) {
        throw new Error(
            "useSelectedTab must be used within a SelectedTabProvider"
        );
    }
    return context;
};

export const useIconStyle = () => {
    const context = useContext(IconStyleContext);
    if (!context) {
        throw new Error(
            "useIconStyle must be used within an IconStyleProvider"
        );
    }
    return context;
};
