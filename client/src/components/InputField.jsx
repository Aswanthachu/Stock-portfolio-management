import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../assets";

const Input = ({
  title,
  astrik,
  icon1,
  placeholder,
  type,
  name,
  onChange,
  value,
  disabled
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-1">
        <p className="text-sm md:text-lg font-semibold">{title}</p>
        {astrik && <span className="text-red-500 text-sm md:text-2xl font-bold">*</span>}
      </div>
      <div className="w-full bg-lightGrey p-3 flex gap-2 md:gap-3 rounded-md md:rounded-xl items-center">
        <span>{icon1}</span>
        <input
          placeholder={placeholder}  disabled={disabled}
          className="bg-lightGrey w-[80%] md:grow outline-none text-sm md:text-lg"
          type={type === "password" ? (open ? "text" : "password") : type}
          name={name}
          onChange={onChange}
          value={value}
        />
        {type === "password" && (
          <span onClick={() => setOpen(!open)}>
            {!open ? (
              <EyeIcon className="w-6 font-bold fill-[#b0b0b0]" />
            ) : (
              <EyeCloseIcon className="w-7" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
