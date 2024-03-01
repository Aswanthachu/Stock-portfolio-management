import emptyData from "@/lib/constants/emptyGraphData";
import Chart from "./Chart";
// import { ChartLoading } from "@/assets";

import GraphLoading from "@/assets/images/GraphLoading.gif";
import { useEffect, useState } from "react";

const Graph = ({ data, isLoading, planStatus }) => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (data?.length) {
      const transformedData = data.map((item) => ({
        time: item.time,
        ...(item.value !== undefined && { value: item.value }),
      }));
      setGraphData(transformedData);
    }
  }, [data]);


  return (
    <section className="-ml-7 -mr-4 md:mx-0 md:min-h-[100px] lg:h-[500px] space-y-5 mt-10">
      <p className="text-darkGreen text-xl font-bold ml-6">Analytics</p>
      {isLoading ? (
        <div className="max-h-[400px]">
          <img
            src={GraphLoading}
            alt="no"
            className="w-9/12 h-[300px] md:h-[500px]  md:mb-20 mx-auto "
          />
        </div>
      ) : (
        <>
          {graphData?.length > 0 && planStatus === "active" ? (
            <Chart data={graphData} className="max-h-[300px]" />
          ) : (
            <Chart data={emptyData} className="max-h-[300px]" />
          )}
        </>
      )}
    </section>
  );
};

export default Graph;
