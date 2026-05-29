import React, { useEffect, useState } from "react";
import { 
  ScrollShadow,
  Chip,
  Tooltip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  addToast
} from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify-icon/react";
import { TrashIcon, PlusIcon } from "../../../../../utils/ReusableIcons";
import DrawerComponent from "./DrawerComponent";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import { deleteCardBackend, formatDateForduedate, getTask, updateCardBackend } from "./TaskTable/utils";
import axios from "axios";
import { backend_base_url } from "../../../../../services/common";
import { useTaskStore } from "../../../../../store/taskManagementStore/useTaskManagementStore";


export const CustomKanban = () => {
    return (
        <div className="h-full w-full ">
            <Board />
        </div>
    );
};

const Board = () => {
  const { cards, setCards } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTask();
        // Create a new array with new object references
        const freshCards = data.task.map(task => ({
          ...task,
        }));
        setCards(freshCards);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [setCards]);

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error}</div>;

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll">
      <Column
        title="Backlog"
        task_column="backlog"
        headingColor="text-danger-500"
        colColor="danger-500"
      />
      <Column
        title="Todo"
        task_column="todo"
        headingColor="text-secondary-500"
        colColor="secondary-500"
      />
      <Column
        title="In Progress"
        task_column="inprogress"
        headingColor="text-primary-500"
        colColor="primary-500"
      />
      <Column
        title="Completed"
        task_column="completed"
        headingColor="text-success-500"
        colColor="success-500"
      />
      <BurnBarrel />
    </div>
  );
};

