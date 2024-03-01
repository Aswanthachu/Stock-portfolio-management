import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { Collapse } from "react-collapse";

const FaqCard = ({ toggle, title, desc, open }) => {
  return (
    <div className="shadow-xl w-full md:w-[80%] lg:w-[50%]  rounded-xl bg-white">
      <div className="text-start flex justify-between px-10 py-5" onClick={toggle}>
        <p className="font-bold">{title}</p>
        <div className="mr-2">
          {open ? (
            <MinusIcon className="w-5 h-5" />
          ) : (
            <PlusIcon className="w-5 h-5" />
          )}
        </div>
      </div>
      <Collapse isOpened={open}>
        <div className="px-10 pb-5 text-sm font-semibold text-gray-500/95">
          {desc}
        </div>
      </Collapse>
    </div>
  );
};

export default FaqCard;