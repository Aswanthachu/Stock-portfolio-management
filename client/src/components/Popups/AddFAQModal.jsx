import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { addFaq } from "@/Redux/Actions/ticket";
const AddFAQModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    description: "",
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    dispatch(addFaq(formData));

    setIsOpen(false);
    setFormData({
      subject: "",
      category: "",
      description: "",
    });
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-30 w-full min-h-screen backdrop-blur-sm"
    >
      <div className="flex flex-col justify-center items-center shadow-2xl rounded-xl max-w-xs md:max-w-xl  lg:max-w-3xl mx-auto px-3 md:px-10 py-5 mt-28 ">
        <h5 className="text-darkGreen font-medium font-main text-xl md:text-2xl w-full text-start ">
          Add FAQ Ticket
        </h5>

        <form className="w-full mt-6 mb-2">
          <label
            for="category"
            className="block mb-0 text-lg md:text-2xl font-medium text-darkGreen"
          >
            Category
          </label>
          <select
            id="category"
            className=" w-full   text-darkGreen     block  p-3 text-lg md:text-2xl border-b-2 border-darkGreen"
            required
            onChange={onChange}
          >
            <option selected>Select Category</option>
            <option value="Financial">Financial</option>
            <option value="Technical">Technical</option>
          </select>
          <label
            for="subject"
            className="block mb-0 text-lg md:text-2xl font-medium text-darkGreen"
          >
            Subject
          </label>
          <input
            required
            type="text"
            name="subject"
            id="subject"
            placeholder="Enter the Subject"
            className=" w-full   text-darkGreen     block  p-3 text-lg md:text-2xl border-b-2 border-darkGreen"
            onChange={onChange}
          />
          <label
            for="description"
            className="block mb-0 text-lg md:text-2xl font-medium text-darkGreen"
          >
            Description
          </label>
          <textarea
            required
            name=""
            id="description"
            cols="30"
            rows="3"
            placeholder="Enter Description"
            className="border-b-2 border-darkGreen w-full placeholder:text-darkGreen mb-5 text-darkGreen "
            onChange={onChange}
          ></textarea>

          <Button
            type="submit"
            text="Add FAQ Ticket"
            className="bg-darkGreen text-white rounded-xl px-4 py-1"
            onClick={handleSubmit}
          />
          <Button
            text="Cancel"
            className="text-darkGreen  rounded-xl px-4 py-1 ml-3 font-semibold"
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </form>
      </div>
    </Dialog>
  );
};

export default AddFAQModal;
