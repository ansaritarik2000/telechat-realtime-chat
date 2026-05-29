import { Card, CardHeader, Divider, CardBody } from "@heroui/react";
import { Icon } from "@iconify-icon/react";

export default function IncomingWA() {
    return (
        <Card>
            <CardHeader className="flex-center gap-2 bg-gradient-to-r from-success-50 to-content">
                <Icon icon="logos:whatsapp-icon" width="1.2em" height="1.2em" />
                <p className="font-medium text-sm text-foreground">
                    Incoming WhatsApp Conversation
                </p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="h-4"></div>
            </CardBody>
        </Card>
    );
}
