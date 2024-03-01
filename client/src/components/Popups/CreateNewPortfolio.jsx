import React, { useState } from "react";
import Button from "../Button";
import { GetSubscribe, SelectMenu } from "..";
import { addNewPortfolio } from "@/Redux/Actions/portfolio";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreationLoading from "./CreationLoading";

const CreateNewPortfolio = ({ isOpen, setIsOpen, loading }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const closeModal = () => {
    setIsOpen(false);
  };
  const investmentPlanOptions = [
    { value: "sip", label: "SIP Investment" },
    { value: "lumpsum", label: "lumpsum Investment" },
  ];
  const frequencyOptions = [{ value: "monthly", label: "Monthly" }];
  const [investmentPlan, setInvestmentPlan] = useState();
  const [frequency, setFrequency] = useState();
  const [investmentDetails, setInvestmentDetails] = useState({
    installment: "",
    portfolioname: "",
  });
  const [error, setError] = useState("");
  const { installment, portfolioname } = investmentDetails;

  const { status } = JSON.parse(localStorage.getItem("status"))
    ? JSON.parse(localStorage.getItem("status"))
    : "";
  const handleSubmit = (e) => {
    e.preventDefault();

    if (installment && portfolioname && investmentPlan) {
      const formData = {
        ...investmentDetails,
        investmentPlan,
        frequency,
      };

      dispatch(addNewPortfolio({ formData, setIsOpen }));
      if (location.pathname === "/dashboard") {
        localStorage.setItem("firstportfolio", JSON.stringify(true));
        navigate("/portfolio");
      }
    }
  };
  const handleChange = (e) => {
    if (e.target.name === "installment") {
      if (e.target.value <= 4000000 && investmentPlan === "lumpsum") {
        setInvestmentDetails((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      } else if (e.target.value <= 100000 && investmentPlan === "sip") {
        setInvestmentDetails((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      } else {
        setError(
          `Sorry, Currently we don't support ${
            investmentPlan === "sip" ? "Installment" : "Intial Investment"
          } above  ${investmentPlan === "sip" ? "1 Lakh" : "40 Lakh"}.`
        );

        return;
      }
    } else {
      setInvestmentDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const portfolios = useSelector((state) => state.portfolio?.portfolios);

  return (
    <>
      {isOpen && (
        <>
          {status === "active" ? (
            <>
              {!loading ? (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg   mx-4">
                    <div className="justify-end hidden md:flex">
                      <Button
                        className="text-gray-600 hover:text-gray-800 text-sm"
                        onClick={closeModal}
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        }
                      />
                    </div>
                    <div className="md:-mt-3  lg:max-w-3xl ">
                      <div className="flex flex-col-reverse md:flex-row ">
                        <div className="md:w-1/2">
                          <div className=" w-full flex flex-col items-center">
                            <h1 className="text-teal-800 text-lg md:text-2xl font-semibold text-center  ">
                              Create your new portfolio.
                            </h1>

                            <p className="text-gray-700 text-sm font-light">
                              <span className="text-red-500 p-3 text-justify">
                                *
                              </span>
                              is mandatory{" "}
                            </p>
                            <div className="flex justify-center mt-2 mx-3">
                              <form
                                onSubmit={handleSubmit}
                                className=" flex  flex-col"
                              >
                                <SelectMenu
                                  Label="Your Invesment Plan"
                                  items={investmentPlanOptions}
                                  setdata={setInvestmentPlan}
                                  astrik
                                />
                                <label
                                  className=" mt-2   block text-base font-medium  text-gray-900"
                                  htmlFor=""
                                >
                                  {investmentPlan === "sip"
                                    ? "Installment"
                                    : "Intial Investment"}{" "}
                                  <span className="text-red-500 p-1 text-justify">
                                    *
                                  </span>
                                </label>
                                <input
                                  maxLength={7}
                                  required
                                  placeholder="0"
                                  value={installment}
                                  type="number"
                                  name="installment"
                                  className="focus:text-indigo-600 bg-gray-200 flex items-center pr-4 border w-full rounded-md shadow-sm mt-2 pl-5 font-medium h-8"
                                  onChange={(e) => handleChange(e)}
                                />
                                {error && (
                                  <p className="text-red-600 text-xs mt-2">
                                    {error}
                                  </p>
                                )}

                                {investmentPlan === "sip" && (
                                  <div>
                                    <SelectMenu
                                      Label="Frequency"
                                      items={frequencyOptions}
                                      setdata={setFrequency}
                                    />
                                  </div>
                                )}
                                <label
                                  className=" mt-2 font-main  block text-base font-medium  text-gray-900"
                                  htmlFor=""
                                >
                                  Your Portfolio Name{" "}
                                  <span className="text-red-500 p-1 text-justify">
                                    *
                                  </span>
                                </label>
                                <input
                                  placeholder="type here.."
                                  value={portfolioname}
                                  name="portfolioname"
                                  className="focus:text-indigo-600 bg-gray-200  flex items-center pr-4 border w-full rounded-md shadow-sm mt-2 pl-5 font-medium h-8"
                                  onChange={(e) => handleChange(e)}
                                />
                                <div className=" pt-1 md:pt-2 lg:pt-3">
                                  <p className="text-xs md:text-sm text-slate-600 bg-yellow-100 p-3 w-full">
                                    <span className="text-slate-600 font-bold">
                                      Professional Tip :
                                    </span>{" "}
                                    To get the most out of your portfolio,
                                    <br className="hidden " /> create it on the
                                    same day that you buy stocks.
                                  </p>
                                </div>
                                <div className="flex justify-center gap-3  items-center">
                                  <button
                                    onClick={closeModal}
                                    className="px-2 h-fit mb-3 font-medium hover:text-red-600 hover:border-red-600  font-main text-black  border-black border justify-center mt-6 items-center text-center rounded-lg cursor-pointer w-fit"
                                  >
                                    Cancel
                                  </button>

                                  <div
                                    className={`flex flex-col items-center ${
                                      status === "active" &&
                                      portfolios?.length > 1 &&
                                      "group"
                                    } relative`}
                                  >
                                    <button
                                      type="submit"
                                      disabled={
                                        portfolios?.length > 1 ? true : false
                                      }
                                      className={`${
                                        portfolios?.length > 1
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      } px-2 py-1 mb-3 bg-darkGreen font-main text-white justify-center mt-6 items-center text-center rounded-lg cursor-pointer w-fit`}
                                    >
                                      Generate Portfolio
                                    </button>
                                    <div
                                      className={`absolute bottom-12 right-0 px-5 py-5 bg-slate-700 text-white w-[350px] max-w-lg
                                     z-50 hidden group-hover:block text-sm  rounded-md  mt-2 ml-2`}
                                    >
                                      Currently portfolio creation is limited to
                                      two.Please delete existing one to create
                                      new one.
                                      <span
                                        onClick={() => navigate("/tickets")}
                                        className="underline hover:cursor-pointer  text-green-400"
                                      >
                                        {" "}
                                        if you have any requirement kindly rise
                                        ticket.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex md:w-1/2  items-center">
                          <img
                            src="/assets/createPortfolio.svg"
                            alt="Create New Portfolio"
                            className=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    icon={
                      <svg
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
                      </svg>
                    }
                    className="text-gray-600 rounded-full bg-white hover:bg-red-100 p-4 hover:text-gray-800 text-sm absolute bottom-10 left-1/2 transform -translate-x-1/2 translate-y-1/2 m-4 md:hidden"
                    onClick={closeModal}
                  />
                </div>
              ) : (
                <CreationLoading />
              )}
            </>
          ) : (
            <GetSubscribe status={status} setIsOpen={setIsOpen} />
          )}
        </>
      )}
    </>
  );
};

export default CreateNewPortfolio;
