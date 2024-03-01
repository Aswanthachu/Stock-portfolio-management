import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";

const Chart = (props) => {
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "#666",
      // areaTopColor = "#2962FF",
      areaTopColor = "#096A56",
      // areaBottomColor = "rgba(41, 98, 255, 0.28)",
      areaBottomColor = "rgba(9, 106, 86, 0.35)",
    } = {},
    className
  } = props;

  console.log(data);

  const currentLocale = window.navigator.languages[0];

  const myPriceFormatter = Intl.NumberFormat(currentLocale, {
    style: "currency",
    currency: "USD",
  }).format;

  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      let height;
      if(chartContainerRef.current.clientHeight > 500) height=400;
      else height=chartContainerRef.current.clientHeight;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height
      });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        fontFamily: "Poppins",
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
        // chartContainerRef.current.clientWidth < 768
        //   ? chartContainerRef.current.clientWidth
        //   : chartContainerRef.current.clientWidth < 1023
        //   ? chartContainerRef.current.clientWidth / 8
        //   : chartContainerRef.current.clientWidth < 1200
        //   ? chartContainerRef.current.clientWidth /2.5
        //   : chartContainerRef.current.clientWidth < 1500
        //   ? chartContainerRef.current.clientWidth / 3.5
        //   : chartContainerRef.current.clientWidth / 3.5,
      leftPriceScale: {
        visible: true,
      },
      rightPriceScale: {
        visible: false,
      },
      localization: {
        priceFormatter: myPriceFormatter,
      },
      crosshair: {
        mode: "magnet",
        horzLine: {
          color: "#9B7DFF",
          labelBackgroundColor: "#9B7DFF",
        },
      },
    });

    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });

    newSeries.setData(data);

    newSeries.priceScale().applyOptions({
      autoScale: false,
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return <div ref={chartContainerRef} className="h-[450px] xl:h-[480px]"/>;
};

export default Chart;
