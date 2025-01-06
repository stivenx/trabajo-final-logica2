import { Router } from "express";
import {getAllTypes, getType, createType, updateType, deleteType,} from "../controllers/typeController";

const router = Router();

router.get("/", getAllTypes);    
router.get("/:id", getType);
router.post("/", createType);    
router.patch("/:id", updateType);
router.delete("/:id",deleteType)


export default router;