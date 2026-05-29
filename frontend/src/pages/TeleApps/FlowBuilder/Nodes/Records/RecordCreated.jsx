import { Card, CardHeader, Divider, CardBody } from "@heroui/react";
import { Icon } from "@iconify-icon/react";

export default function RecordCreated() {
    return (
        <Card className="w-48">
            <CardHeader className="flex-start gap-2 bg-gradient-to-r from-primary-50 to-content">
                <Icon
                    icon="tabler:folder-plus"
                    width="1.2em"
                    height="1.2em"
                    className="text-primary"
                />
                <p className="font-medium text-sm text-foreground">
                    Record Created
                </p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="h-6"></div>
            </CardBody>
        </Card>
    );
}
