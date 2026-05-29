import React, { Suspense } from "react";
import { Tabs, Tab } from "@heroui/react";
import CompanyDetails from "./CompanyDetails";
import DefaultUser from "./DefaultUser";
import Pricing from "./Pricing/Index";
import CreditsHistory from "./CreditsHistory/Index";

// Lazy load the tab components
// const CompanyDetails = React.lazy(() => import("./CompanyDetails"));
// const DefaultUser = React.lazy(() => import("./DefaultUser"));
// const Pricing = React.lazy(() => import("./Pricing/Index"));
// const CreditsHistory = React.lazy(() => import("./CreditsHistory/Index"));
// const UpdateCredits = React.lazy(() => import("./UpdateCredits/Index"));

export default function TabSwitcher() {
  const [selected, setSelected] = React.useState("companydetails");

  const handleTabChange = (key) => {
    setSelected(key);
  };

  return (
    <div className="rounded-md h-full">
      <Tabs
        aria-label="Tabs"
        selectedKey={selected}
        variant="solid"
        color="success"
        onSelectionChange={handleTabChange}
        size="lg"
        radius="sm"
        // isVertical={true}
        classNames={{
          tabList: "gap-2 h-full rounded-lg pt-2 ",
          tab: "w-full px-4 h-9",
        }}
      >
        <Tab
          key="companydetails"
          title="Organization Details"
          className="px-2 w-full"
        >
          {/* Company Details */}
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <CompanyDetails />
          {/* </Suspense> */}
        </Tab>

        <Tab key="editusers" title="Default User" className="px-2 w-full">
          {/* Default User */}
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          <DefaultUser />
          {/* </Suspense> */}
        </Tab>

        <Tab key="pricing" title="Service Pricing" className="px-2 w-full">
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          {/* Priocing */}
          <Pricing />
          {/* </Suspense> */}
        </Tab>

        <Tab
          key="updatecredits"
          title="Credit & History"
          className="px-2 w-full"
        >
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          {/* <UpdateCredits /> */}
          <CreditsHistory />
          {/* </Suspense> */}
        </Tab>
      </Tabs>
    </div>
  );
}

// @ Used for testing crash

// import React, { useState } from "react";
// import { Tabs, Tab } from "@heroui/react";

// export default function TabSwitcher() {
//     const [selected, setSelected] = useState("tab1");

//     return (
//         <div className="w-full">
//             <Tabs
//                 aria-label="Simple Tabs"
//                 selectedKey={selected}
//                 onSelectionChange={setSelected}
//                 size="md"
//                 radius="sm"
//                 className="w-full">
//                 <Tab key="tab1" title="Tab 1">
//                     <div className="p-4">This is the content of Tab 1.</div>
//                 </Tab>
//                 <Tab key="tab2" title="Tab 2">
//                     <div className="p-4">This is the content of Tab 2.</div>
//                 </Tab>
//                 <Tab key="tab3" title="Tab 3">
//                     <div className="p-4">This is the content of Tab 3.</div>
//                 </Tab>
//             </Tabs>
//         </div>
//     );
// }
