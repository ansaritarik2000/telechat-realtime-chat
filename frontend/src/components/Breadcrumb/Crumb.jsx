import React from "react";
import PropTypes from "prop-types";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useTranslation } from "react-i18next";

const HomeIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24">
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6l2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2z"
            clipRule="evenodd"></path>
    </svg>
);

const Crumb = ({ secondSib, secondURL, thirdSib }) => {
    const { t } = useTranslation();
    // Validate props if thirdSib is provided
    if (thirdSib && (!secondSib || !secondURL)) {
        console.warn(
            "If thirdSib is provided, both secondSib and secondURL are required."
        );
        return null; // or you could return some fallback UI
    }

    return (
        <div>
            <Breadcrumbs className="text-default-500">
                <BreadcrumbItem href="/" startContent={HomeIcon}>
                    {t("Home")}
                </BreadcrumbItem>
                {secondSib && (
                    <BreadcrumbItem
                        className="text-default-500"
                        href={thirdSib ? secondURL : undefined}>
                        {secondSib}
                    </BreadcrumbItem>
                )}
                {thirdSib && (
                    <BreadcrumbItem className="text-default-500">
                        {thirdSib}
                    </BreadcrumbItem>
                )}
            </Breadcrumbs>
        </div>
    );
};

Crumb.propTypes = {
    secondSib: PropTypes.string,
    secondURL: PropTypes.string,
    thirdSib: PropTypes.string,
};

export default Crumb;
