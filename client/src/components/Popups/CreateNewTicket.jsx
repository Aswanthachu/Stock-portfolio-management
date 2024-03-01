import React, { useState } from 'react'
import Button from '../Button'
import SelectMenu from "../ui/SelectMenu";
import { useDispatch } from 'react-redux';
import { useToast } from '../ToastContext/ToastContext';
import { addNewTicket } from '@/Redux/Actions/ticket';
const CreateNewTicket = ({ isOpen, setIsOpen }) => {
  const {showToast} = useToast()
  const closeModal = () => {
    setIsOpen(false);
  };

  const dispatch = useDispatch();

  const categoryOptions = [
    { value: "Financial", label: "Financial" },
    { value: "Technical", label: "Technical" },
  ];

  const [image, setImage] = useState();
  const [pdf, setPdf] = useState();
  const [filename, setFilename] = useState("");

  const Data = JSON.parse(localStorage.getItem("status")) ? JSON.parse(localStorage.getItem("status")) : "" ;

  const [form, setForm] = useState({
    subject: "",
    category: "",
    description: "",
    user: "",
    cloudResData: "",
    file: "",
    date: new Date().toDateString().slice(4),
    status: true,
    paymentStatus: Data.status === "active" ? true : false,
  });

  const onChange = (e) => {
    if (e.target.name === "subject" && e.target.value.length <= 30) {
      setForm((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    } else if (e.target.name === "subject" && e.target.value.length > 30) {
      //   toast.error(
      //     "Please provide Subject as much as you can make brief , 30 charecters are recommented,More than that are trimmed.",
      //     { duration: 5000 }
      //   );
      return;
    } else {
      setForm((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const setCategory = (data) => {
    setForm((prevState) => ({
      ...prevState,
      category: data,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.subject || !form.category || !form.description) {
      //   toast.error("Please fill out all required fields..");
    } else {
      if (pdf) {
        try {
          //   const t = toast.loading("Please wait,creating your new ticket..");
          fetch("https://api.cloudinary.com/v1_1/aswanth/image/upload", {
            method: "POST",
            body: pdf,
          })
            .then((response) => response.json())
            .then((data) => {
              setForm((prevState) => ({
                ...prevState,
                cloudResData: data.secure_url,
              }));
            });

          dispatch(
            addNewTicket({
              form,
              showToast
            })
          );
          setIsOpen(false);
          setPdf();
          setFilename("");
          setForm({
            subject: "",
            category: "",
            description: "",
            user: "",
            cloudResData: "",
            file: "",
            date: new Date().toDateString().slice(4),
            status: true,
          });

        } catch (error) {
          console.error("Error uploading PDF:", error);
        }
      } else if (image) {
        setForm((prevState) => ({
          ...prevState,
          file: image,
        }));
        if (form.file) {
          const t = toast.loading("Please wait,creating your new ticket..");
          dispatch(addNewTicket({ form, showToast }));
          setIsOpen(false);
          setImage();
          setFilename("");
          setForm({
            subject: "",
            category: "",
            description: "",
            user: "",
            cloudResData: "",
            file: "",
            date: new Date().toDateString().slice(4),
            status: true,
          });
        }
      } else {
        dispatch(addNewTicket({ form, showToast}));
        setIsOpen(false);
      }
      // setTokenData((tokenData) => [data, ...tokenData]);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    setFilename(file.name);

    if (file.name.includes(".pdf")) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

      setPdf(formData);
    } else {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event.target.result;
        setImage(fileContent);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg   mx-4">
            <div className='justify-end hidden md:flex'>
              <Button className="text-gray-600 hover:text-gray-800 text-sm z-50"
                onClick={closeModal} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>} />
            </div>
            <div className='md:-mt-3  lg:max-w-3xl '>

              <div className='flex flex-col-reverse md:flex-row '>
                <div className="md:w-1/2">
                    <div className="flex items-center w-full mr-auto mt-2 md:mt-0 ">
                      <h5 className="text-darkGreen font-medium font-main text-xl md:text-2xl w-full text-center ">
                        Create a new Ticket
                      </h5>
                      <div className=" relative flex flex-col items-center group ">
                        <div
                          className={`absolute left-11 -top-2 px-2 py-1 bg-slate-800 text-slate-200 z-50 hidden group-hover:block rounded-md text-xs mt-2 ml-2 ${form.paymentStatus ? "w-[110px]" : "w-[160px]"
                            }`}
                        >
                        
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full mt-3 md:mt-6 mb-2 px-3">
                      <SelectMenu
                        Label="Category"
                        items={categoryOptions}
                        setdata={setCategory}
                        astrik
                      />
                      <div>
                        <label
                          className=" mt-2 font-main  block text-base font-medium leading-6 text-gray-900"
                          htmlFor=""
                        >
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="subject"
                          id="subject"
                          className=" flex items-center pr-4 border bg-gray-200 w-full rounded-md shadow-sm mt-2 pl-5  h-8 font-main"
                          onChange={onChange}
                        />
                      </div>
                      <div className="mb-6">
                        <label
                          className=" mt-2 font-main  block text-base font-medium leading-6 text-gray-900"
                          htmlFor=""
                        >
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          cols="30"
                          rows="3"
                          type="text"
                          name="description"
                          id="description"
                          className="  flex items-center bg-gray-200 md:row-span-4  border w-full rounded-md shadow-sm mt-2 px-2 py-1 text-sm font-medium font-main resize-none"
                          onChange={onChange}
                        />
                        
                      </div>

                      <div className="w-full  flex flex-row justify-evenly md:items-end">
                        <div className="">
                          <h1 className="font-semibold text-black/80">Attachments</h1>
                          <div className="px-2 py-1 md:px-4 md:py-2 border border-gray-400 border-dashed rounded-lg flex items-center justify-center gap-1 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20" fill="none">
                              <path d="M5 20C3.67392 20 2.40215 19.5408 1.46447 18.7233C0.526784 17.9058 0 16.7971 0 15.641V8.97436C0 8.22631 0.34086 7.5089 0.947596 6.97996C1.55433 6.45101 2.37724 6.15385 3.23529 6.15385C4.09335 6.15385 4.91626 6.45101 5.52299 6.97996C6.12973 7.5089 6.47059 8.22631 6.47059 8.97436V14.2459C6.47059 14.7332 6.07555 15.1282 5.58824 15.1282C5.10093 15.1282 4.70588 14.7332 4.70588 14.2459V8.97436C4.70588 8.63434 4.55095 8.30824 4.27516 8.06781C3.99937 7.82738 3.62532 7.69231 3.23529 7.69231C2.84527 7.69231 2.47122 7.82738 2.19543 8.06781C1.91964 8.30824 1.76471 8.63434 1.76471 8.97436V15.641C1.76471 16.3891 2.10557 17.1065 2.7123 17.6354C3.31904 18.1644 4.14195 18.4615 5 18.4615C5.85805 18.4615 6.68096 18.1644 7.2877 17.6354C7.89443 17.1065 8.23529 16.3891 8.23529 15.641V3.84615C8.23529 3.23412 7.95641 2.64715 7.45999 2.21437C6.96357 1.78159 6.29028 1.53846 5.58824 1.53846C4.88619 1.53846 4.2129 1.78159 3.71648 2.21437C3.22006 2.64715 2.94118 3.23412 2.94118 3.84615V3.98944C2.94118 4.47675 2.54613 4.8718 2.05882 4.8718C1.57151 4.8718 1.17647 4.47675 1.17647 3.98944V3.84615C1.17647 2.82609 1.64128 1.84781 2.46865 1.12651C3.29601 0.405219 4.41816 0 5.58824 0C6.75831 0 7.88046 0.405219 8.70782 1.12651C9.53519 1.84781 10 2.82609 10 3.84615V15.641C10 16.2135 9.87067 16.7803 9.6194 17.3091C9.36812 17.838 8.99983 18.3185 8.53553 18.7233C8.07124 19.1281 7.52005 19.4491 6.91342 19.6682C6.30679 19.8873 5.65661 20 5 20Z" fill="black" />
                            </svg>
                            <p className="text-gray-600/60 text-sm">Browse files</p>
                            <input
                              accept="image/*,application/pdf"
                              type="file"
                              onChange={handleFileSelect}
                              className="z-20  file:border-0 file:hover:cursor-pointer absolute w-full h-full opacity-0 hover:cursor-pointer"
                            />
                          </div>
                          <p className="text-xs text-gray-500/95">{filename}</p>
                        </div>
                        <Button
                          text="Create"
                          className="bg-darkGreen text-white rounded-lg px-2 py-1 md:px-6 md:py-2  flex md:w-fit mt-5"
                          onClick={handleSubmit}
                        />

                      </div>
                    </form>

                </div>
                <div className="hidden md:flex md:w-1/2  items-center">
                  <img src="/assets/raiseaticket.svg" alt="Raise a ticket" className="" />

                </div>
              </div>

            </div>


          </div>
          <Button icon={<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>} className="text-gray-600 rounded-full bg-white hover:bg-red-100 p-4 hover:text-gray-800 text-sm absolute bottom-16 left-1/2 transform -translate-x-1/2 translate-y-1/2 m-4 md:hidden"
            onClick={closeModal} />
        </div>
      )}


    </>)
}

export default CreateNewTicket