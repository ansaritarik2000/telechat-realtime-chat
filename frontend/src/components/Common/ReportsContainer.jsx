import React from "react";

export default function ReportsContainer({ children }) {
    return (
        <section className="flex flex-col gap-6">
            <div className="p-6 border border-default rounded-lg shadow-sm flex flex-col gap-8 bg-content">
                {children}
            </div>
        </section>
    );
}