const Column = ({ title, headingColor, task_column, colColor }) => {
  const { cards, setCards, updateCard,userId} = useTaskStore();
  const [active, setActive] = useState(false);
  
  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = async (e) => {
    
    const cardId = +e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = +element.dataset.before || "-1";
    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      // Save original column for potential rollback
      const originalColumn = cardToTransfer.task_column;
      
      // Optimistically update local state
      cardToTransfer = { ...cardToTransfer, task_column };
      
      copy = copy.filter((c) => c.id !== cardId);
      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      setCards(copy);

      try {
        // Update backend
        const response = await updateCardBackend(cardId, {userId, task_column });
        
        if (!response?.status) {
          addToast({
            title: `Access Denied:`,
            description:"Unauthorized: Agents can only delete their own tasks.",
            color: "danger",
          });
          // Rollback if backend update fails
          const rollbackCopy = [...copy];
          const rollbackCard = rollbackCopy.find((c) => c.id === cardId);
          if (rollbackCard) {
            rollbackCard.task_column = originalColumn;
            setCards(rollbackCopy);
          }
        }
        else {
          // Update local state with backend data if necessary
          addToast({
            title: `Task Status`,
            description:"The task staus changed successfully.",
            color: "success",
          });
        }
      } catch (error) {
        console.error("Error updating column:", error);
        // Rollback on error
        const rollbackCopy = [...copy];
        const rollbackCard = rollbackCopy.find((c) => c.id === cardId);
        if (rollbackCard) {
          rollbackCard.task_column = originalColumn;
          setCards(rollbackCopy);
        }
      }
    }
  };
   

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

    const getIndicators = () => {
        return Array.from(
            document.querySelectorAll(`[data-column="${task_column}"]`)
        );
    };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };
  const filteredCards = cards?.filter((c) => c.task_column === task_column);

  return (
    <ScrollShadow className="w-[350px] " orientation="horizontal">
      <div className=" bg-content2 shrink-0 rounded-xl py-6 px-6 ">
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-medium text-lg ${headingColor}`}>{title}</h3>
          <Tooltip content="Total tasks">
            <span
              className={`rounded-full flex items-center text-xs justify-center bg-success-100 text-success-800 w-6 h-6`}
            >
              {filteredCards.length}
            </span>
          </Tooltip>
        </div>
        <div
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`h-fit w-full transition-colors`}
        >
          {filteredCards.map((c) => {
            return (
              <Card
                key={c.id}
                {...c}
                handleDragStart={handleDragStart}
                priorityStatus={c.priorityStatus}
                defaultDueDate={c.defaultDueDate}
                created_at={c.created_at}
                defaultDescription={c.description}
                defaultAgent={c.assigned_to}
              />
            );
          })}
          <DropIndicator beforeId={null} task_column={task_column} />
          <AddCard task_column={task_column} colColor={colColor} />
        </div>
      </div>
    </ScrollShadow>
  );
};

const Card = ({
  title,
  id,
  task_column,
  handleDragStart,
  priorityStatus,
  defaultDueDate,
  created_at,
  defaultDescription,
  defaultAgent,
}) => {
  const { cards, userId, userRole, memberId,selectedCard, setSelectedCard,setIsEditDrawer} = useTaskStore(); // Access the cards from the store
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  // const [selectedCard, setSelectedCard] = useState(null);
  const [agent, setAgent] = useState(defaultAgent);
  const [avatar, setAvatar] = useState(null);
  const [defaultPriority, setDefaultPriority] = useState(priorityStatus);
  const [defaultTitle, setDefaultTitle] = useState(title);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [description, setDescription] = useState(defaultDescription);
  const [agentAvatar, setAgentAvatar] = useState(null);

  // Fetch the latest card data from the store whenever the cards array changes
  useEffect(() => {
    const currentCard = cards.find((card) => card.id === id);

    if (currentCard) {
      setDefaultTitle(currentCard.title);
      setDefaultPriority(currentCard.priorityStatus);
      setDueDate(currentCard.defaultDueDate);
      setDescription(currentCard.description);
      setAgent(currentCard.assigned_to);
    }
  }, [cards, id]);

  // Fetch the agent's avatar
  useEffect(() => {
    const setupAvatar = async () => {
      if (agent) {
        const valueAv = await axios.get(`${backend_base_url}/member/member/${agent}`);
        setAgentAvatar(valueAv?.data?.data?.avatar_value);
      }
    };
    setupAvatar();
  }, [agent]);

  const handleCardClick = async() => {
  const currentCard = cards.find((card) => card.id === id);
  const canEdit = (
    (userRole === "Agent" && +userId !== currentCard.created_by)
  );
  if(canEdit){
    setIsEditDrawer(true)
  }

  if (currentCard) {
    setSelectedCard({
      title: currentCard.title,
      id: currentCard.id,
      task_column: currentCard.task_column,
      priorityStatus: currentCard.priorityStatus,
      defaultDueDate: currentCard.defaultDueDate,
      created_at: currentCard.created_at,
      description: currentCard.description,
      agent: currentCard.assigned_to || "", 
    });
  }


  setDrawerOpen(true);
    setAvatar(<AvatarIndex size="40" isEditable={false} value={agentAvatar} />);
  };

  return (
    <>
      <DropIndicator beforeId={id} task_column={task_column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { defaultTitle, id, task_column })}
        onClick={handleCardClick}
        className="cursor-grab text-wrap flex flex-col gap-3 mb-2 rounded-xl shadow-sm border border-default-50 bg-content1 p-4 active:cursor-grabbing"
      >
        <p className="text-sm mb-4">{defaultTitle}</p>
        <div className="flex justify-between">
          {defaultPriority ? (
            <Chip
              color={
                defaultPriority === "High"
                  ? "danger"
                  : defaultPriority === "Medium"
                  ? "primary"
                  : defaultPriority === "Low"
                  ? "warning"
                  : "default"
              }
              variant="flat"
              size="sm"
              radius="sm"
              className="cursor-pointer p-3"
              startContent={
                <Icon icon="fluent:sparkle-20-regular" width={15} height={15} />
              }
            >
              <div className="flex gap-1 items-center">
                <span className="text-xs">{defaultPriority}</span>
              </div>
            </Chip>
          ) : (
            <div></div>
          )}
          <AvatarIndex size="25" isEditable={false} value={agentAvatar} />
        </div>
        <div className="space-y-2">
          <Divider />
          <Tooltip content="Due Date" placement="right">
            <div className="flex justify-end gap-1 items-center text-default-500 text-xs">
              <Icon
                icon="lets-icons:calendar-duotone"
                className="text-default-900"
                width={"1.3em"}
              />
              <span>{formatDateForduedate(dueDate)}</span>
            </div>
          </Tooltip>
        </div>
      </motion.div>
      <DrawerComponent
        isDrawerOpen={isDrawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedCard={selectedCard}
        avatar={avatar}
        defaultPriority={defaultPriority}
        setDefaultPriority={setDefaultPriority}
        defaultTitle={defaultTitle}
        setDefaultTitle={setDefaultTitle}
        dueDate={dueDate}
        setDueDate={setDueDate}
        created_at={created_at}
        description={description}
        setDescription={setDescription}
        agent={agent}
        setAgent={setAgent}
      />
    </>
  );
};

const DropIndicator = ({ beforeId, task_column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={task_column}
      className="my-0.5 h-1 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = () => {
  const { cards, setCards, deleteCard,userId, userRole} = useTaskStore();
  const [active, setActive] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

  const handleDragEnd = (e) => {
    onOpen();
    const cardId = e.dataTransfer.getData("cardId");
    setCardToDelete(cardId);
    setActive(false);
  };

  const confirmDelete = async () => {
    
    try {
      const isTemporaryId = /^0\./.test(cardToDelete);
      if(isTemporaryId){
        setCards(cards?.filter((card)=>card.id != cardToDelete));
        deleteCard(cardToDelete); // This updates the UI immediately
        addToast({
          title: "Task Deleted",
          description:"The task has been successfully deleted",
          color: "success",
        });
        return
      }
      const res = await deleteCardBackend(cardToDelete, userId);
      if (res.success === 'failed') {
        addToast({
          title: "Access Denied",
          description: "Access Denied: You cannot delete this task.",
          color: "danger",
        });
      } else if (res.status) {
        setCards(cards?.filter((card)=>card.id != cardToDelete));
        deleteCard(cardToDelete); // This updates the UI immediately
        addToast({
          title: "Task Deleted",
          description: res.msg || "The task has been successfully deleted",
          color: "success",
        });
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      addToast({
        title: "Task Deletion Failed",
        description: "You are not authorized to delete this task, or an error occurred.",
        color: "danger",
      });
    } finally {
      setCardToDelete(null);
      onClose();
    }
  };

  const cancelDelete = () => {
    setCardToDelete(null);
    onClose();
  };

  return (
    <>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`grid h-full w-[180px] shrink-0 place-content-center text-3xl rounded-xl ${
          active
            ? "border-red-800 bg-red-800/20 text-red-500"
            : " bg-content2 text-neutral-500"
        }`}
      >
        {active ? (
          <Icon
            icon="noto:fire"
            width="60"
            height="60"
            className="animate-bounce"
          />
        ) : (
          <TrashIcon customClass="text-default-400" />
        )}
      </div>
      {cardToDelete && (
        <Modal isOpen={isOpen} size="sm" onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Task Card</ModalHeader>
                <ModalBody>
                  <p>Are you sure you want to delete this task?</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={cancelDelete}>
                    Cancel
                  </Button>
                  <Button
                   
                    color="danger"
                    variant="flat"
                    onPress={confirmDelete}
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

const AddCard = ({ task_column, colColor = "default-500" }) => {
  const { isDrawerOpen, setDrawerOpen, addCard } = useTaskStore();
  const [newCard, setNewCard] = useState(null);

  const AddingCard = () => {
    const newCard = {
      task_column,
      title: 'New Task',
      id: Math.random().toString(),
      priorityStatus: '',
      defaultDueDate: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      description: '',
      assigned_to: null,
    };
    // Only proceed if we have a valid title (though we're setting a default now)
    if (newCard.title.trim()) {
      addCard(newCard);
      setNewCard(newCard);
      setDrawerOpen(true);
    }
  };

  return (
    <>
      <motion.button
        layout
        onClick={AddingCard}
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-default-500"
      >
        <span className={`text-${colColor}`}>Add card</span>
        <PlusIcon customClass={`text-${colColor}`} />
      </motion.button>
      {newCard && (
        <DrawerComponent
          isDrawerOpen={isDrawerOpen}
          setDrawerOpen={setDrawerOpen}
          selectedCard={newCard}
          avatar={<AvatarIndex size="40" isEditable={false} value={newCard.title} />}
          defaultPriority={newCard.priorityStatus}
          setDefaultPriority={(priority) => {
            setNewCard({ ...newCard, priorityStatus: priority });
          }}
          defaultTitle={newCard.title}
          setDefaultTitle={(title) => {
            setNewCard({ ...newCard, title });
          }}
          dueDate={newCard.defaultDueDate}
          setDueDate={(date) => {
            setNewCard({ ...newCard, defaultDueDate: date });
          }}
          created_at={newCard.created_at}
          description={newCard.description}
          setDescription={(description) => {
            setNewCard({ ...newCard, description: description });
          }}
          agent={newCard.assigned_to}
          setAgent={(agent) => {
            setNewCard({ ...newCard, assigned_to: agent });
          }}
        />
      )}
    </>
  );
};