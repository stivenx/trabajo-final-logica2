import {Router } from "express";
import { getAllUsers, getUser, registerUser, loginUser, updateUser, deleteUser} from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);    
router.get("/:id", getUser);
router.post("/register", registerUser);    
router.post("/login", loginUser);    
router.patch("/:id", updateUser);
router.delete("/:id",deleteUser)

export default router;