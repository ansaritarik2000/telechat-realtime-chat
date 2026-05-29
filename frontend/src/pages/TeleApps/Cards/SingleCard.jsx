import React from "react";
import { Card, CardBody, Image, Button, CardFooter, Link } from "@heroui/react";

export default function SingleCard(props) {
  const {
    Title = "Title",
    Desc = "This is your card descripton",
    BtnText = "Click here",
    BtnURL = "/flowbuilder",
    imgURL = "https://picsum.photos/seed/picsum/400/300",
    Text = "Create",
    extURL = "false",
    width = "250",
    height = "250",
  } = props;

  return (
    <div className="w-1/4">
      <Card className="dark:border border-default">
        <CardBody className="overflow-visible ">
          <div className="flex justify-center py-2 ">
            <Image
              alt="Card background"
              className="object-cover rounded-xl "
              src={imgURL}
              width={width}
              height={height}
              isBlurred
            />
          </div>
        </CardBody>
        <CardFooter className="px-6 py-4 justify-between border-t border-t-default">
          <div>
            <p className="font-bold text-default-600">{Title}</p>
            <p className="text-tiny text-default-500">{Desc}</p>
          </div>
          <Button
            className="text-tiny"
            color="success"
            variant="shadow"
            radius="full"
            size="sm"
            href={BtnURL}
            as={Link}
            isExternal={extURL === "true" ? true : false}
          >
            {BtnText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
