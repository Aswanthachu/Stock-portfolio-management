import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/components/Button";
import Papa from "papaparse";

import { useDispatch } from "react-redux";
import { addBulkStocks } from "@/Redux/Actions/admin";

const AddBulkStockModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const [file, setFile] = useState();
  const [csv, setCsv] = useState();

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  const handleInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileDelete = () => {
    setFile(null);
  };
  const handleCancel = () => {
    setFile(null);
    setIsOpen(false);
  };

  const handleFileUpload = async () => {
    const reader = new FileReader();
    reader.onload = () => {
      const results = Papa.parse(reader.result, { header: true }).data;
      setCsv(results);
    };
    reader.readAsText(file);
  };

  console.log(csv);

  useEffect(() => {
    if (csv) {
      dispatch(addBulkStocks({ csv }));
      setIsOpen(false);
    }
  }, [csv]);
  // send formData to server using axios or fetch
  

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-30 w-full h-full backdrop-blur-sm"
    >
      <Button
        icon={
          <svg
            width="29"
            height="24"
            viewBox="0 0 29 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M27 13.5C27.8284 13.5 28.5 12.8284 28.5 12C28.5 11.1716 27.8284 10.5 27 10.5V13.5ZM0.939341 10.9393C0.353554 11.5251 0.353554 12.4749 0.939341 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.939341 10.9393ZM27 10.5L2 10.5V13.5L27 13.5V10.5Z"
              fill="#0055A4"
            />
          </svg>
        }
        className="pt-5  ml-40 "
        onClick={() => handleCancel()}
      />
      <div className="flex flex-col justify-center items-center shadow-2xl rounded-xl p-8 mx-5 md:mx-36 lg:mx-[30%] my-12 md:ml-44 lg:my-20 ">
        {!file && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full mt-6 mb-2 flex flex-col justify-center items-center border-dashed border-2 my-10"
          >
            <svg
              className="my-10"
              width="150"
              height="150"
              viewBox="0 0 233 233"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="116.5" cy="116.5" r="116.5" fill="#0055A4" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M157.3 95.8714H157.816C161.872 95.8721 165.889 96.6731 169.635 98.2286C173.381 99.7841 176.784 102.063 179.648 104.936C185.44 110.742 188.693 118.608 188.693 126.809C188.693 135.01 185.44 142.876 179.648 148.682C176.784 151.554 173.381 153.834 169.635 155.389C165.889 156.945 161.872 157.746 157.816 157.746H137.243V147.434H157.816C163.126 147.196 168.141 144.92 171.815 141.078C175.489 137.236 177.539 132.125 177.539 126.809C177.539 121.493 175.489 116.382 171.815 112.54C168.141 108.698 163.126 106.421 157.816 106.184H148.39L147.122 97.3461C146.348 91.8091 143.788 86.6759 139.831 82.7263C135.874 78.7767 130.736 76.2265 125.198 75.463C119.656 74.706 114.019 75.788 109.151 78.5432C104.284 81.2983 100.454 85.5743 98.251 90.7152L94.8169 98.5733L86.4741 96.6242C84.5671 96.1512 82.6121 95.8986 80.6475 95.8714C73.8207 95.8714 67.2722 98.5836 62.4563 103.42C58.8672 107.029 56.4252 111.618 55.4371 116.611C54.4491 121.604 54.9592 126.778 56.9033 131.481C58.8474 136.185 62.1388 140.209 66.3635 143.048C70.5883 145.886 75.5579 147.412 80.6475 147.434H106.367V157.746H80.6475C75.5396 157.792 70.4806 156.749 65.8074 154.687C61.1343 152.624 56.9544 149.589 53.5463 145.784C48.3932 140.045 45.2127 132.808 44.4704 125.131C43.7281 117.454 45.4631 109.741 49.4213 103.121C52.0429 98.7355 55.5665 94.9569 59.7587 92.0359C63.9509 89.1149 68.716 87.1181 73.7382 86.1777C78.75 85.2496 83.9166 85.3836 88.8769 86.6005C92.0025 79.4438 97.3736 73.4995 104.178 69.6666C110.982 65.8338 118.849 64.3209 126.59 65.3567C134.333 66.4046 141.523 69.952 147.066 75.4598C152.61 80.9676 156.203 88.1346 157.3 95.8714ZM140.151 135.605L126.6 122.065V178.124H116.349V122.436L103.17 135.616L95.8791 128.315L118.01 106.184H125.311L147.442 128.315L140.151 135.605V135.605Z"
                fill="#F8F8F8"
              />
            </svg>

            <h5 className="font-main font-medium text-2xl text-darkGreen">
              Drop Your File Here
            </h5>
            <input
              hidden
              id="fileInput"
              ref={inputRef}
              type="file"
              onChange={handleInputChange}
            />
            <div>
              <Button
                text="Upload File"
                className="bg-darkGreen text-white px-8 py-2 rounded-lg my-5"
                onClick={() => {
                  inputRef.current.click();
                }}
              />

              <Button
                text="Cancel"
                className="text-darkGreen  rounded-xl px-4 py-1  font-semibold"
                onClick={() => {
                  handleCancel();
                }}
              />
            </div>
          </div>
        )}
        {file && (
          <div>
            <div className="file">
              <p>{file.name}</p>
              <Button
                text="Delete"
                onClick={() => handleFileDelete()}
                className="text-darkGreen font-medium px-6 py-1 border-2 border-darkGreen rounded-md"
              />
            </div>

            <Button
              text="Upload"
              onClick={handleFileUpload}
              className="bg-darkGreen px-6 py-1 text-white font-medium rounded-md"
            />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default AddBulkStockModal;
