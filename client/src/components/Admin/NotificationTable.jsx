import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { DeleteAlert } from "..";
import toast from "react-hot-toast";
import { convert } from "html-to-text";
import { deleteNotification } from "@/Redux/Actions/notification";

export const selectRecipients = (value) => {
  if (value === 1) return "All Users";
  else if (value === 2) return "Subscibed Users";
  else if (value === 3) return "Premium Users";
  else if (value === 4) return "Standard Users";
  else if (value === 5) return "Unsubscibed Users";
  else if (value === 6) return "Specific User";
  else if (value === 7) return "Sub Admins";
  else if (value === 8) return "All Users and Sub Admins";
  else return "Select Recipients"
};

export default function NotificationTable({
  data,
  openDrawer,
  setNotificationWantToEdit,
}) {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    const t = toast.loading("deleting notification.");
    dispatch(deleteNotification({ id, t }));
  };

  const handleEdit = (obj) => {
    setNotificationWantToEdit(obj);
    openDrawer();
  };

  return (
    <Table className="my-10 ">
      <TableCaption>A list of your all notifications.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">No.</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Recipients</TableHead>
          <TableHead>Heading</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data?.map((notification, index) => (
            <TableRow key={notification?._id}>
              <TableCell className="font-medium ">{index + 1}</TableCell>
              <TableCell>Delivered</TableCell>
              <TableCell>
                {selectRecipients(notification?.recipients)}
              </TableCell>
              <TableCell className="max-w-[300px] min-w-[250px]">
                {notification?.heading}
              </TableCell>
              <TableCell className="max-w-[300px] min-w-[250px]">
                {convert(notification?.message)}
              </TableCell>
              <TableCell>
                {format(new Date(notification?.date), "PPP")}
              </TableCell>
              <TableCell className="flex gap-2 justify-center items-center">
                <DeleteAlert
                  btnClsName="bg-inherit hover:bg-inherit text-orange-500 hover:text-orange-500 p-1"
                  handleDelete={() => handleDelete(notification?._id)}
                  heading={<TrashIcon className="w-5" />}
                  message="This action cannot be undone. This will permanently delete notification."
                />
                <Button
                  className="bg-inherit hover:bg-inherit text-gray-600/80 hover:text-gray-600/80 p-1"
                  onClick={() => handleEdit(notification)}
                >
                  <PencilSquareIcon className="w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
