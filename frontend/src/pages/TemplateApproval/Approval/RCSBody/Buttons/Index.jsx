import Discard from "./Discard";
import Submit from "./Submit";
import Reset from "./Reset";
import { useNavigate } from "react-router-dom";
import { useTemplateStore } from "../../../../../store/templateApprovalStore";
export default function FooterButtons({
    onSubmitHandller = () => {},
    templateName,
    redirectPath,
}) {
    const { resetStore } = useTemplateStore();
    const navigate = useNavigate();
    const discardHandller = () => {
        resetStore();
        navigate("/");
    };
    return (
        <div className="flex justify-between items-center pt-8">
            <div className="flex gap-3">
                <Discard discardHandller={discardHandller} />
                <Reset />
            </div>

            <Submit
                onsubmit={() => onSubmitHandller()}
                templateName={templateName}
                redirectPath={redirectPath}
            />
        </div>
    );
}
