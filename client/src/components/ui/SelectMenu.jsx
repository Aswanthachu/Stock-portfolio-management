import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon , ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function SelectMenu({
  Label,
  items,
  name,
  setdata,
  selectedvalue,
  nolabel,
  astrik,
}) {
  const [selected, setSelected] = useState();

  // useEffect(()=>{
  //   setdata(selected.value)
  // },[setSelected,selected])

  function handleSelect(value) {
    setSelected(value);
    setdata(value.value);
  }

  return (
      <Listbox
        value={selected}
        name={name}
        onChange={handleSelect}
        
      >
        {({ open }) => (
          <>
            {!nolabel && (
              <Listbox.Label className=" mt-2 font-main   block text-base font-medium  text-gray-900 ">
                {Label} {astrik && <span className="text-red-500">*</span>}
              </Listbox.Label>
            )}
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full  cursor-default rounded-md bg-gray-200 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-darkGreen sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <span className="ml-3 block truncate font-main font-normal ">
                    {selected
                      ? selected.label
                      : selectedvalue
                      ? selectedvalue
                      : "Select an option"}
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                 {open?<ChevronUpIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />:<ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />} 
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {items?.map((item, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-darkGreen text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {item.label}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
  );
}