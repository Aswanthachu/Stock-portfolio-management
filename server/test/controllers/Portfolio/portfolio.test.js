// Import necessary modules and functions
import { addNewPortfolio ,getPortfoliosDetails ,getSinglePortfolio,getSingleStockToBuy,deleteSinglePortfolio, editPortfolioSettings} from '../../../controllers/portfolio/portfolio.js';
import { addNewStocks } from "../../../controllers/portfolio/stocks.js"; 
import GeneratePortfolio from '../../../models/generatePortfolio.js';
import User from '../../../models/user.js';
import Stocks from '../../../models/stocks.js';
import PortfolioSip from '../../../models/portfolioSip.js';
import portfolioLumpsum from '../../../models/portFolioLumpsum.js';
import { connectDb, clearDatabase, closeDatabase } from '../../databaseHandler/db-handler.js';
import bcrypt from 'bcrypt'
describe('addNewPortfolio', () => {

    beforeAll(async () => await connectDb())
    beforeEach(async () => await clearDatabase())
    afterAll(async () => await closeDatabase())

    it('should create a new portfolio for a user and return the expected response', async () => {

        // Create a user object with the required data for mocking user
        const password = 'testpassword'
        const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
        const hashedPassword = bcrypt.hashSync(password, salt);
        const testUser = {
            username: 'testuser',
            email: 'test@example.com',
            profilePic: 'profile.jpg',
            hashedPassword,
        };
        // Insert the test user into the database 
        const insertedUser = await User.create(testUser)

        // Mock request and response objects
        const req = {
            userId: insertedUser._id,
            body: {
                installment: 1000,
                portfolioname: 'MyPortfolio',
                investmentPlan: 'sip',
                frequency: 'monthly',
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };


        // Call the function
        await addNewPortfolio(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'successfully created new portfolio.',
            data: {
                dashboardTableData: expect.any(Array), // Match any array
                dashboardGraphData: {
                    labels: expect.any(Array), // Match any array
                    data: expect.any(Array),   // Match any array
                },
            },
            portfolio: {
                portfolioId: expect.any(Object), // Match any ObjectId-like object
                portfolio_name: 'MyPortfolio',
                investmentType: 'sip',
            },
        }));
    },10000);

    it('should create a new lumpsum portfolio and return the expected response', async () => {
        // Mock dependencies and provide necessary data for a lumpsum portfolio
        // Create a user object with the required data for mocking user
        const password = 'testpassword'
        const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
        const hashedPassword = bcrypt.hashSync(password, salt);
        const testUser = {
            username: 'testuser',
            email: 'test@example.com',
            profilePic: 'profile.jpg',
            hashedPassword,
        };
        // Insert the test user into the database 
        const insertedUser = await User.create(testUser)

        // Mock request and response objects
        const req = {
            userId: insertedUser._id,
            body: {
                installment: 5000,
                portfolioname: 'LumpsumPortfolio',
                investmentPlan: 'lumpsum',
            },
        };


        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await addNewPortfolio(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'successfully created new portfolio.',
            data: {
                dashboardTableData: expect.any(Array), // Match any array
                dashboardGraphData: {
                    labels: expect.any(Array), // Match any array
                    data: expect.any(Array),   // Match any array
                },
            },
            portfolio: {
                portfolioId: expect.any(Object), // Match any ObjectId-like object
                portfolio_name: 'LumpsumPortfolio',
                investmentType: 'lumpsum',
            },
        }));
    },10000);
});




