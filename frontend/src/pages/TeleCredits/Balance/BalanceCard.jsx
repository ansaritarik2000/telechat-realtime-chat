import React from "react";
import { Image } from "@heroui/react";
import { useWalletStore } from "../../../store/wallets/walletStore";

export default function BalanceCard() {
    const { wallet_balance } = useWalletStore();
    return (
        <div className="h-full flex flex-col w-full p-8 bg-primary-50 rounded-md  overflow-hidden relative z-10 border border-primary-200">
            <h1 className="text-2xl font-bold">Current Balance</h1>

            <div className="flex justify-between items-center h-full relative">
                <div className="flex-grow">
                    <span className="text-7xl font-bold text-primary block">
                        {wallet_balance}
                    </span>
                    <span className="text-sm font-bold mt-2 text-default-400 block">
                        TeleCredits
                    </span>
                </div>

                <div className="-mt-7 absolute -right-[30px] top-4">
                    <Image
                        src="telecredits-wallet.png"
                        width={280}
                        className="relative z-20"
                    />
                </div>
            </div>
            <div className="w-72 h-full rounded-l-full bg-white absolute top-0 dark:bg-background right-0"></div>
        </div>
    );
}
