/**This translation use of i18nexus api */

// import i18next from "i18next";
// import HttpBackend from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector";
// import { initReactI18next } from "react-i18next";

// const apiKey = "5TXSm4GlgemPMOb7H2cXKA";
// const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${apiKey}`;

// i18next
//     .use(HttpBackend)
//     .use(LanguageDetector)
//     .use(initReactI18next)
//     .init({
//         fallbackLng: "en",

//         ns: ["default"],
//         defaultNS: "default",

//         supportedLngs: ["en", "mr", "hi", "te", "kn", "ta"], // add here supported language

//         backend: {
//             loadPath: loadPath,
//         },
//     });

/**This Translation use of custom json**/
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import englishJson from "./languages/en.json";
import telguJson from "./languages/te.json";
import hindiJson from "./languages/hi.json";
import kannadaJson from "./languages/kn.json";
import marathiJson from "./languages/mr.json";
import tamilJosn from "./languages/ta.json";

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: englishJson,
            },
            te: {
                translation: telguJson,
            },
            hi: {
                translation: hindiJson,
            },
            kn: {
                translation: kannadaJson,
            },
            mr: {
                translation: marathiJson,
            },
            ta: {
                translation: tamilJosn,
            },
        },
    });

export default i18n;
