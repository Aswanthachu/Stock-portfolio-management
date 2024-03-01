import express from 'express'
import { createCoupon, deleteCoupon, getAllCoupons, validateCoupon } from '../controllers/couponController.js'

import { isAdmin,isLogined} from "../middlewares/index.js";

const router = express.Router()


router.post('/create-coupon',isLogined,isAdmin,createCoupon)
router.post('/validate-coupon',isLogined,validateCoupon)
router.get('/get-all-coupons',isLogined,isAdmin,getAllCoupons)
router.post('/delete-coupon',isLogined,isAdmin,deleteCoupon)


export default router