import { Drawer as Drwr, IconButton } from "@material-tailwind/react";
import { Button } from "../ui/button";
import { DatePicker, Editor, Select } from ".";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addNewNotification, editNotification } from "@/Redux/Actions/notification";

export default function Drawer({formData,setFormData,open, openDrawer,closeDrawer }) {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const togglePushButton = (e)=>{
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: prevState?.pushNotification? false : true ,
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      const t = toast.loading("Editing notification...");
      dispatch(editNotification({ ...formData, toastId: t }));
    } else {
      const t = toast.loading("Creating an new notification...");
      dispatch(addNewNotification({ ...formData, toastId: t }));
    }
    closeDrawer();
  };

  return (
    <>
      <Button
        className="bg-darkGreen hover:bg-darkGreen text-white hover:text-white"
        onClick={openDrawer}
      >
        Add New
      </Button>
      <Drwr
        open={open}
        onClose={closeDrawer}
        placement="right"
        overlay={false}
        size={450}
        className="z-50 overflow-y-auto pb-5 bg-lightGrey shadow-2xl"
      >
        <div className="mb-2 flex items-center justify-between p-4">
          <p className="text-xl font-semibold">Notification Editor</p>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <form className="flex flex-col gap-6 p-4" onSubmit={handleSubmit}>
          <div>
            <h1 className="font-semibold mb-2">Heading</h1>
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              name="heading"
              value={formData?.heading}
              onChange={handleChange}
            />
          </div>
          <Editor
            formData={formData}
            handleChange={handleChange}
            openDrawer={openDrawer}
          />
          <Select formData={formData} handleChange={handleChange} />
          {formData?.recipients?.toString() === "6" && (
            <div>
              <h1 className="font-semibold mb-2">User Email</h1>
              <Input
                type="email"
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                name="email"
                value={formData?.email}
                onChange={handleChange}
              />
            </div>
          )}
          <DatePicker formData={formData} handleChange={handleChange} />
          <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" class="sr-only peer"
      checked={formData?.pushNotification} onChange={togglePushButton} name="pushNotification"
       />
      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none    rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-darkGreen"></div>
      <span class="ms-3 text-sm font-semibold text-darkGreen"> Push Notifications</span>
    </label>

   {formData?.pushNotification && <div>
    <label className="block mb-2">
        Notification Title <span className="text-red-500 text-sm md:text-2xl font-bold">*</span>:
        <input
          type="text" name="pushTitle"
          className="w-full border border-gray-300 px-2 py-1 rounded focus-visible:ring-1 focus-visible:ring-offset-0"
          value={formData?.pushTitle} required
          onChange={handleChange}
        />
      </label>
      <label className="block mb-2">
        Notification Text <span className="text-red-500 text-sm md:text-2xl font-bold">*</span>:
        <textarea name="pushMessage"
          className="w-full border border-gray-300 p-2 rounded"
          value={formData?.pushMessage} required
          onChange={handleChange}
        />
      </label>
      <label className="block mb-2">
        Notification Link <span className="text-red-500 text-sm md:text-2xl font-bold">*</span>:
        <input
          type="text" name="pushLink"
          className="w-full border border-gray-300 p-2 rounded"
          value={formData?.pushLink}
          onChange={handleChange} required
        />
      </label>
    </div>}
          <Button
            type="submit"
            className="bg-darkGreen hover:bg-darkGreen text-white hover:text-white mt-5"
          >
            Create
          </Button>
        </form>
      </Drwr>
    </>
  );
}
