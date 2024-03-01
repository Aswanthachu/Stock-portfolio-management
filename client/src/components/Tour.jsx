import React, { useEffect, useState } from 'react';
import { Steps } from "intro.js-react";
import { useSelector , useDispatch } from 'react-redux';
import { clearTour } from '../Redux/Features/user';
import "intro.js/introjs.css";

const Tour = () => {
  const dispatch = useDispatch()
  const showTour = useSelector((state)=>state?.user?.showTour)
    const [stepsEnabled, setStepsEnabled] = useState(false);
    const [initialStep] = useState(0);
    const [steps] = useState([
      
      {
        element: ".a",
        title:"Home",
        intro: "Here is the home page , where you can see your current Portfolio value , Plan details , Total investment , Your holdings etc",
        position: 'right',
        tooltipClass: 'custom-tooltip',
      },
      {
        element: ".b",
        title:"Portfolio",
        intro: "This is Portfolio Page , where you can view and update your portfolios",
         position: 'right',
         tooltipClass: 'custom-tooltip',

      },
      {
        element: ".c",
        title:"Tickets",
        intro: "If you have any questions , Raise a ticket form here",
        position: 'right',
        tooltipClass: 'custom-tooltip',

      },
      {
        element: ".d",  
        title:"Tutorials",
        intro: "Don't know how to buy stocks? Dont worry ,Here are some Recommended Videos",
        position: 'right',
        tooltipClass: 'custom-tooltip',

      },
      {
        element: ".e",
        title:"Subscription",
        intro: "Here you can View your subscription details",
        position: 'right',
        tooltipClass: 'custom-tooltip',

      },
    ]);
   
  
    const handleExit = () => {
      dispatch(clearTour())
      setStepsEnabled(false);
    };
  
  useEffect(()=>{
    if(showTour){
      setTimeout(()=>{
        setStepsEnabled(true)
    },1000)
    }
  },[showTour])


  
  return (
    <div>
    <Steps
      enabled={stepsEnabled}
      steps={steps}
      initialStep={initialStep}
      onExit={handleExit}

      options={{
        showButtons: true,
    
        nextLabel: "Next",
        prevLabel: "Previous",
        // buttonClass:"tooltip-button",
      }}
    />

   </div>
  );
};

export default Tour;