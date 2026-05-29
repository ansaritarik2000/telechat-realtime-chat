import React from "react";
import SupportPage from "./Page";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function SupportTicket() {
  return (
    <div>
      <Sidebar Page={<SupportPage />} />
    </div>
  );
}
