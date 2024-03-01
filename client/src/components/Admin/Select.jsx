import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { selectRecipients } from "./NotificationTable";

const data = [
  { name: "All Users", value: 1 },
  { name: "Subscibed Users", value: 2 },
  { name: "Premium Users", value: 3 },
  { name: "Standard Users", value: 4 },
  { name: "Unsubscibed Users", value: 5 },
  { name: "Specific User", value: 6 },
  { name: "Sub Admins", value: 7 },
  { name: "All Users and Sub Admins", value: 8 },
];

export default function Select({ formData, handleChange }) {
  const handleSelect = (value) => {
    const e = {
      target: {
        name: "recipients",
        value,
      },
    };
    handleChange(e);
  };

  return (
    <div className="w-full">
      <Listbox value={formData?.recipients} onChange={(e) => handleSelect(e)}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left outline-1 border border-gray-200 sm:text-sm">
            <span className="block truncate">{selectRecipients(formData?.recipients)}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute my-2 max-h-44 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {data.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={item.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
