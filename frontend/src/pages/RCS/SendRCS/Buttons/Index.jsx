import React from "react";
import Submit from "./Submit";
import Discard from "./Discard";
import Reset from "./Reset";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import { useNavigate } from "react-router-dom";
// import SendBtn from "./SendBtn";

export default function FooterButtons({ onSubmitHandller }) {
    const { resetSendRcsStore } = useSendRcStore();
    const navigate = useNavigate();

    // reset send rcs
    const resetHandller = () => {
        resetSendRcsStore();
    };

    // discard and route home page
    const discardHandller = () => {
        resetSendRcsStore();
        navigate("/rcsreports"); // redirect rcs report page
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
