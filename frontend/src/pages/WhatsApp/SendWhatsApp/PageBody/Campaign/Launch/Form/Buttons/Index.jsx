import React from "react";
import Submit from "./Submit";
import Discard from "./Discard";
import Reset from "./Reset";
import { useNavigate } from "react-router-dom";
import { useSendWhatsappStore } from "../../../../../../../../store/whatsapp/whatsappStore";

export default function FooterButtons({ onSubmitHandller }) {
    const navigate = useNavigate();
    const { resetSendWhatsappStore } = useSendWhatsappStore();
    // discard and route home page
    const discardHandller = () => {
        resetSendWhatsappStore();
        navigate("/wareports"); // redirect rcs report page
    };
    // this will reset the form
    const resetHandller = () => {
        resetSendWhatsappStore();
    };

    return (
        <div className="flex justify-between items-center w-full">
            <div className="flex gap-4">
                <Discard discardHandller={discardHandller} />
                <Reset onClick={resetHandller} />
            </div>

            <div className="flex gap-4">
                <Submit onSubmit={onSubmitHandller} />
            </div>
        </div>
    );
}