describe('getPortfoliosDetails', () => {

    beforeAll(async () => await connectDb())
    beforeEach(async () => await clearDatabase())
    afterAll(async () => await closeDatabase())


    
    it('should retrieve portfolio details from the database and return the expected response', async () => {
    // Create a user object with the required data for mocking user
    const password = 'testpassword'
    const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
    const hashedPassword = bcrypt.hashSync(password, salt);
    const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        profilePic: 'profile.jpg',
        hashedPassword,
    };
    // Insert the test user into the database 
    const insertedUser = await User.create(testUser)

    // Mock request and response objects
    const data = {
        userId: insertedUser._id,
        body: {
            installment: 1000,
            portfolioname: 'MyPortfolio',
            investmentPlan: 'sip',
            frequency: 'monthly',
        },
    };
    const resData = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    await addNewPortfolio(data, resData);

        // Define a sample userId and expected response

        const userId = insertedUser._id;
        const expectedResponse = {
            data: {
                // Define the expected data structure for dashboardTableData and dashboardGraphData
                dashboardTableData: expect.any(Array),
                dashboardGraphData: {
                    labels: expect.any(Array),
                    data: expect.any(Array),
                },
            },
            portfolios: [
                {
                    portfolioId: expect.any(Object), // Match any ObjectId-like object
                    portfolio_name: 'MyPortfolio',
                    investmentType: 'sip',
                    investmentVerified: 'notVerified',
                },
                // Add more portfolio objects as needed
            ],
            message: 'successfully get the portfolio values',
        };

        // Set up the request and response objects
        const req = {
            userId,
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };


        // Call the function with the mocked request and response
        await getPortfoliosDetails(req, res);

        // Expectations
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);

        
    });

    it('should return a 400 status when no portfolio data is found', async () => {

        
        // Mock dependencies to return an empty result for User.aggregate
        const password = 'testpassword'
        const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
        const hashedPassword = bcrypt.hashSync(password, salt);
        const testUser = {
            username: 'testuser',
            email: 'test@example.com',
            profilePic: 'profile.jpg',
            hashedPassword,
        };
        // Insert the test user into the database 
        const insertedUser = await User.create(testUser)
        const userId = insertedUser._id;
      
        const req = {
          userId,
        };
      
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Ensure that User.aggregate returns an empty result
      
        await getPortfoliosDetails(req, res);
      
        // Expectations
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message:"No Data"
        });
      });
});


