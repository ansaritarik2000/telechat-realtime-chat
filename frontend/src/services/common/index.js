import { SERVER_DOMAIN } from "../../utils/env";

export const backend_base_url = `${SERVER_DOMAIN}`; // please don't use this is not recommended please use axiosServerInstance
// user details  from local storage
export const firstName = localStorage.getItem("first_name");
export const lastName = localStorage.getItem("last_name");
export const role = localStorage.getItem("role");
export const token = localStorage.getItem("token");

// countries

export const countries = [
    {
        key: "United States",
        code: "US",
        name: "United States",
        flag: "https://flagcdn.com/w40/us.png",
    },
    {
        key: "United Kingdom",
        code: "GB",
        name: "United Kingdom",
        flag: "https://flagcdn.com/w40/gb.png",
    },
    {
        key: "Canada",
        code: "CA",
        name: "Canada",
        flag: "https://flagcdn.com/w40/ca.png",
    },
    {
        key: "France",
        code: "FR",
        name: "France",
        flag: "https://flagcdn.com/w40/fr.png",
    },
    {
        key: "Germany",
        code: "DE",
        name: "Germany",
        flag: "https://flagcdn.com/w40/de.png",
    },
    {
        key: "India",
        code: "IN",
        name: "India",
        flag: "https://flagcdn.com/w40/in.png",
    },
    {
        key: "Japan",
        code: "JP",
        name: "Japan",
        flag: "https://flagcdn.com/w40/jp.png",
    },
    {
        key: "Australia",
        code: "AU",
        name: "Australia",
        flag: "https://flagcdn.com/w40/au.png",
    },
    {
        key: "Brazil",
        code: "BR",
        name: "Brazil",
        flag: "https://flagcdn.com/w40/br.png",
    },
    {
        key: "South Africa",
        code: "ZA",
        name: "South Africa",
        flag: "https://flagcdn.com/w40/za.png",
    },
    {
        key: "Mexico",
        code: "MX",
        name: "Mexico",
        flag: "https://flagcdn.com/w40/mx.png",
    },
    {
        key: "Italy",
        code: "IT",
        name: "Italy",
        flag: "https://flagcdn.com/w40/it.png",
    },
    {
        key: "Spain",
        code: "ES",
        name: "Spain",
        flag: "https://flagcdn.com/w40/es.png",
    },
    {
        key: "Russia",
        code: "RU",
        name: "Russia",
        flag: "https://flagcdn.com/w40/ru.png",
    },
    {
        key: "China",
        code: "CN",
        name: "China",
        flag: "https://flagcdn.com/w40/cn.png",
    },
    {
        key: "Netherlands",
        code: "NL",
        name: "Netherlands",
        flag: "https://flagcdn.com/w40/nl.png",
    },
    {
        key: "Sweden",
        code: "SE",
        name: "Sweden",
        flag: "https://flagcdn.com/w40/se.png",
    },
    {
        key: "Switzerland",
        code: "CH",
        name: "Switzerland",
        flag: "https://flagcdn.com/w40/ch.png",
    },
    {
        key: "Belgium",
        code: "BE",
        name: "Belgium",
        flag: "https://flagcdn.com/w40/be.png",
    },
    {
        key: "Argentina",
        code: "AR",
        name: "Argentina",
        flag: "https://flagcdn.com/w40/ar.png",
    },
    {
        key: "Norway",
        code: "NO",
        name: "Norway",
        flag: "https://flagcdn.com/w40/no.png",
    },
    {
        key: "Finland",
        code: "FI",
        name: "Finland",
        flag: "https://flagcdn.com/w40/fi.png",
    },
    {
        key: "Denmark",
        code: "DK",
        name: "Denmark",
        flag: "https://flagcdn.com/w40/dk.png",
    },
    {
        key: "Ireland",
        code: "IE",
        name: "Ireland",
        flag: "https://flagcdn.com/w40/ie.png",
    },
    {
        key: "Portugal",
        code: "PT",
        name: "Portugal",
        flag: "https://flagcdn.com/w40/pt.png",
    },
    {
        key: "Austria",
        code: "AT",
        name: "Austria",
        flag: "https://flagcdn.com/w40/at.png",
    },
    {
        key: "Poland",
        code: "PL",
        name: "Poland",
        flag: "https://flagcdn.com/w40/pl.png",
    },
    {
        key: "New Zealand",
        code: "NZ",
        name: "New Zealand",
        flag: "https://flagcdn.com/w40/nz.png",
    },
    {
        key: "Greece",
        code: "GR",
        name: "Greece",
        flag: "https://flagcdn.com/w40/gr.png",
    },
    {
        key: "South Korea",
        code: "KR",
        name: "South Korea",
        flag: "https://flagcdn.com/w40/kr.png",
    },
    {
        key: "Turkey",
        code: "TR",
        name: "Turkey",
        flag: "https://flagcdn.com/w40/tr.png",
    },
    {
        key: "Saudi Arabia",
        code: "SA",
        name: "Saudi Arabia",
        flag: "https://flagcdn.com/w40/sa.png",
    },
    {
        key: "Indonesia",
        code: "ID",
        name: "Indonesia",
        flag: "https://flagcdn.com/w40/id.png",
    },
    {
        key: "Thailand",
        code: "TH",
        name: "Thailand",
        flag: "https://flagcdn.com/w40/th.png",
    },
    {
        key: "Vietnam",
        code: "VN",
        name: "Vietnam",
        flag: "https://flagcdn.com/w40/vn.png",
    },
    {
        key: "Malaysia",
        code: "MY",
        name: "Malaysia",
        flag: "https://flagcdn.com/w40/my.png",
    },
    {
        key: "Philippines",
        code: "PH",
        name: "Philippines",
        flag: "https://flagcdn.com/w40/ph.png",
    },
    {
        key: "Singapore",
        code: "SG",
        name: "Singapore",
        flag: "https://flagcdn.com/w40/sg.png",
    },
    {
        key: "Egypt",
        code: "EG",
        name: "Egypt",
        flag: "https://flagcdn.com/w40/eg.png",
    },
    {
        key: "Nigeria",
        code: "NG",
        name: "Nigeria",
        flag: "https://flagcdn.com/w40/ng.png",
    },
    {
        key: "Kenya",
        code: "KE",
        name: "Kenya",
        flag: "https://flagcdn.com/w40/ke.png",
    },
    {
        key: "Pakistan",
        code: "PK",
        name: "Pakistan",
        flag: "https://flagcdn.com/w40/pk.png",
    },
    {
        key: "Bangladesh",
        code: "BD",
        name: "Bangladesh",
        flag: "https://flagcdn.com/w40/bd.png",
    },
    {
        key: "Iran",
        code: "IR",
        name: "Iran",
        flag: "https://flagcdn.com/w40/ir.png",
    },
    {
        key: "Iraq",
        code: "IQ",
        name: "Iraq",
        flag: "https://flagcdn.com/w40/iq.png",
    },
    {
        key: "Israel",
        code: "IL",
        name: "Israel",
        flag: "https://flagcdn.com/w40/il.png",
    },
    {
        key: "Ukraine",
        code: "UA",
        name: "Ukraine",
        flag: "https://flagcdn.com/w40/ua.png",
    },
    {
        key: "United Arab Emirates",
        code: "AE",
        name: "United Arab Emirates",
        flag: "https://flagcdn.com/w40/ae.png",
    },
];
