import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Chip,
  Textarea,
  DatePicker,
  Input,
  Tooltip,
  Select,
  Button,
  SelectItem,
  Avatar,
  addToast,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
    parseDate,
    getLocalTimeZone,
    CalendarDate,
    today
} from "@internationalized/date";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import { Icon } from "@iconify-icon/react";
import AgentSelector from "./AgentSelector";
import { formatDate, formatDateAndTime, formatDateInUnderScors } from "../TemplateTable/data";
import { createTask, getAgentsId, isDecimal, transformDate, updateCardBackend } from "./TaskTable/utils";
import { useTaskStore } from "../../../../../store/taskManagementStore/useTaskManagementStore";

export default function DrawerComponent({
  selectedCard,
  isDrawerOpen,
  setDrawerOpen,
  defaultPriority,
  setDefaultPriority,
  defaultTitle,
  setDefaultTitle,
  dueDate,
  setDueDate,
  created_at,
  description,
  setDescription,
  agent,
  setAgent,
}) {
  const [selectedPriority, setSelectedPriority] = useState(defaultPriority);
  const [titleValue, setTitleValue] = useState(defaultTitle);
  const [assignId, setAssignId] = useState('');
  const { userId,avatar_value, userRole, updateCard, cards, setMemberId,setIsEditDrawer,isEditDrawer } = useTaskStore();
  // Handle the case of agent to create the task
  useEffect(()=>{
      const agentId = async()=>{
       const assignId =  await getAgentsId(userId);
       setAssignId(assignId)
       setMemberId(assignId)
      }
        agentId()
  },[userId])
  // Handle the change inputs of drawer
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitleValue(newTitle);
    setDefaultTitle(newTitle);
  };
 // Handle the change inputs of drawer
  const handlePriorityChange = (priority) => {
    const newPriority = priority === selectedPriority ? null : priority;
    setSelectedPriority(newPriority);
    setDefaultPriority(newPriority);
  };
 // Handle the change inputs of drawer
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };
 // Handle the change inputs of drawer
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
  };
   // Handle the real time inputs of drawer
  useEffect(() => {
    setSelectedPriority(defaultPriority);
    setTitleValue(defaultTitle);
    setDueDate(dueDate);
    setDescription(description);
    setAgent(agent); 
  }, [defaultPriority, defaultTitle, dueDate, description, agent]);
 // Handle the save data after the drawer close 
  const handleDrawerClose = () => {
    const updatedCard = {
      ...selectedCard,
      title: titleValue,
      priorityStatus: selectedPriority,
      defaultDueDate: dueDate,
      description: description,
      assigned_to: agent!=='undefined'? agent :avatar_value ,
    };
    const transData = {
        assigned_to: updatedCard.assigned_to!==""? updatedCard.assigned_to: assignId,
        created_by: userId,
        defaultDueDate:transformDate(updatedCard.defaultDueDate),
        description: updatedCard.description,
        id: updatedCard.id,
        priorityStatus: updatedCard.priorityStatus,
        task_column: updatedCard.task_column,
        title: updatedCard.title, 
        userId
    }
if(!isEditDrawer){
    updateCard(transData);
    updateBackend(transData)
}
    setDrawerOpen(false);
    setIsEditDrawer(false)
  };

 // Fuction used for  stote the data in backend
  const updateBackend = async (card) => {
    // console.log("Card id",card.id)
    try {
      const transformedData = {
        assigned_to: card.assigned_to!==""? card.assigned_to: userId,
        created_by: card.created_by,
        defaultDueDate:card.defaultDueDate,
        description: card.description,
        id: card.id,
        priorityStatus: card.priorityStatus,
        task_column: card.task_column,
        title: card.title,
      };
     let response;
     if (card.id && isDecimal(card.id)) { 
          response = await createTask(transformedData); 
         if(response.status){
           const UiId = response.task[0].id;
        //    console.log("Data send with updated id",{...transformedData,id: UiId})
           updateCard({...transformedData,id: UiId});
           addToast({
            title: "Task Created",
            description: "The task has been created successfully.",
            color: "success".toLowerCase(),
          });
         }

      } else {

        response = await updateCardBackend(card.id, card);
        if(response.status===false){
            addToast({
                title: "Access Denied",
                description: "You do not have permission to update this task.",
                color: "danger".toLowerCase(),
              });
        }
        else if(response.status){
            updateCard(transformedData);
            addToast({
                title: "Task Updated",
                description: res.msg || "The task has been successfully updated.",
                color: "success".toLowerCase(),
              });
        }
      }

      if (!response) {
        console.warn("No response received from backend");
        return;
      }

    //   console.log("Task successfully created:", response.message);
    } catch (error) {
      console.error("Error updating backend:", error.message);
    }
  };



  return (
    <Drawer backdrop="blur"  isOpen={isDrawerOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-1 ">
          <Icon icon="mingcute:edit-4-line" width="24" height="24" />
          <span>Properties</span>
        </DrawerHeader>
        <DrawerBody>
          {selectedCard ? (
            <div>
              <motion.div
                layout
                className="flex mt-4 flex-col gap-10 rounded-xl border border-default-50 bg-content1 text-sm"
              >
                <Card
                  label="Title"
                  children={
                    <Input 
                      isDisabled={isEditDrawer}
                      variant="bordered"
                      className="min-w-full"
                      value={titleValue}
                      onChange={handleTitleChange}
                    />
                  }
                />
                <Card
                  label={"Created by"}
                  children={
                    <div className="flex justify-start gap-3 items-center">
                      <AvatarIndex size="40" isEditable={false} value={avatar_value} />
                      <Tooltip content="Created on">
                        <p className="text-xs text-default-400">
                          {created_at ? formatDateInUnderScors(created_at) : formatDateAndTime(new Date())}
                        </p>
                      </Tooltip>
                    </div>
                  }
                />
                {['admin','superadmin'].includes(userRole) ? <Card
                  label={"Assigned to"}
                  children={<AgentSelector agent={agent} setAgent={setAgent} />}
                />: null}
                <Card
                  label={"Priority"}
                  children={
                    <div className="flex gap-2 items-center">
                      <PriorityChip
                      isDisabled={isEditDrawer}
                        priority="High"
                        color="danger"
                        isSelected={selectedPriority === "High"}
                        onSelect={() => handlePriorityChange("High")}
                      />
                      <PriorityChip
                      isDisabled={isEditDrawer}
                        priority="Medium"
                        color="primary"
                        isSelected={selectedPriority === "Medium"}
                        onSelect={() => handlePriorityChange("Medium")}
                      />
                      <PriorityChip
                      isDisabled={isEditDrawer}
                        priority="Low"
                        color="warning"
                        isSelected={selectedPriority === "Low"}
                        onSelect={() => handlePriorityChange("Low")}
                      />
                    </div>
                  }
                />
                <Card
                  label="Due Date"
                  children={
                    <DateSelector isDisabled={isEditDrawer} dueDate={dueDate} setDueDate={handleDueDateChange} />
                  }
                />
                <Card
                  label="Description"
                  children={
                    <Textarea
                    isDisabled={isEditDrawer}
                      variant="bordered"
                      className="min-w-full"
                      placeholder="Enter your description"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  }
                />
              </motion.div>
            </div>
          ) : (
            <p>Select a card to see details.</p>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// Property Card
const Card = ({ label, children }) => {
  return (
    <div className="flex items-center gap-10 w-full">
      <p className="font-semibold text-default-500 min-w-[4.4rem] text-xs">{label}</p>
      <div className="w-full">{children}</div>
    </div>
  );
};

// Priority Chip
const PriorityChip = ({ priority, color, isSelected, onSelect,isDisabled }) => {
  return (
    <Chip
      color={isSelected ? color : "default"}
      variant="bordered"
      size="sm"
      radius="sm"
      className="cursor-pointer p-3"
      onClick={onSelect}
      startContent={
        <Icon icon="fluent:sparkle-20-regular" width={15} height={15} />
      }
      isDisabled={isDisabled}
    >
      <div className="flex gap-1 items-center">
        <span>{priority}</span>
      </div>
    </Chip>
  );
};

// Date Selector
const DateSelector = ({ dueDate, setDueDate,isDisabled }) => {
  const parseBackendDate = (dateString) => {
   
    if (!dateString) return null;
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return new CalendarDate(parseInt(year), parseInt(month), parseInt(day));
  };

  const formatDateOutput = (calendarDate) => {
    if (!calendarDate) return "";
    const day = String(calendarDate.day).padStart(2, "0");
    const month = String(calendarDate.month).padStart(2, "0");
    return `${day}-${month}-${calendarDate.year}`;
  };

  const [value, setValue] = React.useState(dueDate ? parseBackendDate(dueDate) : null);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    const formattedDate = formatDateOutput(newValue);
    setDueDate(formattedDate);
  };

  return (
    <div className="w-full flex flex-col gap-y-2">
      <DatePicker
        className="max-w-full"
        variant="bordered"
        value={value}
        onChange={handleDateChange}
        size="sm"
        isDisabled={isDisabled}
      />
      <p className="text-default-500 text-sm">
        Selected date: {value ? formatDateOutput(value) : "--"}
      </p>
    </div>
  );
};