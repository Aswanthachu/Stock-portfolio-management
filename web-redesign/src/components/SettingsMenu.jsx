import { SettingIcon } from "@/assets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { menuItems2 } from "./SideBar";
import { useLocation, useNavigate } from "react-router-dom";

const SettingsMenu = ({ setIsRateUsOpen }) => {
  const navigate=useNavigate();
  const location = useLocation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SettingIcon className="w-6 h-6 fill-white " />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -top-44 -left-3 w-[250px]">
        {menuItems2.map((menu) => (
          <DropdownMenuItem
            className={cn(
              "w-full  rounded-none  text-base font-bold tracking-wide py-2 px-8 flex justify-start gap-5",
              location.pathname === menu.path
                ? "bg-white text-darkGreen bg-opacity-80 hover:bg-white hover:text-darkGreen hover:bg-opacity-80"
                : "text-darkGreen  hover:bg-opacity-20"
            )}
            onClick={
              menu.text === "Feedback"
                ? () => setIsRateUsOpen(true)
                : () => navigate(menu.path)
            }
          >
            <span>{menu.icon}</span>
            <span>{menu.text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
