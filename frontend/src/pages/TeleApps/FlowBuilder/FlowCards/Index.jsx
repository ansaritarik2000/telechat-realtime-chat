import Crumb from "../../../../components/Breadcrumb/Crumb";
import Header from "./Header";
import FlowCard from "./FlowCard";
import { useEffect, useState } from "react";
import { getAllFlowsService } from "../../../../services/flow/flowServices";
import { availableNodes } from "../Nodes";
import { updateNodeLabels } from "../utils/updateNodeLabels";
import { useTranslation } from "react-i18next";

export default function FlowCardsIndex() {
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    // Fetch all flows on component mount
    useEffect(() => {
        const fetchFlows = async () => {
            const response = await getAllFlowsService();
            if (response.status === "SUCCESS") {
                // Update node labels in each flow data
                const updatedFlows = updateNodeLabels(response.data);
                setFlows(updatedFlows);
            } else {
                console.error("Error fetching flows:", response.message);
            }
            setLoading(false);
        };

        fetchFlows();
    }, []);

    return (
        <div className="w-full flex flex-col gap-4 ">
            {/* Crumbs */}
            <Crumb
                secondSib={t("TeleApps")}
                secondURL={"/teleapps"}
                thirdSib={t("Flow Builder")}
            />
            {/* Groups Header */}
            <Header />

            {/* Loading State */}
            {loading ? (
                <p>Loading flows...</p>
            ) : (
                <div className="grid grid-cols-4 gap-6 w-full">
                    {flows.length > 0 ? (
                        flows.map((flow) => (
                            <FlowCard
                                key={flow.id}
                                id={flow.id}
                                name={flow.name}
                                flow_data={flow.flow_data}
                                is_draft={flow.is_draft}
                            />
                        ))
                    ) : (
                        <div>
                            <p>No flows available</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
