// import WATemplate from "../../../../../../../components/WAMockup/Index";
import { lazy, Suspense } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
const WAPreviewMockup = lazy(() =>
    import("../../../../../../../components/WAMockup/WACampaignPreview/Index")
);

export default function Preview() {
    return (
        <Card className="dark:border border-default h-full">
            <CardHeader className="p-3 bg-content2 flex-column">
                <p className="font-semibold text-md text-success-700">
                    Preview Mockup
                </p>
                <p className="text-xs text-default-500">
                    Real time preview of end user message
                </p>
            </CardHeader>
            <CardBody>
                <Suspense fallback={<div>Loading Mockup...</div>}>
                    <div className="flex w-full justify-center mt-4 h-full">
                        <WAPreviewMockup />
                    </div>
                </Suspense>
            </CardBody>
        </Card>
    );
}
