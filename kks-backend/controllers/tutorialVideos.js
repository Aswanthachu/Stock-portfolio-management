import TutorialVideo from "../models/tutorialVideo.js";

export const addTutorialVideo = async (req, res) => {
  try {
    const { embedCode, title, description ,videoType , videoUrl} = req.body;
    const response = await TutorialVideo.create({ embedCode, title, description ,videoType,videoUrl});
    if (response) {
      return res.status(201).json({ status: true, message: "Video added successfully" });
    } else {
      return res.status(500).json({ message: "Failed to add video" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getTutorialVideos = async (req, res) => {
    try {
      const tutorialVideos = await TutorialVideo.find();
      if (tutorialVideos.length > 0) {
        return res.status(200).json({ tutorialVideos });
      } else {
        return res.status(200).json({ message: "No tutorial videos", tutorialVideos: [] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
 
  
 

  export const editTutorialVideo = async (req, res) => {
    try {
      const { embedCode } = req.params;
      const { title, description } = req.body;
  
      const updatedVideo = await TutorialVideo.findOneAndUpdate(
        { embedCode },
        { title, description },
        { new: true } // Return the updated video
      );
  
      if (updatedVideo) {
        return res.status(200).json({ status: true, message: "Video updated successfully" });
      } else {
        return res.status(404).json({ message: "Video not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  export const deleteTutorial = async (req, res) => {
    try {
      const { embedCode } = req.params;
      const response = await TutorialVideo.deleteOne({ embedCode });
      if (response.deletedCount > 0) {
        return res.status(200).json({ status: true, message: "Video deleted successfully" });
      } else {
        return res.status(404).json({ message: "Video not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };