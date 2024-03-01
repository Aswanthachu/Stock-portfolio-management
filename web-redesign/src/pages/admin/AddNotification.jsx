import { getAllNotificationQuery } from "@/Redux/hooks/notification";
import { Drawer, NotificationTable } from "@/components/Admin";
import { useEffect, useState } from "react";

const AddNotification = () => {
  const [open, setOpen] = useState(false);
  const [notificationWantToEdit, setNotificationWantToEdit] = useState();

  const intialState = {
    heading: "",
    message: "",
    recipients: 0,
    email: "",
    date: null,
    pushNotification:false,
    pushTitle:'',
    pushMessage:'',
    pushLink:''
  };
  const [formData, setFormData] = useState(intialState);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => {
    setOpen(false);
    setFormData(intialState);
    setNotificationWantToEdit(intialState);
  };

  useEffect(() => {
    setFormData(notificationWantToEdit);
  }, [notificationWantToEdit]);

  const { data, isError, isLoading } = getAllNotificationQuery();

  return (
    <main className="w-full p-5 md:p-10 lg:px-16 lg:py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <Drawer                                                                                             
          openDrawer={openDrawer}
          closeDrawer={closeDrawer}
          open={open}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      <NotificationTable
        data={data?.notifications}
        openDrawer={openDrawer}
        setNotificationWantToEdit={setNotificationWantToEdit}
      />
    </main>
  );
};

export default AddNotification;
