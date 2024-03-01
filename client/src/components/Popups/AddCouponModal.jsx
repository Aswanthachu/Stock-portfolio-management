import React, { useState, useRef } from 'react'
import { Dialog } from "@headlessui/react";
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { createCoupon } from '@/Redux/Actions/admin';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SelectMenu } from '@/components';
const AddCouponModal = ({ isOpen, setIsOpen }) => {
  const couponTypeOptions = [
    { value: "Percentage", label: "Percentage" },
    { value: "Rupees", label: "Rupees" },
  ];
  const dispatch = useDispatch()
  const formSubmit = useRef(null)
  const [error, setError] = useState(false);

  const [formData, setFormData] = useState({
    couponCode: '',
    couponType: '',
    couponValue: '',
    validTill: '',
    maxUsage: '',
    couponDescription: '',
    isSingleUse: false,
    couponStatus: 'active'

  });
  const handleClick = () => {
    if (formData.couponCode === "" ) {
      setError("Coupon Code is required")
    } else if (formData.couponType === "") { setError("Coupon Type is required") } else if (formData.couponValue === "") { setError("Coupon Value is Required") } else if (formData.validTill === "") { setError("Validity is Required") } else if (formData.couponDescription === "") {
      setError("coupon Description is required")
    } else {
      formSubmit.current.click()
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(createCoupon(formData))
    setIsOpen(false)
    setFormData({
      couponCode: '',
      couponType: '',
      couponValue: '',
      validTill: '',
      maxUsage: '',
      couponDescription: '',
      isSingleUse: false,
      couponStatus: 'active'

    })
  }

  const handleCouponChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.toUpperCase()
    })
  }
  const setCouponType = (data) => {
    setFormData({
      ...formData,
      couponType: data
    })
  }
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-30 w-full h-full backdrop-blur-sm"
    >
      <div className="flex flex-col bg-white max-h-[500px] overflow-y-auto custom-scrollbar2  justify-center items-center shadow-2xl rounded-xl p-8 mx-5 md:mx-36 lg:mx-96 my-32 md:ml-44 lg:my-10 ">
        <h5 className="text-darkGreen  font-medium font-main text-xl md:text-2xl w-full text-start ">
          Add Coupon
        </h5>

        <form onSubmit={handleSubmit} className="w-full mt-4 mb-2">
          <div className='flex items-center'>
            <label className="block mb-0 text-lg md:text-xl font-medium text-darkGreen w-60" >
              Coupon Code :
            </label>
            <input
              className="focus:text-black  flex items-center pr-4 border  rounded-md shadow-sm mt-2 pl-5 font-medium h-10"
              name="couponCode"
              id="couponCode"
              placeholder="Enter Coupon Code"
              value={formData.couponCode}
              onChange={handleCouponChange}
            />
          </div>
          <div className='flex items-center'>
            <label className="block mb-0 text-lg md:text-xl font-medium text-darkGreen w-60">couponType :</label>
            <SelectMenu
              Label="couponType :"
              items={couponTypeOptions}
              setdata={setCouponType}
              nolabel
            />
          </div>
          <div className='flex items-center'>
            <label

              className="block mb-0 text-lg md:text-xl font-medium text-darkGreen w-60"
            >
              Coupon Value ({formData.couponType}) :
            </label>
            <input
              className="focus:text-black  flex items-center pr-4 border  rounded-md shadow-sm mt-2 pl-5 font-medium h-10"
              type="number"
              name="couponValue"
              id="couponValue"
              placeholder="Enter Coupon Value"
              value={formData.couponValue}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center'>
            <label
              className="block mb-0 text-lg md:text-xl font-medium text-darkGreen w-96"
            >
              Coupon Valididity :
            </label>

            <DatePicker
              selected={formData.validTill}
              onChange={(selectedDate) => {
                setFormData({
                  ...formData,
                  validTill: selectedDate
                });
              }}
              className="focus:text-black  flex items-center pr-4 border w-[80%] rounded-md shadow-sm mt-2 pl-5 font-medium h-10"
              dateFormat="dd-MM-yyyy"
              placeholderText="Select a date"
              minDate={new Date()}
              name="validTill"
              id="validTill"

            />
         
          </div>
          <div className='flex items-center'>
            <label
              className="block mb-0 text-lg md:text-xl font-medium text-darkGreen w-60"
            >
              Coupon Max-Usage :
            </label>
            <input
              className="focus:text-black  flex items-center pr-4 border  rounded-md shadow-sm mt-2 pl-5 font-medium h-10"
              type="number"
              name="maxUsage"
              id="maxUsage"
              placeholder="Enter maxUsage"
              value={formData.maxUsage}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center'>
            <label
              className="block mb-0 text-lg md:text-xl font-medium text-darkGreen w-60"
            >
              Single use per user :
            </label>
            <input
              className="focus:text-black  flex items-center pr-4 border  rounded-md shadow-sm mt-2 pl-5 font-medium h-10"

              type="checkbox"
              name="isSingleUse"
              id="isSingleUse"

              value={formData.isSingleUse}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  isSingleUse: event.target.checked,
                })
              }
            />
          </div>
          <div className='flex items-center'>
            <label
              className="block mb-0 text-lg md:text-xl font-medium text-darkGreen w-60"
            >
              Coupon Description :
            </label>
            <textarea className="focus:text-black  flex items-center pr-4 border  rounded-md shadow-sm mt-2 pl-5 font-medium h-10"
              rows={3}
              cols={20}
              name="couponDescription"
              id="couponDescription"
              placeholder="Enter Description"
              value={formData.couponDescription}
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="text-red-600 font-medium mb-4 mt-2 w-full text-center">
              {error}</div>)}
          <input hidden type="submit" ref={formSubmit} value="submit" />
          <Button onClick={handleClick}
            text="Add Coupon"
            className="bg-darkGreen text-white rounded-xl px-4 py-1"

          />
          <Button
            text="Cancel"
            className="text-darkGreen  rounded-xl px-4 py-1 ml-3 font-semibold"
            onClick={() => {
              setIsOpen(false);
            }}
          />

        </form>
      </div>
    </Dialog>
  )
}

export default AddCouponModal