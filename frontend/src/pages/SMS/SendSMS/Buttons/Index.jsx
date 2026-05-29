import React from "react";
import Submit from "./Submit";
import Discard from "./Discard";
import Reset from "./Reset";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { useNavigate } from "react-router-dom";

export default function FooterButtons({ onSubmitHandller }) {
    const { resetSendSmsStore } = useSendSmsStore();
    const navigate = useNavigate();

    // reset send sms
    const resetHandller = () => {
        resetSendSmsStore();
    };

    // discard and route home page
    const discardHandller = () => {
        resetSendSmsStore();
        navigate("/smsreports"); // redirect rcs report page
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
