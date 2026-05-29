import React, { useEffect, useRef, useState } from "react";
import { Card } from "@heroui/react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import emailCampaingnStore from "../../../../store/emailCampaign/emailCampaignStore";
import { backend_base_url } from "../../../../services/common";

const EmailTemplatesColumnView = () => {
    const cardRef = useRef(null);
    const emailCampaingnData = emailCampaingnStore(
        (state) => state.emailCampaingnData
    );
    const [tem1, setTem1] = useState("hidden");
    const [tem2, setTem2] = useState("hidden");
    const [btn, setBtn] = useState("hidden");
    const [savedTemplates, setSavedTemplates] = useState([]);
    const scrollDown = () => {
        if (cardRef.current) {
            cardRef.current.scrollBy({
                top: 100,
                behavior: "smooth",
            });
        }
    };

    // Dynamically show template according the name and template type
    useEffect(() => {
        const tempName = emailCampaingnData.templateName;
        const nameId = async () => {
            const response = await fetch(
                `${backend_base_url}/email/template-name?templatename=${tempName}`
            );

            const templateNameAre = await response.json();
            setSavedTemplates(templateNameAre.data);
            console.log(templateNameAre.data);
        };
        nameId();
    }, [emailCampaingnData.templateName]);

    // return (
    //     <div className="w-full h-[600px] relative group overflow-auto">
    //         {savedTemplates?.map((temdoc, index) => (
    //             <Card
    //                 key={index}
    //                 ref={cardRef}
    //                 className="relative rounded-lg shadow-lg border border-green-200 mb-4"
    //             >
    //                 <img
    //                     src="./emailTemplate_1.jpg"
    //                     alt="Card Image"
    //                     className="w-full h-auto"
    //                 />
    //                 <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0  transition-opacity duration-300 flex items-center justify-center space-x-4">
    //                     <Link to="/email_template_1">
    //                         <div className="flex flex-col items-center text-white">
    //                             {temdoc.templatename}
    //                         </div>
    //                     </Link>
    //                     <div className="flex flex-col items-center text-white hover:text-green-500 cursor-pointer"></div>
    //                 </div>
    //             </Card>
    //         ))}
    //     </div>
    // );

    return (
        <div className="w-full h-full relative group">
            <Card
                ref={cardRef}
                className={`h-full w-full relative rounded-lg shadow-lg border border-green-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 ${tem1}`}
            >
                <img
                    src="./emailTemplate_1.jpg"
                    alt="Card Image"
                    className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <Link to="/email_template_1">
                        <div className="flex flex-col items-center text-white">
                            {" "}
                        </div>
                    </Link>
                    <div className="flex flex-col items-center text-white hover:text-green-500 cursor-pointer"></div>
                </div>
            </Card>

            <Card
                ref={cardRef}
                className={`h-full w-full relative rounded-lg shadow-lg border border-green-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 ${tem2}`}
            >
                <img
                    src="./emailTemplate_2.jpg"
                    alt="Card Image"
                    className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <Link to="/email_template_2">
                        <div className="flex flex-col items-center text-white">
                            {" "}
                        </div>
                    </Link>
                    <div className="flex flex-col items-center text-white hover:text-green-500 cursor-pointer"></div>
                </div>
            </Card>

            {/* Down Arrow Button */}
            <button
                onClick={scrollDown}
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white rounded-full p-1 transition-colors duration-300 ${btn}`}
                aria-label="Scroll Down"
            >
                <Icon
                    icon="ic:baseline-keyboard-arrow-down"
                    width="30"
                    height="30"
                />
            </button>
        </div>
    );
};

export default EmailTemplatesColumnView;
