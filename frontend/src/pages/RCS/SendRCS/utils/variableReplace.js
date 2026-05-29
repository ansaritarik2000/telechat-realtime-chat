// preview for template variable message
export const replaceMessageVars = (template, validRows) => {
    const updatedMessages = validRows.map((row) => {
        let message = template.template_contents[0].message;
        let customParams = {};
        // Loop through message_vars and replace with value
        template.template_contents[0].message_vars.forEach((variable) => {
            message = message.replace(variable.name, row[variable.value]);
            const variableName = variable.name.match(/{{(.*?)}}/)[1];
            customParams = {
                ...customParams,
                [variableName]: row[variable.value],
            };
        });
        // Loop through fallbackTextVars and replace with value
        if (
            template.fallbackTextVariables &&
            template.fallbackTextVariables.length > 0
        ) {
            template.fallbackTextVariables.forEach((variable) => {
                const variableName = variable.name.match(/{{(.*?)}}/)[1];
                customParams = {
                    ...customParams,
                    [variableName]: row[variable.value],
                };
            });
        }

        // Return the updated message
        return {
            phone_number: row.phonenumber,
            message: message,
            customParams,
        };
    });
    return updatedMessages;
};

// preview for template variable card header and subheader
export const replaceHeaderAndSubHeader = (
    template,
    validRows,
    activeSlider = 0
) => {
    const updatedMessages = validRows.map((row) => {
        let card_heading =
            template.template_contents[activeSlider].card_heading;
        let card_subheading =
            template.template_contents[activeSlider].card_subheading;
        let customParams = {};
        // Loop through card_heading_vars and replace var with value in card heading
        template.template_contents[activeSlider].card_heading_vars &&
            template.template_contents[activeSlider].card_heading_vars.forEach(
                (variable) => {
                    card_heading = card_heading.replace(
                        variable.name,
                        row[variable.value]
                    );
                    const variableName = variable.name.match(/{{(.*?)}}/)[1];
                    customParams = {
                        ...customParams,
                        [variableName]: row[variable.value],
                    };
                }
            );
        // Loop through card_subheading_vars and replace var with value in card subheading
        template.template_contents[activeSlider].card_subheading_vars &&
            template.template_contents[
                activeSlider
            ].card_subheading_vars.forEach((variable) => {
                card_subheading = card_subheading.replace(
                    variable.name,
                    row[variable.value]
                );

                const variableName = variable.name.match(/{{(.*?)}}/)[1];
                customParams = {
                    ...customParams,
                    [variableName]: row[variable.value],
                };
            });

        // Loop through fallbackTextVars and replace with value
        if (
            template.fallbackTextVariables &&
            template.fallbackTextVariables.length > 0
        ) {
            template.fallbackTextVariables.forEach((variable) => {
                const variableName = variable.name.match(/{{(.*?)}}/)[1];
                customParams = {
                    ...customParams,
                    [variableName]: row[variable.value],
                };
            });
        }

        // Return the updated message
        return {
            phone_number: row.phonenumber,
            card_heading,
            card_subheading,
            customParams,
        };
    });
    console.log("updatedMessages", updatedMessages);
    return updatedMessages;
};
