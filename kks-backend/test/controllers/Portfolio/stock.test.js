import { addNewStocks , getStocks ,editStocks , deleteStocks} from "../../../controllers/portfolio/stocks.js"; 
import Stocks from "../../../models/stocks.js";
import { getStockDeatils } from "../../../controllers/portfolio/portfolio.js";
import { connectDb,clearDatabase,closeDatabase } from "../../databaseHandler/db-handler.js";

// Mock the external dependencies (e.g., mongoose functions and getStockDetails)


describe('addNewStocks', () => {
  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())

  it('should add a new stock successfully', async () => {


    const mockReq = {
      body: {
        stock: 'AAPL',
        portfolioPercentage: 10,
      },
    };

    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

    // Mock the findOne and findOneAndUpdate methods of your Stocks model
   
    await addNewStocks(mockReq, mockRes);
  
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'stock added successfully..',
      newStock: expect.any(Array), // You can add more specific assertions here
    });
  });

  
  it('should update an existing stock successfully', async () => {
    // Add an existing stock to the database before the test
    await Stocks.create({
      stock_symbol: 'AAPL',
      stock_name:"Apple Inc",
      percentage_portfolio: 5,
      current_Price: 140.0,
    });

    const mockReq = {
      body: {
        stock: 'AAPL',
        portfolioPercentage: 10,
      },
    };

    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

   
    await addNewStocks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'stock added successfully..',
      newStock: expect.any(Array),
    });

    // Verify that the existing stock has been updated in the database
    const updatedStock = await Stocks.findOne({ stock_symbol: 'AAPL' });
    expect(updatedStock.percentage_portfolio).toBe(10);
    expect(updatedStock.current_Price).toEqual(expect.any(Number));
  });

  it('should handle errors and return a 400 status code', async () => {
    const mockReq = {
      body: {
        stock: 'InvalidStock',
        portfolioPercentage: 10,
      },
    };

    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

 
    await addNewStocks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "stock adding failed.",
    });
  });
});




describe('editStocks', () => {
  beforeAll(async () => await connectDb());
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  it('should edit an existing stock successfully', async () => {
    // Add an existing stock to the database before the test
    const existingStock = await Stocks.create({
      stock_symbol: 'AAPL',
      percentage_portfolio: 5,
      current_Price: 140.0,
      stock_name: 'Apple Inc',
    });

    const mockReq = {
      params: {
        id: existingStock._id, // Use the ID of the existing stock
      },
      body: {
        stock: 'AAPL',
        portfolioPercentage: 10,
      },
    };

    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

    await editStocks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'stock updated successfully..',
      updatedData: expect.objectContaining({
        stock_symbol: 'AAPL',
        percentage_portfolio: 10,
        stock_name: 'Apple Inc',
        // current_Price: expect.any(Number), // Check for a number
      }),
    });
  });

  it('should handle errors when editing a stock', async () => {
    // Add an existing stock to the database before the test
    const existingStock = await Stocks.create({
      stock_symbol: 'AAPL',
      percentage_portfolio: 5,
      current_Price: 140.0,
      stock_name: 'Apple Inc.',
    });

    const mockReq = {
      params: {
        id: '1234',
      },
      body: {
        stock: 'AAPL',
        portfolioPercentage: 10,
      },
    };

    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

    // Mock the response from getStockDetails function to simulate an error

    await editStocks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'problem at reaching iexcloud.io or problem in getting stock details.',
    });
  });

  // Add more test cases for different scenarios as needed
});

describe('deleteStocks', () => {
  beforeAll(async () => await connectDb());
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  it('should delete a stock successfully', async () => {
    // Add an existing stock to the database before the test
    const existingStock = await Stocks.create({
      stock_symbol: 'AAPL',
      percentage_portfolio: 5,
      current_Price: 140.0,
      stock_name: 'Apple Inc.',
    });

    const mockReq = {
      params: {
        id: existingStock._id, // Use the ID of the existing stock
      },
    };

    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

    await deleteStocks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'stock details deleted successfully...',
    });

    // Verify that the stock has been deleted from the database
    const deletedStock = await Stocks.findById(existingStock._id);
    expect(deletedStock).toBeNull(); // Ensure the stock is deleted
  });

  it('should handle errors when deleting a stock', async () => {
   
    const mockReq = {
      params: {
        id: 'nonexistent_id', // Use an ID that doesn't exist in the database
      },
    };

    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

    await deleteStocks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'deleting stock details failed.',
    });
  });

});


describe('getStocks', () => {
  beforeAll(async () => await connectDb());
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  it('should retrieve stocks successfully', async () => {
    // Add one or more existing stocks to the database before the test
    await Stocks.create([
      {
        stock_symbol: 'AAPL',
        percentage_portfolio: 5,
        current_Price: 140.0,
        stock_name: 'Apple Inc.',
      },
      {
        stock_symbol: 'GOOGL',
        percentage_portfolio: 10,
        current_Price: 2500.0,
        stock_name: 'Alphabet Inc.',
      },
    ]);

    const mockReq = {};
    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

    await getStocks(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      stocks: expect.arrayContaining([
        expect.objectContaining({
          stock_symbol: 'AAPL',
          percentage_portfolio: 5,
          // You can omit other properties you don't want to check
        }),
        expect.objectContaining({
          stock_symbol: 'GOOGL',
          percentage_portfolio: 10,
          // You can omit other properties you don't want to check
        }),
      ]),
    });
  });

  it('should handle errors when no stocks available', async () => {
  
    const mockReq = {};
    const mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
    };

    await getStocks(mockReq, mockRes);


    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "No stocks available.",
    });
  });

});