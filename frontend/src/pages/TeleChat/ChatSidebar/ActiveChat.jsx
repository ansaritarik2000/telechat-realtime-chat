import React, { useEffect, useRef, useState } from "react";
import { Image, Badge, Tooltip } from "@heroui/react";
import { getActiveMembersService } from "../../../../../services/members/memberService";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import { Icon } from "@iconify-icon/react";

export default function ActiveChats() {
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
          scrollRef.current.scrollWidth
      );
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkScroll, 300); // Delay check for smooth UI update
    }
  };

  useEffect(() => {
    const fetchActiveChats = async () => {
      setLoading(true);
      try {
        const response = await getActiveMembersService();
        if (response.status === "SUCCESS") {
          setActiveChats(response.data);
        } else {
          toast.error("Failed to fetch active members!");
          console.error("Error:", response.message);
        }
      } catch (error) {
        toast.error("Something went wrong while fetching active members!");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveChats();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      checkScroll();
      scrollRef.current.addEventListener("scroll", checkScroll);

      // Cleanup function with a null check
      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener("scroll", checkScroll);
        }
      };
    }
  }, [activeChats]);

  return (
    // <div
    //   className="relative w-full p-3 bg-white dark:bg-background border-gray-300"
    //   onMouseEnter={() => setIsHovered(true)}
    //   onMouseLeave={() => setIsHovered(false)}
    // >
    //   <h2 className="text-lg font-semibold text-gray-600">Active Member</h2>

    //   <div className="flex items-center space-x-2`">
    //     {/* Left Arrow (Hidden Initially) */}
    //     {isHovered && canScrollLeft && (
    //       <button
    //         className="absolute left-0 z-10 p-2 bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition text-xl"
    //         onClick={() => scroll("left")}
    //       >
    //         ◀
    //       </button>
    //     )}

    //     {/* Scrollable Member List */}
    //     <div
    //       ref={scrollRef}
    //       className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
    //       // style={{ width: "230px" }}
    //     >
    //       {activeChats.map((chat, index) => {
    //         const [firstName, ...lastName] = chat.full_name.split(" ");
    //         return (
    //           <div
    //             key={index}
    //             className="flex flex-col items-center gap-1 p-2 rounded-lg dark:hover:bg-gray-700 cursor-pointer transition duration-200 w-max"
    //           >
    //             <Badge
    //               content=""
    //               color="success"
    //               size="sm"
    //               shape="circle"
    //               placement="bottom-right"
    //               className="absolute bottom-1 right-1"
    //             >
    //               <AvatarIndex
    //                 isEditable={false}
    //                 avatarType={chat.avatar_type}
    //                 value={chat.avatar_value}
    //                 size={40}
    //               />
    //             </Badge>
    //             <p className="text-sm text-center">{firstName}</p>
    //             <p className="text-sm text-center">{lastName.join(" ")}</p>
    //           </div>
    //         );
    //       })}
    //     </div>

    //     {/* Right Arrow (Hidden When No More Content) */}
    //     {isHovered && canScrollRight && (
    //       <button
    //         className="absolute right-0 z-10 p-2 bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition text-xl"
    //         onClick={() => scroll("right")}
    //       >
    //         ▶
    //       </button>
    //     )}
    //   </div>
    // </div>
    <div className="relative w-full p-2 -mt-2 bg-white dark:bg-background border-gray-300">
      <h2 className="text-md font-semibold text-gray-600">Active Members</h2>

      <div className="flex items-center">
        {" "}
        {/* Parent Flexbox */}
        {/* Left Arrow (Visible Only When Scroll Possible) */}
        {canScrollLeft && (
          <button
            className="bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition text-xl"
            onClick={() => scroll("left")}
          >
            <Icon icon="ep:arrow-left-bold" width="18" height="24" />
            {/* <Icon icon="fluent:ios-arrow-left-24-regular" width="24" height="24" /> */}
          </button>
        )}
        {/* Scrollable Member List */}
        {/* <div
         ref={scrollRef}
         className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth flex-grow"
       >
         {activeChats.map((chat, index) => {
           const [firstName, ...lastName] = chat.full_name.split(" ");
           return (
             <div
               key={index}
               className="flex flex-col items-center gap-1 p-2 rounded-lg dark:hover:bg-gray-700 cursor-pointer transition duration-200 w-max"
             >
               <Badge
                 content=""
                 color="success"
                 size="sm"
                 shape="circle"
                 placement="bottom-right"
                 className="absolute bottom-1 right-1"
               >
                 <AvatarIndex
                   isEditable={false}
                   avatarType={chat.avatar_type}
                   value={chat.avatar_value}
                   size={40}
                 />
               </Badge>
               <p className="text-sm text-center">{firstName}</p>
               <p className="text-sm text-center">{lastName.join(" ")}</p>
             </div>
           );
         })}
       </div> */}
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth flex-grow"
        >
          {activeChats.map((chat, index) => {
            const fullName = chat.full_name;
            return (
              <Tooltip showArrow={true} placement="top" content={fullName}>
                <div
                  className="flex flex-col items-center gap-1 p-2 rounded-lg dark:hover:bg-gray-700 cursor-pointer transition duration-200 w-max"
                  onMouseEnter={(e) =>
                    e.currentTarget.setAttribute("data-show-tooltip", "true")
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.removeAttribute("data-show-tooltip")
                  }
                >
                  <Badge
                    content=""
                    color="success"
                    size="sm"
                    shape="circle"
                    placement="bottom-right"
                    className="absolute bottom-1 right-1"
                  >
                    <AvatarIndex
                      isEditable={false}
                      avatarType={chat.avatar_type}
                      value={chat.avatar_value}
                      size={40}
                    />
                  </Badge>
                </div>
              </Tooltip>
            );
          })}
        </div>
    
        {/* Right Arrow (Visible Only When Scroll Possible) */}
        {canScrollRight && (
          <button
            className="p-2 mt-2 bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition text-xl"
            onClick={() => scroll("right")}
          >
            <Icon icon="ep:arrow-right-bold" width="18" height="24" />
          </button>
        )}
      </div>
    </div>
  );
}
