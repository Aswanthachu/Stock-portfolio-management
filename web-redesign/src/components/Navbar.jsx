import { BellIcon } from "@/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="shadow-none md:hidden py-3 fixed top-0 h-[80px]  z-50 min-w-full bg-darkGreen text-white max-h-[60px] ">
      <div className=" mx-8 flex justify-between items-center realative">
        <Link to={"/"} className="  text-xl font-bold ">
          KKS
        </Link>
        <div className="relative">
          <BellIcon className="w-7 h-7 text-white fill-white" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
