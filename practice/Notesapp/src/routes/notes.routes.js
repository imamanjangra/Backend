import { Protect } from "../middlware/user.middleware.js";

import {createNotes , getNotesByFolder , updateNotes , deleteNotes , totalNotes , searchNotes } from "../controllers/notes.controllers.js";

import { Router } from "express";

const router = Router();

router.route("/create/:id").post(Protect , createNotes);
router.route("/getNotes/:folderId").get(Protect , getNotesByFolder);
router.route("/update/:id").patch(Protect , updateNotes);
router.route("/delete/:id").delete(Protect , deleteNotes );
router.route("/totalnotes").post(Protect , totalNotes  );
router.get("/search", Protect, searchNotes);

export default router;