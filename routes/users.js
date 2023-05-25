import express from "express";
import { search, signup, updateUser ,} from "../controllers/users.js";

const router=express.Router()



// router.get('/:id',getPostById)

// router.post('/signin',signin)
router.post('/signup',signup)
router.get('/search',search)
router.put('/update/:id',updateUser)

export default router