describe('getSinglePortfolio', () => {
    beforeAll(async () => await connectDb())
    beforeEach(async () => await clearDatabase())
    afterAll(async () => await closeDatabase())

  
    it('should calculate and return portfolio data if not found in cache (SIP)', async () => {
    
              await Stocks.create( {
                "stock_symbol": "AMZN",
                "percentage_portfolio": 100,
                "current_Price": 132.00,
                "stock_rate": [
                  {
                    "stock_price": 132.00,
                    "price_date": new Date(),
                  },
                ],
                "stock_name": "Amazon.com Inc",
              });

          // Create a user object with the required data for mocking user
          const password = 'testpassword'
          const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
          const hashedPassword = bcrypt.hashSync(password, salt);
          const testUser = {
              username: 'testuser',
              email: 'test@example.com',
              profilePic: 'profile.jpg',
              hashedPassword,
          };
          // Insert the test user into the database 
          const insertedUser = await User.create(testUser)
  
          // Mock request and response objects
          const mockaddportfolioreq = {
              userId: insertedUser._id,
              body: {
                  installment: 1000,
                  portfolioname: 'MyPortfolio',
                  investmentPlan: 'sip',
                  frequency: 'monthly',
              },
          };
  
          const mockaddportfoliores = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
          };
  
  
          // Call the function
          await addNewPortfolio(mockaddportfolioreq, mockaddportfoliores);

          const {_id} = await GeneratePortfolio.findOne({userId:insertedUser._id},{_id:true})
      const req = { body: { investmentType: 'sip', portfolioId: _id } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      // Mock your getTableData and getGraphData functions as needed
  
      await getSinglePortfolio(req, res);
    // Expectations
      // Define the expected response object
  const expectedResponse = {
    message: "successfully get the portfolio values",
    data:  {
      dashboardGraphData: {
        data: expect.arrayContaining([expect.any(String||null), expect.any(String||null), expect.any(String||null)]),
        labels: expect.arrayContaining([expect.any(Number), expect.any(Number), expect.any(Number)]),
      },
      dashboardTableData: [
        expect.objectContaining({
          companyName: "Amazon.com Inc",
          latestPrice: expect.any(Number),
          share: expect.any(Number),
          totalChange: expect.any(Number),
          totalChangeInPercentage: expect.any(Number),
          totalCostAverage: expect.any(Number),
          totalValue: expect.any(Number),
        }),
      ],
    },
  };
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(expectedResponse));
    },10000);
  
    it('should handle errors gracefully', async () => {
      const req = { body: { investmentType: 'sip', portfolioId: '123' } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
  
      await getSinglePortfolio(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({"message": "Internal server error due to some server error",});
    });
  });


describe('getSingleStockToBuy', () => {

    beforeAll(async () => await connectDb())
    beforeEach(async () => await clearDatabase())
    afterAll(async () => await closeDatabase())
  // Test case 1: Successfully get single stock to buy data for SIP
  it('should return userBuyedStock for SIP investment', async () => {
    await Stocks.create( {
      "stock_symbol": "AAPL",
      "percentage_portfolio": 50,
      "current_Price": 142.00,
      "stock_rate": [
        {
          "stock_price": 142.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    },{
      "stock_symbol": "AMZN",
      "percentage_portfolio": 50,
      "current_Price": 132.00,
      "stock_rate": [
        {
          "stock_price": 132.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    });

// Create a user object with the required data for mocking user
const password = 'testpassword'
const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
const hashedPassword = bcrypt.hashSync(password, salt);
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    profilePic: 'profile.jpg',
    hashedPassword,
};
// Insert the test user into the database 
const insertedUser = await User.create(testUser)

// Mock request and response objects
const mockaddportfolioreq = {
    userId: insertedUser._id,
    body: {
        installment: 1000,
        portfolioname: 'MyPortfolio',
        investmentPlan: 'sip',
        frequency: 'monthly',
    },
};

const mockaddportfoliores = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};


// Call the function
await addNewPortfolio(mockaddportfolioreq, mockaddportfoliores);

const {_id} = await GeneratePortfolio.findOne({userId:insertedUser._id},{_id:true})
  
    const expectedStockData = [
      expect.objectContaining({ "stock_symbol": "AAPL", "percentage_of_portfolio": 50, }), expect.objectContaining({ "stock_symbol": "AMZN", "percentage_of_portfolio": 50, })];



    const req = { body: { investmentType: 'sip', portfolioId: _id } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await getSingleStockToBuy(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'successfully get single stock to buy data',
      userBuyedStock: expectedStockData,
    });
  },10000);

  // Test case 2: Successfully get single stock to buy data for lumpsum
 
 
  it('should return userBuyedStock for lumpsum investment', async () => {
    await Stocks.create( {
      "stock_symbol": "AAPL",
      "percentage_portfolio": 50,
      "current_Price": 142.00,
      "stock_rate": [
        {
          "stock_price": 142.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    },{
      "stock_symbol": "AMZN",
      "percentage_portfolio": 50,
      "current_Price": 132.00,
      "stock_rate": [
        {
          "stock_price": 132.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    });

// Create a user object with the required data for mocking user
const password = 'testpassword'
const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
const hashedPassword = bcrypt.hashSync(password, salt);
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    profilePic: 'profile.jpg',
    hashedPassword,
};
// Insert the test user into the database 
const insertedUser = await User.create(testUser)

// Mock request and response objects
const mockaddportfolioreq = {
    userId: insertedUser._id,
    body: {
        installment: 1000,
        portfolioname: 'MyPortfolio',
        investmentPlan: 'lumpsum',
    },
};

const mockaddportfoliores = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};


// Call the function
await addNewPortfolio(mockaddportfolioreq, mockaddportfoliores);

const {_id} = await GeneratePortfolio.findOne({userId:insertedUser._id},{_id:true})
  
    const expectedStockData = [
      expect.objectContaining({ "stock_symbol": "AAPL", "percentage_of_portfolio": 50, }), expect.objectContaining({ "stock_symbol": "AMZN", "percentage_of_portfolio": 50, })];



    const req = { body: { investmentType: 'lumpsum', portfolioId: _id } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await getSingleStockToBuy(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'successfully get single stock to buy data',
      userBuyedStock: expectedStockData,
    });
  });

  // Test case 3: Handle error scenario
  it('should return a 500 status and error message on internal server error', async () => {
    const portfolioId = 'somePortfolioId';
    const investmentType = 'sip';

   
    const req = { body: { portfolioId, investmentType } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await getSingleStockToBuy(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'getting single stock to buy details failed due to internal server error',
    });
  });
});


describe('deleteSinglePortfolio', () => {
  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())
  it('should delete a portfolio', async () => {
    await Stocks.create( {
      "stock_symbol": "AAPL",
      "percentage_portfolio": 50,
      "current_Price": 142.00,
      "stock_rate": [
        {
          "stock_price": 142.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    },{
      "stock_symbol": "AMZN",
      "percentage_portfolio": 50,
      "current_Price": 132.00,
      "stock_rate": [
        {
          "stock_price": 132.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    });

// Create a user object with the required data for mocking user
const password = 'testpassword'
const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
const hashedPassword = bcrypt.hashSync(password, salt);
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    profilePic: 'profile.jpg',
    hashedPassword,
};
// Insert the test user into the database 
const insertedUser = await User.create(testUser)

// Mock request and response objects
const mockaddportfolioreq = {
    userId: insertedUser._id,
    body: {
        installment: 1000,
        portfolioname: 'MyPortfolio',
        investmentPlan: 'sip',
    },
};

const mockaddportfoliores = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};


// Call the function
await addNewPortfolio(mockaddportfolioreq, mockaddportfoliores);

const {_id} = await GeneratePortfolio.findOne({userId:insertedUser._id},{_id:true})
   
    const req = { userId:insertedUser._id, body: { portfolioId:_id, investmentType:'sip' } };
    const res = {
      status: jest.fn(()=> res),
      json: jest.fn(),
    };

    await deleteSinglePortfolio(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'successfully deleted portfolio', portfolioId:_id });
  },10000);

  it('should handle errors', async () => {
    const userId = 'someUserId';
    const portfolioId = 'somePortfolioId';
    const investmentType = 'sip';

    const req = { userId, body: { portfolioId, investmentType } };
    const res = {
      status: jest.fn(()=> res),
      json: jest.fn(),
    };

    // Expect the function to throw an error and return a 400 status
    await deleteSinglePortfolio(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "portfolio  can't delete." });
  });
});


describe('editPortfolioSettings', () => {

  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())

  it('should edit portfolio settings', async () => {

    await Stocks.create( {
      "stock_symbol": "AAPL",
      "percentage_portfolio": 50,
      "current_Price": 142.00,
      "stock_rate": [
        {
          "stock_price": 142.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    },{
      "stock_symbol": "AMZN",
      "percentage_portfolio": 50,
      "current_Price": 132.00,
      "stock_rate": [
        {
          "stock_price": 132.00,
          "price_date": new Date(),
        },
      ],
      "stock_name": "Amazon.com Inc",
    });

// Create a user object with the required data for mocking user
const password = 'testpassword'
const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
const hashedPassword = bcrypt.hashSync(password, salt);
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    profilePic: 'profile.jpg',
    hashedPassword,
};
// Insert the test user into the database 
const insertedUser = await User.create(testUser)

// Mock request and response objects
const mockaddportfolioreq = {
    userId: insertedUser._id,
    body: {
        installment: 1000,
        portfolioname: 'MyPortfolio',
        investmentPlan: 'sip',
    },
};

const mockaddportfoliores = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};


// Call the function
await addNewPortfolio(mockaddportfolioreq, mockaddportfoliores);

const {_id} = await GeneratePortfolio.findOne({userId:insertedUser._id},{_id:true})
 
    const portfolioId = _id;
    const portfolioname = 'New Portfolio Name';
    const updatedPortfolio = {
      _id: _id,
      portfolioname,
      // Other properties you expect to be updated
    };

    const req = { body: { portfolioId, portfolioname } };
    const res = {
      status: jest.fn(()=> res),
      json: jest.fn(),
    };

    await editPortfolioSettings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'portfolio details updated successfully..',
      editedPortfolio:expect.objectContaining(updatedPortfolio) ,
    }));
  });

  it('should handle errors', async () => {
    const portfolioId = 'somePortfolioId';
    const portfolioname = 'New Portfolio Name';

   
    const req = { body: { portfolioId, portfolioname } };
    const res = {
      status: jest.fn(()=> res),
      json: jest.fn(),
    };

    // Expect the function to throw an error and return a 500 status
    await editPortfolioSettings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "portfolio details can't edit." });
  });
});