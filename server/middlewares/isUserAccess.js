import User from "../models/user.js";

export const isUserAccess=async(req,res,next)=>{
    const {userId}=req;
    try {
        const existingUser= await User.findById(userId);
        if(existingUser?.role === 1 || existingUser?.role === 4){
            next();
        }else{
            res.status(400).json({message:"You are not a authorized person"});
        }
    } catch (error) {
        console.log(error);
    }
}