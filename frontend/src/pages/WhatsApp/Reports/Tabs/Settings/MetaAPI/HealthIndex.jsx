import React from "react";
import HealthCard from "./HealthCard";

// Expected Props else with default values
// number = "+91-9028345923",
// username = "Wired",
// status = "Connected",
// reputation = "High",
// messageLimit = "5000",
// country = "India",
// verifiedName = "Wired Technology",

export default function HealthIndex() {
  return (
    <div className="flex gap-4">
      <HealthCard number="+91-9028345923" />
      <HealthCard
        status="Disconnected"
        number="+91-8967345923"
        reputation="Medium"
        messageLimit="10,000"
        username="Telepie "
        verifiedName="Telepie Technology"
      />
    </div>
  );
}
