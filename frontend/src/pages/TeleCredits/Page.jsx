import React from "react";
import Crumb from "../../components/Breadcrumb/Crumb";
import TopupCard from "./Topup/TopupCard";
import BalanceCard from "./Balance/BalanceCard";
import TabsSwitcher from "./Tabs/TabsSwitcher";

export default function TeleCreditsPage() {
  return (
    <div className="px-4">
      <Crumb secondSib="TeleCredits" />
      <div className="grid grid-cols-6 gap-x-4 gap-y-8 mt-10 max-w-screen-2xl mx-auto">
        {/* Topup Card */}
        <div className="col-span-3">
          <TopupCard />
        </div>

        {/* Balance Card */}
        <div className="col-span-3">
          <BalanceCard />
        </div>

        {/* Tabs */}
        <div className="col-span-6">
          <TabsSwitcher />
        </div>
      </div>
    </div>
  );
}
