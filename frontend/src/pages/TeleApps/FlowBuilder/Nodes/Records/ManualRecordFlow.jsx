import { Card, CardHeader, Divider, CardBody } from "@heroui/react";
import { Icon } from "@iconify-icon/react";

export default function ManualRecordFlow() {
    return (
        <Card className="w-60">
            <CardHeader className="flex-start gap-2 bg-gradient-to-r from-primary-50 to-content">
                <Icon
                    icon="mingcute:folder-upload-line"
                    width="1.2em"
                    height="1.2em"
                    className="text-primary"
                />
                <p className="font-medium text-sm text-foreground">
                    Manual Record Flow
                </p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="h-6"></div>
            </CardBody>
        </Card>
    );
}
