import { connectDb, clearDatabase, closeDatabase } from '../../databaseHandler/db-handler.js';
import { userDashboardData, getMainDashboard } from '../../../controllers/portfolio/portfolioDashboard.js';
import { addNewPortfolio } from '../../../controllers/portfolio/portfolio.js';
import bcrypt from 'bcrypt'
import Stocks from '../../../models/stocks.js';
import User from '../../../models/user.js';
describe('userDashboardData', () => {

    beforeAll(async () => await connectDb())
    beforeEach(async () => await clearDatabase())
    afterAll(async () => await closeDatabase())


    it('should return dashboard table data', async () => {

        await Stocks.create({
            "stock_symbol": "AAPL",
            "percentage_portfolio": 50,
            "current_Price": 142.00,
            "stock_rate": [
                {
                    "stock_price": 142.00,
                    "price_date": new Date(),
                },
            ],
            "stock_name": "Apple Inc",
        }, {
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




        const req = { userId: insertedUser._id };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };


        await userDashboardData(req, res);
        const expectedData = {
            tableData: {
                'Amazon.com Inc': {
                    cost: undefined,
                    latestPrice: 132,
                    share: expect.any(Number),
                    totalChange: 0,
                    totalChangeInPercentage: 0,
                    totalCostAverage:expect.any(Number),
                    totalValue: expect.any(Number),
                },
                'Apple Inc': {
                    cost: undefined,
                    latestPrice: 142,
                    share: expect.any(Number),
                    totalChange: 0,
                    totalChangeInPercentage: 0,
                    totalCostAverage:expect.any(Number),
                    totalValue: expect.any(Number),
                },
            },
            totalGainDetails: {
                End_Date: undefined,
                capitalGain: expect.any(Number),
                capitalGainPercentage: expect.any(Number),
                currencyGain: expect.any(Number),
                currencyGainInPercentage: expect.any(Number),
                pln: NaN,
                subscriptionEndDate: undefined,
                sumOfTotalInvestmentINR: expect.any(Number),
                totalPortfolio: expect.any(Number),
                totalPortfolioUSD: expect.any(Number),
                totalReturnPercentage: expect.any(Number),
                totalReturns: expect.any(Number),
            },
        };

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expectedData);
    },15000);


    it('should handle errors and return an error response', async () => {

        const req = { userId: "1234" };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };


        await userDashboardData(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({message:"Internal server error."})
    });
});

describe('getMainDashboard', () => {
    beforeAll(async () => await connectDb())
    beforeEach(async () => await clearDatabase())
    afterAll(async () => await closeDatabase())
  
    it('should return dashboard graph data', async () => {
    
        await Stocks.create({
            "stock_symbol": "AAPL",
            "percentage_portfolio": 50,
            "current_Price": 142.00,
            "stock_rate": [
                {
                    "stock_price": 142.00,
                    "price_date": new Date(),
                },
            ],
            "stock_name": "Apple Inc",
        }, {
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




        const req = { userId: insertedUser._id };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };


      await getMainDashboard(req, res);
  
      // Expect that the response status and JSON match the cached data
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        "dashboardGraphData":expect.objectContaining({
            data:expect.arrayContaining([expect.any(String||null), expect.any(String||null), expect.any(String||null)]),
            labels: expect.arrayContaining([expect.any(Number), expect.any(Number), expect.any(Number)]),
        })
        ,
        "message": "User dashboard graph data updated successfully.",}));
    });
  
    it('should handle the case when the user has no portfolios', async () => {
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
        const req = { userId: insertedUser._id };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

      await getMainDashboard(req, res);
  
      // Expect that the response status is 400 and it contains an appropriate message
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not created any portfolio.' });
    });
  
 
  
    it('should handle errors gracefully', async () => {
        const req = { userId: "123" };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
      await getMainDashboard(req, res);
  
      // Expect that the response status is 500 and it contains an appropriate error message
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error while creating user main dashboard.' });
    });
  });