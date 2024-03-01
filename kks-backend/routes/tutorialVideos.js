import express from "express";
import { getTutorialVideos, addTutorialVideo ,deleteTutorial, editTutorialVideo } from "../controllers/tutorialVideos.js";

import { isAdmin,isLogined} from "../middlewares/index.js";

const router = express.Router()

router.get('/get-tutorial-videos',getTutorialVideos)
router.post('/add-tutorial-video',isLogined,isAdmin,addTutorialVideo)
router.delete('/delete-tutorial-video/:embedCode',isLogined,isAdmin,deleteTutorial)
router.put('/edit-tutorial-video/:embedCode',isLogined,isAdmin,editTutorialVideo)
export default router;