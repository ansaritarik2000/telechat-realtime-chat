import { useContext, useEffect, useState } from "react";
import {
  Input,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Checkbox,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import CsvUpload from "./CsvUpload";
import { useTranslation } from "react-i18next";
import AvatarIndex from "../../../../components/AvatarGen/Index";
import ContactsTable from "../Contacts/Index";
import {
  createGroupFromExcelService,
  createGroupService,
} from "../../../../services/phonebook/phonebookService";
import toast from "react-hot-toast";
import { usePhoneBookStore } from "../../../../store/phonebook/phonebookStore";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { IPInfoContext } from "ip-info-react";

export default function Header({ fetchGroups }) {
  const {
    groupSortedBy: selectedKey,
    setGroupSortedBy: setSelectedKey,
    searchGroupText,
    setSearchGroupText,
  } = usePhoneBookStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [avatarType, setAvatarType] = useState("character");
  const [avatarValue, setAvatarValue] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const userInfo = useContext(IPInfoContext);
  const token = localStorage.getItem("token");
  const {
    groupFile: file,
    resetPhonebookAccounts,
    selectedKeys,
    setGroupFile,
  } = usePhoneBookStore();
  const { t } = useTranslation();

  // this function is used for tab changes
  const onTabChanges = (key) => {
    setActiveTab(key); // Update active tab state with the key
    // setFile(null);
  };

  useEffect(() => {
    // parse csv files
    const parseCSV = (file) => {
      Papa.parse(file, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true, // Skip empty rows
        complete: (result) => {
          setTotalMembers(result?.data?.length || 0); // set total members
        },
        error: (err) => {
          console.error("Error parsing CSV file:", err);
        },
      });
    };

    // parse excel files
    const parseExcel = (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1, // Use the first row as the header row
          defval: "", // Default value for empty cells
        });

        // Send parsed data to parent
        const [headers, ...rows] = parsedData;
        const formattedData = rows.map((row) =>
          headers.reduce(
            (acc, header, index) => ({
              ...acc,
              [header]: row[index] || "",
            }),
            {}
          )
        );
        setTotalMembers(formattedData?.length || 0); // set total members
      };
      reader.readAsArrayBuffer(file);
    };

    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension === "csv") {
        parseCSV(file);
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        parseExcel(file);
      } else {
        console.error("Unsupported file format");
      }
    }
  }, [file]);

  // this funtion is used for shape type handller
  const shapTypeHandller = (type, value) => {
    setAvatarType(type);
    if (type === "character") {
      const value = groupName;
      setAvatarValue(value);
    } else {
      setAvatarValue(value);
    }
  };

  // this function is used for create group
  const createGroupHandler = async () => {
    const response =
      activeTab === "upload"
        ? await createGroupFromExcelService(file, token, {
            group_name: groupName,
            avatar_type: avatarType,
            avatar_value: avatarValue,
            remove_duplicates: removeDuplicates,
            country_code: userInfo?.country_calling_code,
          })
        : await createGroupService(
            {
              group_name: groupName,
              avatar_type: avatarType,
              avatar_value: avatarValue,
              contact_ids: [...selectedKeys],
            },
            token
          );
    if (response.status === "SUCCESS") {
      toast.success("Group created successfully");
      onClose();
      fetchGroups();
    } else {
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        {/* Search Input */}
        <Input
          isClearable
          className="max-w-[300px] w-full"
          value={searchGroupText}
          onChange={(e) => {
            setSearchGroupText(e.target.value);
          }}
          placeholder={t("Search...")}
          startContent={
            <Icon icon="majesticons:search-line" width="1.2em" height="1.2em" />
          }
          onClear={() => setSearchGroupText("")}
        />

        <div className="flex gap-4">
          {/* Sort by filter */}
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                radius="sm"
                endContent={
                  <Icon
                    icon="fluent:chevron-down-16-regular"
                    width="1.2em"
                    height="1.2em"
                  />
                }
                variant="flat"
              >
                {t("Sort by")}
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectionMode="single"
              selectedKeys={selectedKey}
              onSelectionChange={setSelectedKey}
            >
              <DropdownItem key="created_at" className="capitalize">
                {t("Creation Time")}
              </DropdownItem>
              <DropdownItem key="group_size" className="capitalize">
                {t("Group Size")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Create New Btn */}
          <Button
            radius="sm"
            color="success"
            variant="flat"
            size="md"
            onClick={() => {
              onOpen();
              resetPhonebookAccounts();
            }}
          >
            {t("Create New")}
          </Button>

          {/* Modal Content */}
          <Modal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setTotalMembers(0);
              setGroupFile(null);
            }}
            onOpenChange={onOpenChange}
            size="5xl"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Create New Group
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex gap-6 items-center">
                      {/* PFP */}

                      <AvatarIndex
                        value={avatarValue}
                        avatarType={avatarType}
                        shapTypeHandller={shapTypeHandller}
                        size={90}
                        radius={15}
                        border={true}
                        borderSize={3}
                        borderColor="#f0f0f0"
                      />
                      {/* Group Name  */}
                      <Input
                        isRequired
                        label="Group Name"
                        radius="sm"
                        size="sm"
                        className="w-2/5"
                        value={groupName}
                        onChange={(e) => {
                          setAvatarValue(e.target.value);
                          setGroupName(e.target.value);
                        }}
                      />
                    </div>

                    {/* Tabs with Upload & Contacts */}
                    <Tabs
                      variant="underlined"
                      color="success"
                      className="-ml-2"
                      onSelectionChange={(key) => {
                        onTabChanges(key);
                        setTotalMembers(0);
                      }}
                    >
                      <Tab key="upload" title="Upload">
                        <div className="flex flex-col gap-2 ">
                          {/* CSV Upload */}
                          <CsvUpload />
                          {/* Download sample file */}
                          <a
                            href="contact-import.csv"
                            download
                            className="flex mb-2 items-center gap-1 cursor-pointer hover:underline hover:text-success text-sm text-default-500"
                          >
                            {t("Download sample file")}

                            <Icon
                              icon="iconamoon:cloud-download-light"
                              width="1.3em"
                              height="1.3em"
                              className="hover:text-success"
                            />
                          </a>

                          {/* Checkbox */}
                          <Checkbox
                            onChange={(e) => {
                              setRemoveDuplicates(e.target.checked);
                            }}
                            defaultSelected={true}
                            size="sm"
                            color="success"
                          >
                            Remove duplicates
                          </Checkbox>
                        </div>
                      </Tab>
                      <Tab key="contacts" title="Contacts">
                        <ContactsTable renderInsideGroup={true} rows={5} />
                      </Tab>
                    </Tabs>
                  </ModalBody>
                  <ModalFooter className="flex flex-col">
                    {/* Total audience */}
                    <div className="text-sm text-default-600 flex flex-col gap-2">
                      <Divider />
                      <span className="flex items-center  text-xs gap-1">
                        <Icon
                          icon="fluent:people-48-filled"
                          width={"1.3em"}
                          className="text-success"
                        />
                        {`${
                          activeTab === "upload"
                            ? totalMembers
                            : selectedKeys.size
                        } selected members`}
                      </span>
                    </div>
                    {/* Btns */}
                    <div className="flex gap-2 self-end">
                      <Button
                        radius="sm"
                        variant="light"
                        color="danger"
                        onPress={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        radius="sm"
                        variant="flat"
                        color="success"
                        onClick={createGroupHandler}
                      >
                        Create
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}
