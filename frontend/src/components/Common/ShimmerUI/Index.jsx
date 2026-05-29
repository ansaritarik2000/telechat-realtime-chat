import { Skeleton, Card, Divider } from "@heroui/react";

// Profile Mini pfp Skeleton
export const Minipfp = function ({ width = "16", height = "16" }) {
  return (
    <div className="max-w-[600px] w-full flex items-center gap-10">
      <div>
        <Skeleton className={`flex rounded-full w-${width} h-${height}`} />
      </div>
    </div>
  );
};

// Profile Name Skeleton
export const NameSkeleton = function () {
  return (
    <div className="w-full flex flex-col gap-4">
      <Skeleton className="h-2 w-1/3 rounded-lg" />
    </div>
  );
};

// Profile Info Skeleton
export const ProfileInfoSkeleton = function () {
  return (
    <div className="max-w-[600px] w-full flex items-center  gap-10">
      <div>
        <Skeleton className="flex rounded-full w-36 h-36" />
      </div>
      <div className="flex flex-col gap-8 w-full">
        <div className="w-full flex flex-col gap-4">
          <Skeleton className="h-5 w-4/5 rounded-lg" />
          <Skeleton className="h-4 w-3/5 rounded-lg" />
        </div>
        <div className="w-4/5 mt-4 ">
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// Skeleton Card
export const SkeletonCard = function () {
  return (
    <Card className="w-[350px] space-y-4 p-8 gap-4" radius="lg">
      <Skeleton className="rounded-lg w-20">
        <div className="h-20  rounded-lg bg-default-300"></div>
      </Skeleton>

      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>

      <Divider />

      <div className="flex justify-between items-center">
        <Skeleton className="w-1/5 rounded-lg ">
          <div className="h-3 w-1/5 rounded-lg bg-default-300"></div>
        </Skeleton>

        <Skeleton className="w-1/5 rounded-lg  ">
          <div className="h-3 w-1/5 rounded-lg bg-default-300"></div>
        </Skeleton>
      </div>
    </Card>
  );
};

// Skeleton for Template Preview Cards

export const TemplatePrevSkeleton = function () {
  return (
    <Card className="w-[19.5rem] space-y-5 p-6" radius="lg">
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>
      <div className="space-y-3">
        <Skeleton className="w-full rounded-lg">
          <div className="h-3 w-full rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-1/2  mx-auto  rounded-md">
          <div className="h-6 w-1/2  rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-1/2  mx-auto  rounded-md">
          <div className="h-6 w-1/2  rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-full  mx-auto  rounded-md">
          <div className="h-6 w-full  rounded-lg bg-default-300" />
        </Skeleton>
      </div>
    </Card>
  );
};
