import express from 'express'
import { getPlanDetails } from '../controllers/plan.js'
const router = express.Router()


router.get('/plan-details/:plan',getPlanDetails)


export default router