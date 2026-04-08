import express from 'express'
import { register,login,logout } from '../../controller/auth/authController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const authRouter=express.Router()
authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.get('/checkauth',authMiddleware,(req,res)=>{
    const user=req.user 
    res.status(200).json({
        success:true,
        message:"Authenticated user!",
        user
    })
})


export default authRouter