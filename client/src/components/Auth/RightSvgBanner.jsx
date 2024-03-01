const RightSvgBanner = ({ icon }) => {
  return (
    <div className=" w-full flex justify-center items-start md:h-full  md:w-1/2  md:hidden lg:block  ">
      <div className="w-full md:p-[15%] md:bg-lightGreen h-full flex md:justify-center md:items-center rounded-l-3xl">
        <img src={icon} alt="banner-icon" className="w-[180px] xs-width sm:max-h-[200px] md:max-h-full md:w-full md:h-full mx-auto"/>
      </div>
    </div>
  );
};

export default RightSvgBanner;
