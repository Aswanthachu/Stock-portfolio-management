import { addTutorialVideo, getTutorialVideos, editTutorialVideo, deleteTutorial } from '../../../controllers/tutorialVideos';
import TutorialVideo from '../../../models/tutorialVideo';
import { connectDb, clearDatabase, closeDatabase } from '../../databaseHandler/db-handler.js';



describe('addTutorialVideo', () => {

  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())

  it('should add a tutorial video', async () => {
    const req = {
      body: {
        embedCode: 'GcGSt8AQBFw',
        title: 'Example Video',
        description: 'This is an example video',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addTutorialVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'Video added successfully',
    });

    // Verify that the video was added to the database
    const savedVideo = await TutorialVideo.findOne({ title: 'Example Video' });
    expect(savedVideo).toBeTruthy();
  });

  it('should handle errors and return a 500 status code', async () => {
    const req = {
      body: {
        invalidField: 'invalidValue', // Simulate invalid data
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addTutorialVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('getTutorialVideos', () => {

  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())

  it('should return a list of tutorial videos when videos are available', async () => {
    // Create sample tutorial videos in the database
    const tutorialVideos = [
      {
        embedCode: 'GcGSt8AQBFw1',
        title: 'Example Video1',
        description: 'This is an example video1',
      },
      {
        embedCode: 'GcGSt8AQBFw2',
        title: 'Example Video2',
        description: 'This is an example video2',
      },
    ];
    await TutorialVideo.insertMany(tutorialVideos);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTutorialVideos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      tutorialVideos: expect.arrayContaining([
        expect.objectContaining({
          title: "Example Video1",
          description: "This is an example video1",
          embedCode: "GcGSt8AQBFw1",
        }),
        expect.objectContaining({
          title: "Example Video2",
          description: "This is an example video2",
          embedCode: "GcGSt8AQBFw2",
        }),
        // Add more objects as needed
      ]),
    });
  });

  it('should return a message when no tutorial videos are available', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTutorialVideos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'No tutorial videos', tutorialVideos: [] });
  });

  it('should handle errors and return a 500 status code', async () => {
    // Mock the find method of TutorialVideo model to throw an error
    TutorialVideo.find = jest.fn().mockRejectedValue(new Error('Database error'));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTutorialVideos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('editTutorialVideo', () => {


  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())

  it('should update a tutorial video', async () => {
    // Create a sample video in the database
    const sampleVideo = await TutorialVideo.create({
      embedCode: 'GcGSt8AQBFw',
      title: 'Original Video',
      description: 'This is the original video',
    });

    const req = {
      params: { embedCode: 'GcGSt8AQBFw' },
      body: { title: 'Updated Video', description: 'This is an updated video' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editTutorialVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      message: 'Video updated successfully',
    });

    // Verify that the video was updated in the database
    const updatedVideo = await TutorialVideo.findOne({ embedCode: 'GcGSt8AQBFw' });
    expect(updatedVideo.title).toBe('Updated Video');
    expect(updatedVideo.description).toBe('This is an updated video');
  });

  it('should return a 404 status code when video is not found', async () => {
    const req = {
      params: { embedCode: 'NonExistentCode' }, // Specify a non-existent embed code
      body: { title: 'Updated Video', description: 'This is an updated video' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editTutorialVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Video not found' });
  });

  it('should handle errors and return a 500 status code (database error)', async () => {
    // Mock the findOneAndUpdate method of TutorialVideo model to throw an error
    TutorialVideo.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

    const req = {
      params: { embedCode: 'GcGSt8AQBFw' },
      body: { title: 'Updated Video', description: 'This is an updated video' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editTutorialVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('should handle errors and return a 500 status code (other error)', async () => {
    // Mock the findOneAndUpdate method of TutorialVideo model to throw a generic error
    TutorialVideo.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Some other error'));

    const req = {
      params: { embedCode: 'GcGSt8AQBFw' },
      body: { title: 'Updated Video', description: 'This is an updated video' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await editTutorialVideo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('deleteTutorial', () => {

  beforeAll(async () => await connectDb())
  beforeEach(async () => await clearDatabase())
  afterAll(async () => await closeDatabase())

  it('should delete a tutorial video', async () => {
    // Create a test video in the database
    const testVideo = new TutorialVideo({
      embedCode: 'testEmbedCode',
      title: 'Original Video',
      description: 'This is the original video',
    });
    await testVideo.save();

    // Mock the request and response objects
    const req = {
      params: { embedCode: 'testEmbedCode' }, // Use the same embedCode as the test video
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the deleteTutorial function
    await deleteTutorial(req, res);

    // Check the response status and message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: true, message: "Video deleted successfully" });
  });

  it('should return a 404 status code when video is not found', async () => {
    // Mock the request and response objects with an embedCode that does not exist in the database
    const req = {
      params: { embedCode: 'nonExistentEmbedCode' },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the deleteTutorial function
    await deleteTutorial(req, res);

    // Check the response status and message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Video not found" });
  });

  it('should handle errors and return a 500 status code when there is a server error', async () => {
    // Mock the request and response objects
    const req = {
      params: { embedCode: 'testEmbedCode' },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock an internal server error (e.g., throwing an exception)
    const originalDeleteOne = TutorialVideo.deleteOne;
    TutorialVideo.deleteOne = jest.fn(() => {
      throw new Error('Internal server error');
    });

    // Call the deleteTutorial function
    await deleteTutorial(req, res);

    // Restore the original Mongoose method
    TutorialVideo.deleteOne = originalDeleteOne;

    // Check the response status and error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});