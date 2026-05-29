import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import { getAgents } from "./TaskTable/utils";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import { useTaskStore } from "../../../../../store/taskManagementStore/useTaskManagementStore";

export default function AgentSelector({ agent, setAgent }) {
  // console.log("agentbbb",agent)
  const {agents,setAgents } = useTaskStore()

  const [selectedAgent, setSelectedAgent] = useState(new Set([agent])); // Initialize selected agent
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token is missing");
      return;
    }

    const fetchAgents = async () => {
      const { data } = await getAgents(token);
      setAgents(data);
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    setSelectedAgent(new Set([agent])); // Update selected agent when `agent` prop changes
  }, [agent]);

  const handleSelectionChange = (keys) => {
    const selectedId = Array.from(keys)[0]; // Convert Set to array and get the first value
    setSelectedAgent(new Set([selectedId])); // Update local state
    setAgent(selectedId); // Update parent state
  };

  return (
    <Select
      selectedKeys={selectedAgent} // Set the selected agent properly
      onSelectionChange={handleSelectionChange} // Update state on change
      classNames={{
        base: "max-w-xs",
        trigger: "h-12",
      }}
      items={agents}
      variant="bordered"
      labelPlacement="outside"
      aria-label='agae'
      placeholder="Select agent"
      renderValue={(items) =>
        items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <AvatarIndex
              alt={item.data.name}
              className="flex-shrink-0"
              size="sm"
              isEditable={false}
              value={item.data.name}
            />
            <div className="flex flex-col">
              <span>{item.data.name}</span>
              <span className="text-default-500 text-tiny">
                ({item.data.email})
              </span>
            </div>
          </div>
        ))
      }
    >
      {(user) => (
        <SelectItem key={user.id} textValue={user.name} >
          <div className="flex gap-2 items-center">
            <AvatarIndex
              alt={user.name}
              className="flex-shrink-0"
              size="sm"
              isEditable={false}
              value={user.name}
            />
            <div className="flex flex-col">
              <span className="text-small">{user.name}</span>
              <span className="text-tiny text-default-400">{user.email}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
