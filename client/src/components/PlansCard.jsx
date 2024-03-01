import React from 'react'
import Button from './Button'
const PlansCard = ({
    title,
    platformFees,
    monthlyFee ,
    features,
    buttonText,
    icon,
    disabledFeatures,
    basic,
    standard,
  }) => {
    let plan;
  if (basic) {
    plan = "basic";
  } else if (standard) {
    plan = "standard";
  } else {
    plan = "premium";
  } 
  return (
    <div>
      <div className="opacity-100 transform-none ">
        <article
          radius="sm"
          className="flex flex-col  lg:w-11/12 w-4/5 mx-auto shadow-xl bg-white p-6 rounded-lg"
        >
          <div className="lg:w-full  flex-auto  rounded-lg">
            <div className="p-4 -m-6 border-b">
              <div className="bg-[#ddf7ef] w-8 h-8 rounded-full flex  items-center justify-center">
                <span className="flex-initial"> {icon}</span>
                {/* <span className="flex ml-20 flex-end">Limited Period</span> */}
              </div>
              <h3 className="break-words text-xl font-bold font-gilroy lg:text-2xl mt-4">
                {title}
              </h3>
              <p className="font-normal break-words text-sm lg:text-base">
                Platform fees
              </p>
              <div className="flex items-baseline gap-1 mt-4">
                <h3 className="font-extrabold break-words text-3xl ">
                  {platformFees}
                </h3>
                <p className="font-normal break-words text-sm lg:text-base">
                  {basic ? "/Month" : standard ? "/3 Month" : "/Year"}
                </p>
              </div>
              <p className="font-normal font-gilroy break-words text-xs lg:text-sm">
                {monthlyFee}
              </p>
            
              <div className="mt-3 lg:mt-5">
               
              { ! basic &&   <Button  state={plan}  link={'/checkout'}
                    text={buttonText} 
                    className={`btn w-full flex justify-center bg-darkGreen text-white font-semibold rounded-lg py-2 `}
                  />}
              </div>
            </div>
            <ul className="space-y-2 mt-8">
              {disabledFeatures?.map((disableFeature, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <svg
                    className="-mt-1"
                    fill="#fc5185"
                    width="18px"
                    height="30px"
                    viewBox="0 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>cancel2</title>{" "}
                      <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z" />{" "}
                    </g>
                  </svg>
                  <p className="font-normal break-words text-sm lg:text-base">
                    {disableFeature}
                  </p>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 mt-2">
              {features?.map((feature, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-700"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <p className="font-normal break-words text-sm lg:text-base">
                    {feature}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  )
}

export default PlansCard