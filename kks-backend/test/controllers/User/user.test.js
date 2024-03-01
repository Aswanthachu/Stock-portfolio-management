import { userSignup ,userLogin,  generateToken, getUserByEmail,  handleLogin,} from '../../../controllers/user/user';
import { clearDatabase, closeDatabase, connectDb } from '../../databaseHandler/db-handler';
import User from '../../../models/user';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config({ path: "./config.env" });

describe('userSignup', () => {
  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())

  it('should create a new user', async () => {
    const req = {
      body: {
        userData: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword',
        },
      },
    };
  
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  
    await userSignup(req, res);

  
    const expectedResponse = {
      userData: expect.objectContaining({
        username: 'testuser',
        email: 'test@example.com',
       
      }),
      token: expect.any(String), // Expecting a string token
      message: "User signed up successfully.",
    };
    expect(res.status).toHaveBeenCalledWith(200); // Expect a 201 status code for a successful creation
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

 it('should create a new user without a password', async () => {
    const req = {
      body: {
        userData: {
          username: 'testuser',
          email: 'test@example.com',
          profilePic: 'profile.jpg',
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };


    await userSignup(req, res);
    const expectedResponse = {
      userData: expect.objectContaining({
        username: 'testuser',
        email: 'test@example.com',
       
      }),
      token: expect.any(String), // Expecting a string token
      message: "User signed up successfully.",
    };
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should handle missing data fields', async () => {
    const req = {
      body: {
        userData: {
          // Missing required fields
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await userSignup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing Datas.' });
  });

});
describe('userLogin', () => {
  beforeAll(async () => await connectDb());
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  it('should log in a user with valid credentials', async () => {
    // Create a user object with the required data
    const password = 'testpassword'
    const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
    const hashedPassword = bcrypt.hashSync(password, salt);
    const testUser = {
      username: 'testuser',
          email: 'test@example.com',
          profilePic: 'profile.jpg',
      hashedPassword ,
    };
      
    // Insert the test user into the database 
  
    const insertedUser = await User.create(testUser)
    // For example, if you're using Mongoose:

    const req = {
      body: {
        userData: {
          email: 'test@example.com',
          password:password
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      existingUser: expect.objectContaining({
        username: 'testuser',
        email: 'test@example.com',
        profilePic: 'profile.jpg',
      },) ,
      message: 'Successfully logged in.',
      planStatus: 'notSubscribed',
      token: expect.any(String), 
    });
        
  });

  // Add other test cases for different scenarios
});



describe('generateToken', () => {
  it('should generate a valid JWT token with valid input', () => {
    const email = 'test@example.com';
    const id = '123456789';

    // Call the generateToken function
    const token = generateToken(email, id);

    // Expect the token to be a non-empty string
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    // You can also add more specific assertions about the token if needed
  });

  it('should throw an error if email is missing', () => {
    // Use a try...catch block to capture the error
    try {
      generateToken(null, '123456789'); // Pass null as email to simulate a missing email
      // If token generation does not throw an error, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Expect the error message to match the custom error message
      expect(error.message).toBe('Email and id are required to generate a JWT token');
    }
  });

  it('should throw an error if id is missing', () => {
  
    // Use a try...catch block to capture the error
    try {
      generateToken('test@example.com', null); // Pass null as id to simulate a missing id
      // If token generation does not throw an error, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Expect the error message to match the custom error message
      expect(error.message).toBe('Email and id are required to generate a JWT token');
    }
  });
});


describe('getUserByEmail', () => {
  beforeAll(async () => await connectDb());
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  it('should return a user when found', async () => {
    // Create a sample user in the in-memory database
    const sampleUser = new User({  username: 'testuser',
    email: 'test@example.com',
    profilePic: 'profile.jpg', });
    await sampleUser.save();

    // Call the function
    const result = await getUserByEmail('test@example.com');

    // Assertions
    expect(result.email).toBe('test@example.com');
  });

});

describe('handleLogin', () => {

  beforeAll(async () => await connectDb());
  beforeEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  it('should generate a token and update login history when the correct password is provided', async () => {
    // Create a mock user in the in-memory database
    const password = 'correct-password';
    const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUND));
    const hashedPassword = bcrypt.hashSync(password, salt);
    const existingUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      profilePic: 'profile.jpg',
      hashedPassword
    });
    await existingUser.save();

   
    const req = {};
    const res = {};
    const uid = undefined;
    const type = undefined;

 

    const result = await handleLogin(existingUser, password, req, res, uid, type);

    expect(result.token).toBeDefined();
    expect(result.message).toBe('');
  });

  // Write more test cases for other scenarios...
});