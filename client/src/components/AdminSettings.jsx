import { useEffect, useRef, useState } from "react";

import {
  closeTicket,
  deleteTicket,
  reOpenTicket,
} from "../Redux/Actions/ticket";
import { useDispatch } from "react-redux";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-modern-modal";

const AdminSettings = ({ ticketId }) => {
  const dispatch = useDispatch();
  //   const useDetectOutsideClick = (el, initialState) => {
  //     const [isActive, setIsActive] = useState(initialState);

  //     useEffect(() => {
  //       const onClick = (e) => {
  //         // If the active element exists and is clicked outside of
  //         if (el.current !== null && !el.current.contains(e.target)) {
  //           setIsActive(!isActive);
  //         }
  //       };

  //       // If the item is active (ie open) then listen for clicks outside
  //       if (isActive) {
  //         window.addEventListener("click", onClick);
  //       }

  //       return () => {
  //         window.removeEventListener("click", onClick);
  //       };
  //     }, [isActive, el]);

  //     return [isActive, setIsActive];
  //   };

  const dropdownRef = useRef(null);
  //   const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const [isActive, setIsActive] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState();

  const onClick = () => setIsActive(!isActive);

  const handleTicketOption = async (type) => {
    setActionType(type);
    if (type === "reopen") {
      dispatch(reOpenTicket(ticketId));
    } else {
      setConfirmOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (actionType === "close") {
      dispatch(closeTicket(ticketId));
    } else {
      dispatch(deleteTicket(ticketId));
    }
    setConfirmOpen(false);
    setActionType();
  };

  const handleClose = async () => {
    setConfirmOpen(false);
    setActionType();
    return;
  };

  return (
    <>
      <div className="bg-inherit">
        <div className="relative flex justify-center items-center">
          <button
            onClick={onClick}
            className=" rounded-lg cursor-pointer flex justify-between items-center md:p-2 border-none align-top transition ease-in-out "
          >
            <img
              src='/assets/AdminTicketSettings.png'
              alt="User avatar"
              className="w-10 active:scale-110 hover:scale-110 rounded-full border "
            />
          </button>
          <nav
            //   ref={dropdownRef}
            className={`bg-transparent rounded-lg absolute -top-[120px] -right-0 transition ease-in-out duration-1000 ${
              isActive ? "opacity-1 visible" : "opacity-0 hidden"
            }`}
          >
            <ul className="space-y-3">
              <li
                className="rounded-4xl flex bg-white  items-center justify-between shadow-md shadow-gray-400  py-1 px-2 rounded-3xl min-w-[115px] hover:cursor-pointer hover:scale-105"
                onClick={() => handleTicketOption("reopen")}
              >
                <h1 className="font-main text-sm font-semibold">ReOpen</h1>
                <img src='/assets/InfoAdminSettings.png' alt="option" className="w-8" />
              </li>
              <li
                className="rounded-4xl flex bg-white items-center justify-between shadow-md shadow-gray-400  py-1 px-2 rounded-3xl min-w-[115px] hover:cursor-pointer hover:scale-105"
                onClick={() => handleTicketOption("close")}
              >
                <h1 className="font-main text-sm font-semibold">Close</h1>
                <img src='/assets/CloseAdminSettings.png' alt="option" className="w-8" />
              </li>
              {/*
              <li
                className="rounded-4xl flex  items-center justify-between shadow-md shadow-gray-400  py-1 px-2 rounded-3xl min-w-[115px] hover:cursor-pointer hover:scale-105"
                onClick={() => handleTicketOption("delete")}
              >
                <h1 className="font-main text-sm font-semibold">Delete</h1>
                <img src={DeleteAdminSettings} alt="option" className="w-8" />
              </li>
              */}
            </ul>
          </nav>
        </div>
      </div>
      <Modal
        isOpen={confirmOpen}
        onClose={handleClose}
        size="sm"
        className="font-main"
      >
        <ModalHeader>
          <h1>{`Confirm ${actionType === "delete" ? "Delete" : "Close"} `}</h1>
        </ModalHeader>
        <ModalBody className="flex justify-center overflow-y-auto max-h-[650px] ">
          <p>{`Are you sure to ${
            actionType === "delete" ? "Delete" : "Close"
          } Ticket ?`}</p>
        </ModalBody>
        <ModalFooter className="gap-5">
          <button className="border p-2 rounded-lg" onClick={handleClose}>
            Cancel
          </button>
          <button className="border p-2 rounded-lg" onClick={handleConfirm}>
            Confirm
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminSettings;
