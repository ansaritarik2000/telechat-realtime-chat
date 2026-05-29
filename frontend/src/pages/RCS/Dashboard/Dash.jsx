import React from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Page from "./Page";

export default function RCSDash() {
  return (
    <div>
      <Sidebar Page={<Page />} />
    </div>
  );
}
