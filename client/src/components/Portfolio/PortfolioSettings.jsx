import { PenIcon } from "@/assets";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { deletePortfolio, editPortfolioName } from "@/Redux/Actions/portfolio";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { DeleteAlert } from "..";

const InputField = ({ name, value }) => {
  const dispatch = useDispatch();

  const [portfolioname, setPortfolioname] = useState();

  useEffect(() => {
    setPortfolioname(value?.portfolioname);
  }, [value]);

  const handleEdit = () => {
    const t = toast.loading("Editing Your Portfolio Details...");
    dispatch(
      editPortfolioName({
        portfolioname,
        portfolioId: value._id,
        toastId: t,
      })
    );
  };

  return (
    <div className="flex items-center py-5 text-xs font-semibold md:text-base ">
      <p className="w-1/2 font-semibold">{name}</p>
      {name === "Portfolio name" ? (
        <div className="bg-gray-200/80 flex py-1 px-1.5 w-full rounded-md">
          <Input
            className="focus-visible:outline-none focus-visible:ring-0 border-0 focus-visible:ring-offset-0 bg-gray-200/80 text-center font-semibold "
            value={portfolioname}
            name="portfolioname"
            onChange={(e) => setPortfolioname(e.target.value)}
          />
          <Button
            className="bg-gray-200/80 hover:bg-gray-400/50 w-16 h-7 my-auto px-1  bg-darkGreen hover:bg-darkGreen text-white hover:text-white"
            onClick={(e) => handleEdit(e)}
          >
            {/* <PenIcon className="w-2.5 fill-white" /> */}
            Update
          </Button>
        </div>
      ) : (
        <Input
          className="focus-visible:outline-none focus-visible:ring-0 border-0 focus-visible:ring-offset-0 bg-gray-200/80 text-center font-semibold disabled:opacity-100 disabled:cursor-auto"
          disabled
          value={value}
        />
      )}
    </div>
  );
};

const PortfolioSettings = ({ data }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    const t = toast.loading("Deleting Your Portfolio...");
    dispatch(
      deletePortfolio({
        investmentType: data.investmentType,
        portfolioId: data._id,
        toastId: t,
      })
    );
  };

  return (
    <section className=" w-full md:w-[500px] bg-lightGrey mx-auto p-5 rounded-xl flex flex-col justify-center mt-5">
      <div>
        <InputField name="Portfolio name" value={data} />
        <InputField name="Investment type" value={data?.investmentType} />
        <InputField name="Installment" value={data?.installment} />
        <InputField
          name="Created on"
          value={new Date(data?.createdAt).toLocaleDateString()}
        />
      </div>

      <DeleteAlert
        btnClsName="bg-[#FF0000] text-white hover:bg-[#FF0000] hover:text-white rounded-lg mx-auto mt-5"
        handleDelete={handleDelete}
        heading="Delete portfolio"
        message="This action cannot be undone. This will permanently delete your
        portfolio and remove related data from our servers."
      />
    </section>
  );
};

export default PortfolioSettings;
