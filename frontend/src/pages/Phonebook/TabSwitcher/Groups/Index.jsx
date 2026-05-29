import { useEffect, useState } from "react";
import Header from "./Header";
import GroupCard from "./GroupCard";
import toast from "react-hot-toast";
import { getGroupsService } from "../../../../services/phonebook/phonebookService";
import { formatDate } from "../../../../utils/formatDate";
import { usePhoneBookStore } from "../../../../store/phonebook/phonebookStore";
import { SkeletonCard } from "../../../../components/Common/ShimmerUI/Index";

export default function Groups() {
    const token = localStorage.getItem("token");
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { groupSortedBy, searchGroupText, resetPhonebookAccounts } =
        usePhoneBookStore();

    // this function is used for fetch groups
    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const params = {
                search: searchGroupText,
                sort: groupSortedBy && [...groupSortedBy][0],
            };
            const response = await getGroupsService(token, params);
            if (response.status === "SUCCESS") {
                setGroups(response.data);
            } else {
                console.log("error", response);
                toast.error("Failed to fetch groups");
            }
        } catch (error) {
            console.log("error", error);
            toast.error("Failed to fetch groups");
        } finally {
            setIsLoading(false);
        }
    };

    // reset zustand phonebook store
    useEffect(() => {
        resetPhonebookAccounts();
    }, []);

    // use effect to fetch groups
    useEffect(() => {
        if (token) {
            fetchGroups();
        }
    }, [token, groupSortedBy, searchGroupText]);

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Groups Header */}
            <Header fetchGroups={fetchGroups} />

            {/* Skeleton */}
            {isLoading && (
                <div className="flex justify-between gap-6 w-full">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            )}

            {/* Render Group Cards */}
            {!isLoading && (
                <div className="grid grid-cols-4 gap-6 w-full justify-items-stretch">
                    {groups?.map((group) => (
                        <GroupCard
                            fetchGroups={fetchGroups}
                            key={group.id}
                            id={group.id}
                            name={group.group_name}
                            avatar_type={group.avatar_type}
                            avatar_value={group.avatar_value}
                            createdOn={
                                group.created_at
                                    ? formatDate(new Date(group.created_at))
                                    : ""
                            }
                            members={
                                group.contact_ids ? group.contact_ids.length : 0
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
