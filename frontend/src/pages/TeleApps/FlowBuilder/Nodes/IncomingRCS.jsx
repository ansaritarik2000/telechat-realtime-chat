import { Card, CardHeader, Divider, CardBody } from "@heroui/react";
import { ColoredRCSIcon } from "../../../../utils/ReusableIcons";

export default function IncomingRCS() {
    return (
        <Card>
            <CardHeader className="flex-center gap-2 bg-gradient-to-r from-primary-50 to-content">
                <ColoredRCSIcon />
                <p className="font-medium text-sm text-foreground">
                    Incoming RCS Conversation
                </p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="h-4"></div>
            </CardBody>
        </Card>
    );
}
