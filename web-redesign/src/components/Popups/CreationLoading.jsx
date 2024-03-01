const CreationLoading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm  z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg   mx-4">
        <div className=" flex flex-col justify-center items-center py-14 px-10">
          <div class="typewriter my-7">
            <div class="slide">
              <i></i>
            </div>
            <div class="paper"></div>
            <div class="keyboard"></div>
          </div>

          <div className="text-center font-bold text-xs md:text-base font-sans">
            <h1>Creating Your portfolio...</h1>
            <h1>Please Wait...</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreationLoading;
