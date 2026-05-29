import React, { useState, useEffect } from "react";

import CalendarBookingIndex from "./BookingCalendar/BookingIndex";

export default function MeetingIndex() {
    return (
        <div className="flex flex-col gap-4">
            {/* Booking Calendar */}
            <div className="flex flex-col items-center justify-center border rounded-lg border-default w-full py-20 gap-6">
                <CalendarBookingIndex />
            </div>
        </div>
    );
}
