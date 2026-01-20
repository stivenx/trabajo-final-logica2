import { Router } from "express";

import {getDocuments, getDocumentsEspecifi, createDocument, upload,getDocument,deleteDocument} from "../controllers/documentController";

const router = Router();

router.get("/", getDocuments);
router.get("/user/:userId", getDocumentsEspecifi);
router.get("/:id", getDocument);
router.delete("/:id", deleteDocument);
router.post("/create", upload.array("images", 5), createDocument); // hasta 5 imágenes

export default router;