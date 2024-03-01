import RobotAnimation from "../../assets/images/RobotAnimation.gif";
import { motion } from "framer-motion";

const AiIntroduction = () => {
  const { username } = JSON.parse(localStorage.getItem("user"));

  const text = `Hello ${username}! I am a AI customer support agent here at KKSCapitals.
I'm here to assist you with any inquiries you may have regarding our
fintech application, investment advisory services, and portfolio
management tools. Whether you have questions about our subscription
plans, stock recommendations, or need help navigating our application,
I'm at your service. If there's something I can't answer directly,
I'll guide you on how to raise a ticket for specialized assistance
from our expert team. How may I assist you today?`;

  const defaultAnimations = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <div className="relative mx-auto md:w-[50%]">
        <img src={RobotAnimation} alt="Robot" className="" />
        <div className="bg-white h-1 absolute -bottom-0.5 w-full" />
      </div>
      <div className=" w-[90%] md:w-[70%] ">
        <p className="text-sm font-bold leading-loose font-smoochSans">
          <span className="sr-only">{text}</span>
          <motion.span
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.04 }}
            aria-hidden
          >
            {text.split("").map((char) => (
              <motion.span variants={defaultAnimations}>{char}</motion.span>
            ))}
          </motion.span>
        </p>
      </div>
    </div>
  );
};

export default AiIntroduction;
