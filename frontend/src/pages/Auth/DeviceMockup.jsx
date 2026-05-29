// @ Used in LeftColContent.jsx

import React from "react";

export default function DeviceMockup({ insideContent }) {
  return (
    <div class="flex items-center justify-center">
      {/* <!-- iPhone 15 Container --> */}
      <div class="relative w-80 h-[340px] rounded-t-[45px]  border-8 border-b-transparent border-[#0de46a]">
        {/* <!-- Dynamic Island --> */}
        <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-[90px] h-[22px] bg-[#0de46a] rounded-full z-20"></div>

        {/* <!-- Screen Content --> */}
        <div class="relative w-full h-full rounded-t-[45px] bg-zinc-900 p-4 shadow-md">
          {/* <!-- Inside Content --> */}
          {insideContent}
        </div>

        {/* <!-- Left Side Buttons --> */}
        {/* <!-- Silent Switch --> */}
        <div class="absolute left-[-12px] top-20 w-[6px] h-8 bg-zinc-900 rounded-l-md shadow-md"></div>

        {/* <!-- Volume Up --> */}
        <div class="absolute left-[-12px] top-36 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>

        {/* <!-- Volume Down --> */}
        <div class="absolute left-[-12px] top-52 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>

        {/* <!-- Right Side Button (Power) --> */}
        <div class="absolute right-[-12px] top-36 w-[6px] h-16 bg-zinc-900 rounded-r-md shadow-md"></div>

        {/* <!-- Flat Bottom Edges --> */}
        <div class="absolute -bottom-2 -left-2 w-2 h-2 bg-[#0de46a]"></div>
        <div class="absolute -bottom-2 -right-2 w-2 h-2 bg-[#0de46a]"></div>
      </div>
    </div>
  );
}

// bg-[#0de46a]/10
// rounded-[45px]
