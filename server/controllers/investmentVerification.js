import GeneratePortfolio from "../models/generatePortfolio.js";
import investmentUpdation from "../models/investmentUpdation.js";
import PortfolioSip from "../models/portfolioSip.js";
import portfolioLumpsum from "../models/portFolioLumpsum.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";

export const uploadInvestmentDetails = async (req, res) => {
  const { userId } = req;
  const { screenshot, purchaseDate, id } = req.body;
  try {
    if (!screenshot || !purchaseDate || !id) {
      return res.status(400).json("All fields are required");
    } else {
      const { secure_url } = await cloudinary.uploader.upload(screenshot, {
        folder: "InvestmentVerification",
        // upload_preset: "InvestmentVerification",
        use_filename: true,
      });
      if (secure_url) {
        await GeneratePortfolio.findByIdAndUpdate(id, {
          purchaseDate,
          screenshot: secure_url,
          investmentVerified: "pending",
        });

        res
          .status(200)
          .json({ message: "Investment details uploaded successfully.." });
      } else {
        res
          .status(400)
          .json({ message: "Error while uploading image to cloudinary." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Investment details uploading failed due to server error",
    });
  }
};

export const getAllInvestmentDetails = async (req, res) => {
  try {
    const data = await GeneratePortfolio.find(
      { investmentVerified: "pending" },
      { screenshot: false }
    ).populate({
      path: "userId",
      select: "email",
    });

    if (data) {
      res.status(200).json({
        data,
        message: "all investment deatils fetched successfully...",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "fetching all investment details failed." });
  }
};

export const verifyInvest = async (req, res) => {
  const { id } = req.params;
  const { stock: stockArray, type, gPId } = req.body;
  try {
    let stocks = [];
    if (type === "sip") {
      for (let i = 0; i < stockArray.length; i++) {
        let stockObj = {};

        let stock_symbol = stockArray[i][0];
        let quantity = stockArray[i][1];
        let buyed_price = stockArray[i][2];
        let buyed_cost_INR = stockArray[i][3];

        let quantity_each_month = [];
        let eachMonthQuantity = {
          quantity,
          buyed_price,
          buyed_cost_INR,
        };
        quantity_each_month.push(eachMonthQuantity);

        const { stocks: stock } = await PortfolioSip.findOne(
          {
            stocks: {
              $elemMatch: { stock_symbol },
            },
          },
          {
            "stocks.$": 1,
          }
        );
        const { percentage_of_portfolio } = stock;

        stockObj = {
          stock_symbol,
          quantity_each_month,
          percentage_of_portfolio: percentage_of_portfolio,
        };

        stocks.push(stockObj);
      }

      if (stocks) {
        const updatedStocks = await PortfolioSip.findByIdAndUpdate(
          id,
          {
            stocks,
            buyingDate: stockArray[0][4],
          },
          { new: true }
        );
        if (updatedStocks) {
          const details = await GeneratePortfolio.findOneAndUpdate(
            { portfolioRef: id },
            {
              investmentVerified: "verified",
            }
          );

          res.status(200).json({
            message: "stock details updated successfully..",
            updatedStocks,
          });
        } else {
          res.status(400).json({ message: "stock details updation failed." });
        }
      }
    } else {
      for (let i = 0; i < stockArray.length; i++) {
        let stockObj = {};

        let stock_symbol = stockArray[i][0];
        let quantity = stockArray[i][1];
        let cost = stockArray[i][2];
        let buyed_price = stockArray[i][4];

        const { stocks: stock } = await portfolioLumpsum.findOne(
          {
            stocks: {
              $elemMatch: { stock_symbol },
            },
          },
          {
            "stocks.$": 1,
          }
        );

        const { percentage_of_portfolio } = stock[0];

        const latest_prices = [];
        latest_prices.push(buyed_price);

        stockObj = {
          stock_symbol,
          quantity:Number(quantity).toFixed(5),
          cost,
          percentage_of_portfolio: percentage_of_portfolio,
          latest_prices,
        };

        stocks.push(stockObj);
      }

      if (stocks) {
        const updatedStocks = await portfolioLumpsum.findByIdAndUpdate(
          id,
          {
            stocks,
            buyingDate: stockArray[0][5],
            buyed_cost_INR: stockArray[0][3],
          },
          { new: true }
        );

        if (updatedStocks) {
          const details = await GeneratePortfolio.findOneAndUpdate(
            { portfolioRef: id },
            {
              investmentVerified: "verified",
            }
          );

          res
            .status(200)
            .json({ message: "stock details updated successfully.." });
        } else {
          res.status(400).json({ message: "stock details updation failed." });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "verifying investment details failed." });
  }
};

export const getSingleInvestmentDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await GeneratePortfolio.findOne({ portfolioRef: id });
    const { email } = await User.findById(data.userId, { email: true });
    data
      ? res.status(200).json({
          message: "getting single investment details failed.",
          data: { ...data._doc, email: email },
        })
      : res
          .status(400)
          .json({ message: "This user is not uploaded the screenshot." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "getting single investment detials due to internal server error.",
    });
  }
};

export const getSingleStockDetails = async (req, res) => {
  const { id, type } = req.params;

  try {
    if (id && type) {
      let singleStock = {};
      if (type === "sip") {
        singleStock = await PortfolioSip.findById(id);
      } else {
        singleStock = await portfolioLumpsum.findById(id);
      }

      singleStock
        ? res.status(200).json({
            message: "stock details fetched successfully.",
            singleStock,
          })
        : res.status(400).json({ message: "stock details fetching failed." });
    } else {
      res.status(201).json({ message: "This user is not created portfolio." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "stock details fetching failed due to some internal server error",
    });
  }
};
