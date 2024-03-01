import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String, // Add the appropriate data type for the title
    required: true,
  },
  description: {
    type: String, // Add the appropriate data type for the description
    required: true,
  },
  videoType: {
    type: String, // "upload" or "youtube"
    required: true,
  },
  videoUrl: {
    type: String,
    required: function () {
      return this.videoType === 'upload';
    },
  },
  embedCode: {
    type: String,
    required: function () {
      return this.videoType === 'youtube';
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model using the schema
const TutorialVideo = mongoose.model('tutorialVideo', videoSchema);

export default TutorialVideo;
  
  
  
  