import { menuItems } from "./MenuList";
import { menuItems2 } from "./SideBar";
import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { DropdownClose, DropdownOpen, LeftIcon, SettingIcon } from "@/assets";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Fragment, useEffect, useState } from "react";
import Bata from "../assets/images/Beta.png";
import { Drawer } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const SidebarMobile = ({
  userType,
  settingsOpen,
  setIsRateUsOpen,
  setConfirmationVisible,
  setSettingsOpen,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isBig, setIsBig] = useState(false);

  const closeDrawer = () => setOpen(false);

  const handleClick = (path) => {
    navigate(path);
    closeDrawer();
  };

  const handleLogout = () => {
    setConfirmationVisible(true);
    closeDrawer();
  };

  const handleFeedback = () => {
    setIsRateUsOpen(true);
    closeDrawer();
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsBig((prevSize) => !prevSize);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      className="mt-[60px]  fixed w-fit  flex md:hidden border-t"
      overlay={false}
    >
      <div className="bg-darkGreen w-fit min-w-[250px] flex  grow  flex-col justify-between pb-[60px]">
        <div className="flex flex-col">
          <>
            {menuItems.map((menu) => (
              <Fragment key={menu.id}>
                {menu.userTypes.includes(userType) && (
                  <Button
                    className={cn(
                      "rounded-none  text-base font-bold tracking-wide py-6 px-8 flex justify-start gap-5",
                      location.pathname === menu.path
                        ? "bg-white text-darkGreen bg-opacity-80 hover:bg-white hover:text-darkGreen hover:bg-opacity-80"
                        : "bg-darkGreen hover:bg-white  hover:bg-opacity-20",
                        menu.beta && "relative"
                    )}
                    onClick={() => handleClick(menu.path)}
                  >
                    <span>{menu.icon}</span>
                    <span>{menu.text}</span>
                    <img
                        src={Bata}
                        className={cn(
                          menu.beta ? "block" : "hidden",
                          "w-8 absolute right-0 top-0"
                        )}
                        alt="beta"
                      />
                  </Button>
                )}
              </Fragment>
            ))}
          </>
        </div>

        <div className="w-full">
          <Button
            className="w-full bg-inherit rounded-none text-white hover:bg-inherit hover:text-white text-base tracking-wide font-bold py-6 px-8 flex justify-start items-center gap-5"
            onClick={() => setSettingsOpen((prevState) => !prevState)}
          >
            <SettingIcon className="w-6 h-6 fill-white " />
            <span>Settings</span>
            {!settingsOpen ? (
              <span>
                <DropdownOpen className="w-4 h-2 " />
              </span>
            ) : (
              <span>
                <DropdownClose className="w-4 h-2" />
              </span>
            )}
          </Button>
          {settingsOpen && (
            <Fragment>
              {menuItems2.map((menu) => (
                <Button
                  key={menu.id}
                  className={cn(
                    "w-full  rounded-none  text-base font-bold tracking-wide py-6 px-8 flex justify-start gap-5",
                    location.pathname === menu.path
                      ? "bg-white text-darkGreen bg-opacity-80 hover:bg-white hover:text-darkGreen hover:bg-opacity-80"
                      : "bg-darkGreen hover:bg-white  hover:bg-opacity-20"
                  )}
                  onClick={
                    menu.text === "Feedback"
                      ? () => handleFeedback()
                      : () => handleClick(menu.path)
                  }
                >
                  <span>{menu.icon}</span>
                  <span>{menu.text}</span>
                </Button>
              ))}
            </Fragment>
          )}
          <Button
            className="w-full bg-inherit rounded-none text-white hover:bg-inherit hover:bg-red-100 hover:text-red-400 hover:bg-opacity-20  text-lg tracking-wide font-bold py-6 px-8 flex justify-start items-center gap-5"
            onClick={() => handleLogout()}
          >
            <LeftIcon className="w-7 h-7 " />
            <span>Logout</span>
          </Button>
        </div>
      </div>
      <span
        className={cn(
          "absolute top-12  text-gray-700 p-3 bg-gray-300 rounded-r-xl hover:cursor-pointer",
          open ? "-right-12" : "-right-[96px]"
        )}
        onClick={() => setOpen((prevState) => !prevState)}
      >
        {open ? (
          <ArrowLeftIcon
            className={cn(
              isBig ? "animate-scale-big" : "animate-scale-small",
              "w-6 h-6 text-gray-700"
            )}
          />
        ) : (
          <Bars3Icon
            className={cn(
              isBig ? "animate-scale-big" : "animate-scale-small",
              "w-6 h-6 text-gray-700"
            )}
          />
        )}
      </span>
    </Drawer>
  );
};

export default SidebarMobile;
